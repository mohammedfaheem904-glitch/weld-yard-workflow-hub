import { serverInquirySchema, type SubmitInquiryResult } from "./inquiry-schema";

/** Internal notification recipient (not shown to visitors). */
export const NOTIFICATION_RECIPIENT = "system@weldyard.com";

/** Email safety switch. Defaults to OFF; only the literal string "true" enables it. */
export function isEmailDispatchEnabled(env: Record<string, string | undefined>): boolean {
  return env["INQUIRY_EMAIL_DISPATCH_ENABLED"] === "true";
}

/** Rate limit defaults: 5 submissions per 10 minutes per client. Overridable via server env. */
export const RATE_LIMIT_DEFAULTS = { max: 5, windowSeconds: 600 } as const;

function intEnv(v: string | undefined, fallback: number, min: number, max: number): number {
  const n = Number(v);
  return Number.isInteger(n) && n >= min && n <= max ? n : fallback;
}

export function rateLimitConfig(env: Record<string, string | undefined>) {
  return {
    max: intEnv(env["INQUIRY_RATE_LIMIT_MAX"], RATE_LIMIT_DEFAULTS.max, 1, 1000),
    windowSeconds: intEnv(env["INQUIRY_RATE_LIMIT_WINDOW_SECONDS"], RATE_LIMIT_DEFAULTS.windowSeconds, 10, 86400),
  };
}

/**
 * Trusted client identity: only the edge-set `cf-connecting-ip` header is used.
 * Browser-controllable headers (x-forwarded-for, x-real-ip) and form fields are ignored.
 * Without it, all such requests share one bucket (fails safe rather than open).
 */
export async function clientBucket(cfConnectingIp: string | undefined | null, salt: string): Promise<string> {
  const ip = cfConnectingIp?.trim();
  const id = ip && ip.length <= 64 ? ip : "unidentified";
  const bytes = new TextEncoder().encode(`${salt}:${id}`);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return "ip:" + Array.from(new Uint8Array(hash), (b) => b.toString(16).padStart(2, "0")).join("");
}

type RpcClient = {
  rpc: (fn: string, args: Record<string, unknown>) => PromiseLike<{ data: unknown; error: unknown }>;
};

export type PersistContext = { bucket: string; limit: { max: number; windowSeconds: number } };

/**
 * Validates untrusted input and stores the inquiry + its outbox event atomically.
 * Order: validate → bot check → rate limit → store. Never calls an email provider.
 * Returns only safe, generic results — no database details, counters or IPs reach the browser.
 */
export async function persistInquiry(raw: unknown, db: RpcClient, ctx: PersistContext): Promise<SubmitInquiryResult> {
  const parsed = serverInquirySchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const v = parsed.data;

  // Automated submission: acknowledge generically, store nothing.
  if (v.hp) return { ok: true };

  const rl = await db.rpc("consume_inquiry_rate_limit", {
    p_bucket: ctx.bucket,
    p_limit: ctx.limit.max,
    p_window_seconds: ctx.limit.windowSeconds,
  });
  if (rl.error || rl.data !== true) {
    if (rl.error) console.error("[inquiry] rate limit check failed, code:", (rl.error as { code?: string }).code ?? "unknown");
    return { ok: false, error: "unavailable" };
  }

  const { error } = await db.rpc("submit_inquiry", {
    p_inquiry_type: v.inquiryType,
    p_name: v.name,
    p_email: v.email,
    p_company: v.company ?? null,
    p_phone: v.phone ?? null,
    p_topic: v.topic ?? null,
    p_message: v.message,
    p_idempotency_key: v.idempotencyKey,
    p_recipient: NOTIFICATION_RECIPIENT,
  });
  if (error) {
    const code = (error as { code?: string }).code ?? "unknown";
    console.error("[inquiry] persist failed, code:", code);
    return { ok: false, error: code === "22023" || code === "23514" ? "invalid" : "unavailable" };
  }
  return { ok: true };
}
