import { z } from "zod";

export const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  hp: z.string().max(200).optional().default(""),
});

export type NewsletterResult = { ok: true } | { ok: false; error: "invalid" | "unavailable" };

type RpcClient = {
  rpc: (fn: string, args: Record<string, unknown>) => PromiseLike<{ data: unknown; error: unknown }>;
};

/**
 * Stores a newsletter subscription only — never sends email.
 * Order: validate → bot trap → rate limit (own "nl:" bucket) → store.
 * Duplicate active subscriptions return the same generic success (no list enumeration).
 */
export async function persistSubscription(
  raw: unknown,
  db: RpcClient,
  ctx: { bucket: string; limit: { max: number; windowSeconds: number } },
): Promise<NewsletterResult> {
  const parsed = newsletterSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  if (parsed.data.hp) return { ok: true };

  const rl = await db.rpc("consume_inquiry_rate_limit", {
    p_bucket: `nl:${ctx.bucket}`,
    p_limit: ctx.limit.max,
    p_window_seconds: ctx.limit.windowSeconds,
  });
  if (rl.error || rl.data !== true) return { ok: false, error: "unavailable" };

  const { error } = await db.rpc("subscribe_newsletter", { p_email: parsed.data.email });
  if (error) {
    const code = (error as { code?: string }).code ?? "unknown";
    console.error("[newsletter] persist failed, code:", code);
    return { ok: false, error: code === "22023" ? "invalid" : "unavailable" };
  }
  return { ok: true };
}
