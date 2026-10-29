// @vitest-environment node
// Runs against the real backend; no email provider is involved. Skipped without server credentials,
// and skipped if any non-test notification is queued so real records are never claimed.
import { describe, it, expect, afterAll, beforeAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

const url = process.env["SUPABASE_URL"];
const service = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const anonKey = process.env["SUPABASE_PUBLISHABLE_KEY"];
const ready = !!(url && service && anonKey);
const TEST_RECIPIENT = "claim-test@example.invalid";

const shim = (key: string) => (input: RequestInfo | URL, init?: RequestInit) => {
  const h = new Headers(init?.headers);
  if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
  h.set("apikey", key);
  return fetch(input, { ...init, headers: h });
};
const admin = ready ? createClient(url!, service!, { auth: { persistSession: false }, global: { fetch: shim(service!) } }) : null!;
const anon = ready ? createClient(url!, anonKey!, { auth: { persistSession: false }, global: { fetch: shim(anonKey!) } }) : null!;

const inquiryIds: string[] = [];
let isolated = false;

async function seed(): Promise<string> {
  const key = crypto.randomUUID();
  const { error } = await admin.rpc("submit_inquiry", {
    p_inquiry_type: "contact", p_name: "Claim Test", p_email: "t@example.invalid", p_company: null, p_phone: null,
    p_topic: null, p_message: "integration test", p_idempotency_key: key, p_recipient: TEST_RECIPIENT,
  });
  if (error) throw error;
  const { data } = await admin.from("inquiries").select("id").eq("idempotency_key", key).single();
  inquiryIds.push(data!.id);
  const { data: n } = await admin.from("inquiry_notifications").select("id").eq("inquiry_id", data!.id).single();
  return n!.id as string;
}
const row = async (id: string) => (await admin.from("inquiry_notifications").select("*").eq("id", id).single()).data!;
const claim = (limit = 10) => admin.rpc("claim_inquiry_notifications", { p_limit: limit, p_stale_after: "15 minutes" });

beforeAll(async () => {
  if (!ready) return;
  const { count } = await admin.from("inquiry_notifications").select("id", { count: "exact", head: true })
    .in("status", ["pending", "processing"]).neq("recipient", TEST_RECIPIENT);
  isolated = count === 0;
});
afterAll(async () => {
  if (ready && inquiryIds.length) await admin.from("inquiries").delete().in("id", inquiryIds);
});

describe.skipIf(!ready)("notification claim", () => {
  it("visitors cannot claim or complete", async () => {
    expect((await anon.rpc("claim_inquiry_notifications", { p_limit: 1 })).error).not.toBeNull();
    expect((await anon.rpc("complete_inquiry_notification", { p_id: crypto.randomUUID(), p_claim_token: new Date().toISOString(), p_success: true })).error).not.toBeNull();
  });

  it("20 concurrent workers never claim the same notification twice", async () => {
    if (!isolated) return;
    const ids = await Promise.all(Array.from({ length: 8 }, seed));
    const results = await Promise.all(Array.from({ length: 20 }, () => claim(3)));
    const claimed = results.flatMap((r) => (r.data ?? []) as { id: string }[]).map((r) => r.id).filter((id) => ids.includes(id));
    expect(new Set(claimed).size).toBe(claimed.length);
    expect(claimed.sort()).toEqual([...ids].sort());
    for (const id of ids) expect((await row(id)).attempts).toBe(1);
  });

  it("a stale processing claim is reclaimed and the old worker's result is rejected", async () => {
    if (!isolated) return;
    const id = await seed();
    const first = ((await claim()).data as { id: string; claim_token: string }[]).find((r) => r.id === id)!;
    // Fresh claim is not stealable.
    expect(((await claim()).data as { id: string }[]).some((r) => r.id === id)).toBe(false);
    // Simulate a crashed worker.
    await admin.from("inquiry_notifications").update({ locked_at: new Date(Date.now() - 3600_000).toISOString() }).eq("id", id);
    const staleToken = (await row(id)).locked_at as string;
    const second = ((await claim()).data as { id: string; claim_token: string; attempts: number }[]).find((r) => r.id === id)!;
    expect(second.attempts).toBe(2);
    const late = await admin.rpc("complete_inquiry_notification", { p_id: id, p_claim_token: staleToken, p_success: true, p_provider_message_id: "old" });
    expect(late.data).toBe("lost_claim");
    expect(first.claim_token).not.toBe(second.claim_token);
    const ok = await admin.rpc("complete_inquiry_notification", { p_id: id, p_claim_token: second.claim_token, p_success: true, p_provider_message_id: "mock_1" });
    expect(ok.data).toBe("sent");
    expect((await row(id)).provider_message_id).toBe("mock_1");
  });

  it("transient failure goes back to pending with backoff; final attempt becomes failed", async () => {
    if (!isolated) return;
    const id = await seed();
    await admin.from("inquiry_notifications").update({ max_attempts: 2 }).eq("id", id);
    let c = ((await claim()).data as { id: string; claim_token: string }[]).find((r) => r.id === id)!;
    const r1 = await admin.rpc("complete_inquiry_notification", { p_id: id, p_claim_token: c.claim_token, p_success: false, p_error: "provider_http_503", p_retry_delay_seconds: 60 });
    expect(r1.data).toBe("pending");
    expect(new Date((await row(id)).next_attempt_at).getTime()).toBeGreaterThan(Date.now() + 30_000);
    expect(((await claim()).data as { id: string }[]).some((r) => r.id === id)).toBe(false); // not due yet
    await admin.from("inquiry_notifications").update({ next_attempt_at: new Date(Date.now() - 1000).toISOString() }).eq("id", id);
    c = ((await claim()).data as { id: string; claim_token: string }[]).find((r) => r.id === id)!;
    const r2 = await admin.rpc("complete_inquiry_notification", { p_id: id, p_claim_token: c.claim_token, p_success: false, p_error: "provider_http_503" });
    expect(r2.data).toBe("failed");
  });

  it("permanent failure is terminal on the first attempt", async () => {
    if (!isolated) return;
    const id = await seed();
    const c = ((await claim()).data as { id: string; claim_token: string }[]).find((r) => r.id === id)!;
    const r = await admin.rpc("complete_inquiry_notification", { p_id: id, p_claim_token: c.claim_token, p_success: false, p_error: "provider_http_403", p_permanent: true });
    expect(r.data).toBe("failed");
  });

  it("a crashed worker on its final attempt ends as failed, not retried forever", async () => {
    if (!isolated) return;
    const id = await seed();
    await admin.from("inquiry_notifications").update({ max_attempts: 1 }).eq("id", id);
    await claim();
    await admin.from("inquiry_notifications").update({ locked_at: new Date(Date.now() - 3600_000).toISOString() }).eq("id", id);
    await claim();
    const r = await row(id);
    expect(r.status).toBe("failed");
    expect(r.last_error).toBe("worker_lost_after_final_attempt");
  });
});
