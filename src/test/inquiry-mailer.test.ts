// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import {
  dispatchPendingInquiryNotifications, renderInquiryEmail, escapeHtml, retryDelay, isPermanent,
  resendTransport, type ClaimedNotification, type Transport,
} from "@/lib/inquiry-mailer.server";

const ON = { INQUIRY_EMAIL_DISPATCH_ENABLED: "true" };
const note = (o: Partial<ClaimedNotification> = {}): ClaimedNotification => ({
  id: "n1", claim_token: "2026-01-01T00:00:00Z", attempts: 1, max_attempts: 5, recipient: "system@weldyard.com",
  inquiry_id: "i1", inquiry_type: "quote", name: "Ali", email: "ali@example.com", company: "ACME",
  phone: null, topic: null, message: "Hello", inquiry_created_at: "2026-01-01T00:00:00Z", ...o,
});
function fakeDb(batch: ClaimedNotification[], completeStatus = "sent") {
  const calls: { fn: string; args: Record<string, unknown> }[] = [];
  return {
    calls,
    rpc: vi.fn(async (fn: string, args: Record<string, unknown>) => {
      calls.push({ fn, args });
      if (fn === "claim_inquiry_notifications") return { data: batch, error: null };
      return { data: completeStatus, error: null };
    }),
  };
}

describe("safety switch", () => {
  for (const env of [{}, { INQUIRY_EMAIL_DISPATCH_ENABLED: "false" }, { INQUIRY_EMAIL_DISPATCH_ENABLED: "TRUE" }, { INQUIRY_EMAIL_DISPATCH_ENABLED: "1" }]) {
    it(`does nothing when switch is ${JSON.stringify(env)}`, async () => {
      const db = fakeDb([note()]);
      const transport = vi.fn<Transport>();
      const fetchSpy = vi.spyOn(globalThis, "fetch");
      const s = await dispatchPendingInquiryNotifications(db, env, { transport });
      expect(s.enabled).toBe(false);
      expect(db.rpc).not.toHaveBeenCalled();
      expect(transport).not.toHaveBeenCalled();
      expect(fetchSpy).not.toHaveBeenCalled();
      fetchSpy.mockRestore();
    });
  }
});

describe("templates", () => {
  it("escapes HTML in every user field", () => {
    const evil = `<script>alert("x")</script>&'`;
    const m = renderInquiryEmail(note({ name: evil, company: evil, topic: evil, phone: evil, message: evil }));
    expect(m.html).not.toContain("<script>");
    expect(m.html).toContain("&lt;script&gt;alert(&quot;x&quot;)&lt;/script&gt;&amp;&#39;");
    expect(escapeHtml(`<>&"'`)).toBe("&lt;&gt;&amp;&quot;&#39;");
  });
  it("strips line breaks from the subject and sends only to the internal recipient", () => {
    const m = renderInquiryEmail(note({ company: "ACME\r\nBcc: x@evil.com" }));
    expect(m.subject).not.toMatch(/[\r\n]/);
    expect(m.to).toEqual(["system@weldyard.com"]);
    expect(m.from).toBe("Weld Yard <system@weldyard.com>");
  });
  it("omits reply-to for malformed visitor email", () => {
    expect(renderInquiryEmail(note({ email: "a@b.com, c@d.com" })).reply_to).toBeUndefined();
    expect(renderInquiryEmail(note()).reply_to).toBe("ali@example.com");
  });
});

describe("retries and failures", () => {
  it("backs off 1m, 5m, 25m, ~2h", () => {
    expect([1, 2, 3, 4, 5].map(retryDelay)).toEqual([60, 300, 1500, 7500, 7500]);
  });
  it("classifies permanent vs transient provider errors", () => {
    expect(isPermanent(403)).toBe(true);
    expect(isPermanent(422)).toBe(true);
    expect(isPermanent(429)).toBe(false);
    expect(isPermanent(500)).toBe(false);
  });
  it("records success with the claim token and provider id", async () => {
    const db = fakeDb([note()]);
    const s = await dispatchPendingInquiryNotifications(db, ON, { transport: async () => ({ ok: true, id: "re_1" }) });
    expect(s).toMatchObject({ claimed: 1, sent: 1 });
    expect(db.calls[1].args).toMatchObject({ p_id: "n1", p_claim_token: "2026-01-01T00:00:00Z", p_success: true, p_provider_message_id: "re_1" });
  });
  it("schedules a transient retry with backoff", async () => {
    const db = fakeDb([note({ attempts: 2 })], "pending");
    const s = await dispatchPendingInquiryNotifications(db, ON, { transport: async () => ({ ok: false, status: 503, permanent: false }), log: () => {} });
    expect(s.retrying).toBe(1);
    expect(db.calls[1].args).toMatchObject({ p_success: false, p_permanent: false, p_retry_delay_seconds: 300, p_error: "provider_http_503" });
  });
  it("marks permanent failures terminal", async () => {
    const db = fakeDb([note()], "failed");
    const s = await dispatchPendingInquiryNotifications(db, ON, { transport: async () => ({ ok: false, status: 403, permanent: true }), log: () => {} });
    expect(s.failed).toBe(1);
    expect(db.calls[1].args).toMatchObject({ p_permanent: true });
  });
  it("counts a claim taken over by another worker as lost (duplicate-delivery risk is surfaced)", async () => {
    const db = fakeDb([note()], "lost_claim");
    const s = await dispatchPendingInquiryNotifications(db, ON, { transport: async () => ({ ok: true, id: "re_1" }) });
    expect(s.lost).toBe(1);
  });
  it("uses a stable idempotency key per notification", async () => {
    const keys: string[] = [];
    const t: Transport = async (_m, k) => { keys.push(k); return { ok: true, id: "x" }; };
    await dispatchPendingInquiryNotifications(fakeDb([note()]), ON, { transport: t });
    await dispatchPendingInquiryNotifications(fakeDb([note()]), ON, { transport: t });
    expect(keys).toEqual(["inquiry-notification/n1", "inquiry-notification/n1"]);
  });
});

describe("sanitized logs", () => {
  it("never logs visitor data, keys or provider bodies", async () => {
    const lines: string[] = [];
    const fetchImpl = vi.fn(async () => new Response("secret body ali@example.com", { status: 500 })) as unknown as typeof fetch;
    const transport = resendTransport({ LOVABLE_API_KEY: "lk_SECRET", RESEND_API_KEY: "re_SECRET" }, fetchImpl);
    await dispatchPendingInquiryNotifications(fakeDb([note({ message: "PRIVATE MSG" })], "pending"), ON, { transport, log: (m) => lines.push(m) });
    const all = lines.join("\n");
    expect(all).toContain("provider_http_500");
    for (const bad of ["SECRET", "ali@example.com", "PRIVATE MSG", "secret body", "Ali"]) expect(all).not.toContain(bad);
  });
  it("transport refuses to build without credentials", () => {
    expect(() => resendTransport({})).toThrow("not configured");
  });
});
