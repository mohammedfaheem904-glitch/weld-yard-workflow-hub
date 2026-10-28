// @vitest-environment node
// Runs against the real backend. Skipped (BLOCKED) when server credentials are not present.
import { describe, it, expect, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";
import { persistInquiry } from "@/lib/inquiry.server";

const url = process.env["SUPABASE_URL"];
const service = process.env["SUPABASE_SERVICE_ROLE_KEY"];
const anonKey = process.env["SUPABASE_PUBLISHABLE_KEY"];
const ready = !!(url && service && anonKey);

const shim = (key: string) => (input: RequestInfo | URL, init?: RequestInit) => {
  const h = new Headers(init?.headers);
  if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
  h.set("apikey", key);
  return fetch(input, { ...init, headers: h });
};
const admin = ready ? createClient(url!, service!, { auth: { persistSession: false }, global: { fetch: shim(service!) } }) : null!;
const anon = ready ? createClient(url!, anonKey!, { auth: { persistSession: false }, global: { fetch: shim(anonKey!) } }) : null!;

const keys: string[] = [];
const newKey = () => { const k = crypto.randomUUID(); keys.push(k); return k; };
const input = (inquiryType: string, idempotencyKey: string) => ({
  inquiryType, idempotencyKey, name: "ZZ Automated Test", email: "qa-test@example.com", message: "Automated test — safe to ignore",
});
const rowsFor = async (k: string) => {
  const { data: inq } = await admin.from("inquiries").select("id").eq("idempotency_key", k);
  const ids = (inq ?? []).map((r) => r.id);
  const { data: out } = ids.length ? await admin.from("inquiry_notifications").select("*").in("inquiry_id", ids) : { data: [] };
  return { inq: inq ?? [], out: out ?? [] };
};
// Each test gets its own throwaway rate-limit bucket (cleaned up afterwards).
const buckets: string[] = [];
const ctx = (max = 50) => { const b = `test:${crypto.randomUUID()}`; buckets.push(b); return { bucket: b, limit: { max, windowSeconds: 600 } }; };

afterAll(async () => {
  if (ready && keys.length) await admin.from("inquiries").delete().in("idempotency_key", keys);
  if (ready && buckets.length) await admin.from("inquiry_rate_limits").delete().in("bucket", buckets);
});

describe.skipIf(!ready)("database: rate limiting", () => {
  it("allows up to the limit, then blocks without storing", async () => {
    const c = ctx(3);
    const results = [];
    for (let i = 0; i < 4; i++) results.push(await persistInquiry(input("contact", newKey()), admin, c));
    expect(results.slice(0, 3)).toEqual([{ ok: true }, { ok: true }, { ok: true }]);
    expect(results[3]).toEqual({ ok: false, error: "unavailable" });
    const blockedKey = keys[keys.length - 1]!;
    expect((await rowsFor(blockedKey)).inq).toHaveLength(0);
  });

  it("concurrent requests cannot exceed the limit", async () => {
    const c = ctx(5);
    const res = await Promise.all(Array.from({ length: 12 }, () => persistInquiry(input("quote", newKey()), admin, c)));
    expect(res.filter((r) => r.ok)).toHaveLength(5);
  });

  it("visitors cannot read or call the rate limiter", async () => {
    const r = await anon.from("inquiry_rate_limits").select("bucket").limit(1);
    expect(r.error).not.toBeNull();
    const f = await anon.rpc("consume_inquiry_rate_limit", { p_bucket: "x", p_limit: 5, p_window_seconds: 600 });
    expect(f.error).not.toBeNull();
  });
});

describe.skipIf(!ready)("database: bot trap", () => {
  it.each(["contact", "quote", "dwm_demo"])("%s with filled trap creates no inquiry or notification", async (t) => {
    const k = newKey();
    expect(await persistInquiry({ ...input(t, k), hp: "spam" }, admin, ctx())).toEqual({ ok: true });
    const { inq, out } = await rowsFor(k);
    expect(inq).toHaveLength(0);
    expect(out).toHaveLength(0);
  });
});

describe.skipIf(!ready)("database: atomic inquiry + outbox", () => {
  it("leaves existing inquiries untouched", async () => {
    const { count: before } = await admin.from("inquiries").select("*", { count: "exact", head: true }).is("idempotency_key", null);
    await persistInquiry(input("contact", newKey()), admin, ctx());
    const { count: after } = await admin.from("inquiries").select("*", { count: "exact", head: true }).is("idempotency_key", null);
    expect(after).toBe(before);
  });

  it.each(["contact", "quote", "dwm_demo"])("%s creates exactly one inquiry and one pending outbox row", async (t) => {
    const k = newKey();
    expect(await persistInquiry(input(t, k), admin, ctx())).toEqual({ ok: true });
    const { inq, out } = await rowsFor(k);
    expect(inq).toHaveLength(1);
    expect(out).toHaveLength(1);
    expect(out[0]).toMatchObject({ status: "pending", attempts: 0, recipient: "system@weldyard.com", sent_at: null, provider_message_id: null });
  });

  it("is idempotent: the same key twice stores one inquiry and one outbox row", async () => {
    const k = newKey();
    await persistInquiry(input("quote", k), admin, ctx());
    await persistInquiry(input("quote", k), admin, ctx());
    const { inq, out } = await rowsFor(k);
    expect(inq).toHaveLength(1);
    expect(out).toHaveLength(1);
  });

  it("concurrent duplicate submits still store once", async () => {
    const k = newKey();
    await Promise.all([1, 2, 3].map(() => persistInquiry(input("contact", k), admin, ctx())));
    const { inq, out } = await rowsFor(k);
    expect(inq).toHaveLength(1);
    expect(out).toHaveLength(1);
  });

  it("rolls back the inquiry when the outbox insert fails", async () => {
    const k = newKey();
    const { error } = await admin.rpc("submit_inquiry", {
      p_inquiry_type: "contact", p_name: "ZZ Rollback", p_email: "qa-test@example.com", p_company: null, p_phone: null,
      p_topic: null, p_message: "rollback", p_idempotency_key: k, p_recipient: "not-an-address",
    });
    expect(error).not.toBeNull();
    expect((await rowsFor(k)).inq).toHaveLength(0);
  });

  it("database rejects an unsupported inquiry type even if called directly", async () => {
    const { error } = await admin.rpc("submit_inquiry", {
      p_inquiry_type: "newsletter", p_name: "x", p_email: "qa-test@example.com", p_company: null, p_phone: null,
      p_topic: null, p_message: "x", p_idempotency_key: newKey(), p_recipient: "system@weldyard.com",
    });
    expect(error).not.toBeNull();
  });
});

describe.skipIf(!ready)("database: browser access is locked", () => {
  it("visitors cannot read the outbox", async () => {
    const { data, error } = await anon.from("inquiry_notifications").select("id").limit(1);
    expect(error !== null || (data ?? []).length === 0).toBe(true);
  });
  it("visitors cannot write or change the outbox", async () => {
    const ins = await anon.from("inquiry_notifications").insert({ inquiry_id: crypto.randomUUID(), recipient: "a@b.co" });
    expect(ins.error).not.toBeNull();
    const upd = await anon.from("inquiry_notifications").update({ status: "sent" }).neq("status", "x").select();
    expect(upd.error !== null || (upd.data ?? []).length === 0).toBe(true);
  });
  it("visitors cannot call the submit function directly", async () => {
    const { error } = await anon.rpc("submit_inquiry", {
      p_inquiry_type: "contact", p_name: "x", p_email: "qa-test@example.com", p_company: null, p_phone: null,
      p_topic: null, p_message: "x", p_idempotency_key: newKey(), p_recipient: "system@weldyard.com",
    });
    expect(error).not.toBeNull();
  });
  it("visitors cannot insert inquiries directly (server path only)", async () => {
    const { error } = await anon.from("inquiries").insert({ inquiry_type: "contact", name: "x", email: "qa-test@example.com", message: "x" });
    expect(error).not.toBeNull();
  });
  it("visitors cannot read inquiries", async () => {
    const { error } = await anon.from("inquiries").select("id").limit(1);
    expect(error).not.toBeNull();
  });
  it("visitors cannot update or delete inquiries (no table privileges at all)", async () => {
    const upd = await anon.from("inquiries").update({ message: "x" }).eq("id", crypto.randomUUID());
    expect(upd.error).not.toBeNull();
    const del = await anon.from("inquiries").delete().eq("id", crypto.randomUUID());
    expect(del.error).not.toBeNull();
  });
});
