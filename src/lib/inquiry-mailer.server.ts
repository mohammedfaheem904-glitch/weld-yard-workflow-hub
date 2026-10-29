/**
 * Inquiry notification dispatcher (server-only). NOT wired to any trigger or schedule.
 *
 * Delivery model: at-least-once. A notification is claimed atomically (FOR UPDATE SKIP LOCKED),
 * sent, then completed using its claim token. If the provider accepts the email but the worker
 * dies before completion, the claim goes stale and is retried — a duplicate email is possible.
 * The provider Idempotency-Key (stable per notification) narrows that window to the provider's
 * idempotency retention (Resend documents 24h); exactly-once is NOT guaranteed.
 */
import { isEmailDispatchEnabled } from "./inquiry.server";

export const SENDER = "Weld Yard <system@weldyard.com>";
export const RETRY_DELAYS_SECONDS = [60, 300, 1500, 7500] as const;
const TYPE_LABEL: Record<string, string> = { contact: "Contact", quote: "Quote request", dwm_demo: "DWM demo request" };

export type ClaimedNotification = {
  id: string; claim_token: string; attempts: number; max_attempts: number; recipient: string;
  inquiry_id: string; inquiry_type: string; name: string; email: string;
  company: string | null; phone: string | null; topic: string | null; message: string; inquiry_created_at: string;
};
export type EmailMessage = { from: string; to: string[]; reply_to?: string; subject: string; html: string; text: string };
export type SendResult = { ok: true; id: string } | { ok: false; status: number; permanent: boolean };
export type Transport = (msg: EmailMessage, idempotencyKey: string) => Promise<SendResult>;
type RpcClient = { rpc: (fn: string, args: Record<string, unknown>) => PromiseLike<{ data: unknown; error: unknown }> };

export function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}
/** Strips CR/LF and control chars so user text cannot inject headers into the subject. */
const oneLine = (s: string) => s.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, 120);

export function renderInquiryEmail(n: ClaimedNotification): EmailMessage {
  const label = TYPE_LABEL[n.inquiry_type] ?? "Inquiry";
  const rows: [string, string | null][] = [
    ["Type", label], ["Name", n.name], ["Email", n.email], ["Company", n.company],
    ["Phone", n.phone], ["Topic", n.topic], ["Received", n.inquiry_created_at], ["Reference", n.inquiry_id],
  ];
  const present = rows.filter((r): r is [string, string] => !!r[1]);
  const text = present.map(([k, v]) => `${k}: ${v}`).join("\n") + `\n\nMessage:\n${n.message}\n`;
  const html =
    `<div style="font-family:Arial,sans-serif;color:#1a1a1a;max-width:600px">` +
    `<h2 style="color:#FF914D;margin:0 0 16px">New ${escapeHtml(label)}</h2><table cellpadding="6" style="border-collapse:collapse">` +
    present.map(([k, v]) => `<tr><td style="color:#666;vertical-align:top">${escapeHtml(k)}</td><td>${escapeHtml(v)}</td></tr>`).join("") +
    `</table><h3 style="margin:20px 0 8px">Message</h3><p style="white-space:pre-wrap">${escapeHtml(n.message)}</p></div>`;
  const validReply = /^[^@\s<>,;"]+@[^@\s<>,;"]+\.[^@\s<>,;"]+$/.test(n.email);
  return {
    from: SENDER, to: [n.recipient], ...(validReply ? { reply_to: n.email } : {}),
    subject: `Weld Yard ${label}: ${oneLine(n.company || n.name)}`, html, text,
  };
}

/** Error text stored/logged never includes provider bodies, addresses or message content. */
export function sanitizeError(r: Extract<SendResult, { ok: false }>): string {
  return r.status === 0 ? "network_error" : `provider_http_${r.status}`;
}
export function retryDelay(attempt: number): number {
  return RETRY_DELAYS_SECONDS[Math.min(Math.max(attempt, 1), RETRY_DELAYS_SECONDS.length) - 1] ?? 7500;
}
/** 4xx (except 408/409/429) are configuration/content problems — retrying will not help. */
export function isPermanent(status: number): boolean {
  return status >= 400 && status < 500 && ![408, 409, 429].includes(status);
}

/** Resend via the Lovable connector gateway. Only constructed when dispatch is enabled. */
export function resendTransport(env: Record<string, string | undefined>, fetchImpl: typeof fetch = fetch): Transport {
  const lovableKey = env["LOVABLE_API_KEY"], resendKey = env["RESEND_API_KEY"];
  if (!lovableKey || !resendKey) throw new Error("email transport not configured");
  return async (msg, idempotencyKey) => {
    try {
      const res = await fetchImpl("https://connector-gateway.lovable.dev/resend/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", Authorization: `Bearer ${lovableKey}`,
          "X-Connection-Api-Key": resendKey, "Idempotency-Key": idempotencyKey,
        },
        body: JSON.stringify(msg),
      });
      if (!res.ok) return { ok: false, status: res.status, permanent: isPermanent(res.status) };
      const body = (await res.json().catch(() => ({}))) as { id?: unknown };
      return { ok: true, id: typeof body.id === "string" ? body.id : "unknown" };
    } catch {
      return { ok: false, status: 0, permanent: false };
    }
  };
}

export type DispatchSummary = { enabled: boolean; claimed: number; sent: number; retrying: number; failed: number; lost: number };

/**
 * Processes one batch and awaits every send — intended for a future awaited worker/scheduled call.
 * When the safety switch is off it returns immediately: no database claim, no transport, no network.
 */
export async function dispatchPendingInquiryNotifications(
  db: RpcClient, env: Record<string, string | undefined>,
  opts: { transport?: Transport; limit?: number; log?: (msg: string) => void } = {},
): Promise<DispatchSummary> {
  const summary: DispatchSummary = { enabled: false, claimed: 0, sent: 0, retrying: 0, failed: 0, lost: 0 };
  if (!isEmailDispatchEnabled(env)) return summary;
  summary.enabled = true;
  const log = opts.log ?? ((m: string) => console.error(m));
  const transport = opts.transport ?? resendTransport(env);

  const { data, error } = await db.rpc("claim_inquiry_notifications", { p_limit: opts.limit ?? 10 });
  if (error) { log(`[mailer] claim failed, code: ${(error as { code?: string }).code ?? "unknown"}`); return summary; }
  const batch = (data ?? []) as ClaimedNotification[];
  summary.claimed = batch.length;

  for (const n of batch) {
    const r = await transport(renderInquiryEmail(n), `inquiry-notification/${n.id}`);
    const args = r.ok
      ? { p_success: true, p_provider_message_id: r.id }
      : { p_success: false, p_error: sanitizeError(r), p_permanent: r.permanent, p_retry_delay_seconds: retryDelay(n.attempts) };
    const done = await db.rpc("complete_inquiry_notification", { p_id: n.id, p_claim_token: n.claim_token, ...args });
    const status = done.error ? "lost_claim" : String(done.data);
    if (done.error) log(`[mailer] complete failed for ${n.id}, code: ${(done.error as { code?: string }).code ?? "unknown"}`);
    if (!r.ok) log(`[mailer] send failed for ${n.id}: ${sanitizeError(r)}`);
    if (status === "sent") summary.sent++;
    else if (status === "pending") summary.retrying++;
    else if (status === "failed") summary.failed++;
    else summary.lost++;
  }
  return summary;
}
