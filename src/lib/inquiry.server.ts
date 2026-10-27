import { serverInquirySchema, type SubmitInquiryResult } from "./inquiry-schema";

/** Internal notification recipient (not shown to visitors). */
export const NOTIFICATION_RECIPIENT = "system@weldyard.com";

/** Email safety switch. Defaults to OFF; only the literal string "true" enables it. */
export function isEmailDispatchEnabled(env: Record<string, string | undefined>): boolean {
  return env["INQUIRY_EMAIL_DISPATCH_ENABLED"] === "true";
}

type RpcClient = {
  rpc: (fn: "submit_inquiry", args: Record<string, unknown>) => PromiseLike<{ data: unknown; error: unknown }>;
};

/**
 * Validates untrusted input and stores the inquiry + its outbox event atomically.
 * Never calls an email provider: delivery is a separate, not-yet-enabled phase.
 * Returns only safe, generic results — no database details reach the browser.
 */
export async function persistInquiry(raw: unknown, db: RpcClient): Promise<SubmitInquiryResult> {
  const parsed = serverInquirySchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const v = parsed.data;
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
