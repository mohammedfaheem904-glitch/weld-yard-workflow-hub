// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import {
  persistInquiry,
  isEmailDispatchEnabled,
  NOTIFICATION_RECIPIENT,
  rateLimitConfig,
  clientBucket,
  type PersistContext,
} from "@/lib/inquiry.server";

const base = {
  name: "Test User",
  email: "  Buyer@Example.COM ",
  company: "Acme",
  phone: "",
  topic: "Welding Products",
  message: "Need rods",
  idempotencyKey: "7f1c3c1e-2b1a-4c4e-9a7e-1f2d3c4b5a69",
};
const ctx: PersistContext = { bucket: "ip:test", limit: { max: 5, windowSeconds: 600 } };
const okDb = (allowed = true) => ({ // rpc(fn, args)
  rpc: vi.fn(async (fn: string, _args?: Record<string, unknown>) =>
    fn === "consume_inquiry_rate_limit"
      ? { data: allowed, error: null }
      : { data: [{ inquiry_id: "x", duplicate: false }], error: null },
  ),
});
const calls = (db: ReturnType<typeof okDb>, fn: string) => db.rpc.mock.calls.filter((c) => c[0] === fn);

describe("server-side inquiry validation", () => {
  it.each(["contact", "quote", "dwm_demo"])("accepts a valid %s submission", async (inquiryType) => {
    const db = okDb();
    expect(await persistInquiry({ ...base, inquiryType }, db, ctx)).toEqual({ ok: true });
    const args = calls(db, "submit_inquiry")[0]![1] as Record<string, unknown>;
    expect(args["p_inquiry_type"]).toBe(inquiryType);
    expect(args["p_email"]).toBe("buyer@example.com");
    expect(args["p_phone"]).toBeNull();
    expect(args["p_recipient"]).toBe("system@weldyard.com");
  });

  it.each([
    ["invalid email", { email: "not-an-email" }],
    ["oversized name (121)", { name: "a".repeat(121) }],
    ["oversized message (3001)", { message: "a".repeat(3001) }],
    ["oversized company (161)", { company: "a".repeat(161) }],
    ["oversized phone (41)", { phone: "1".repeat(41) }],
    ["empty message", { message: "   " }],
    ["unsupported type", { inquiryType: "newsletter" }],
    ["missing idempotency key", { idempotencyKey: "abc" }],
  ])("rejects %s without touching the database", async (_l, patch) => {
    const db = okDb();
    expect(await persistInquiry({ ...base, inquiryType: "contact", ...patch }, db, ctx)).toEqual({ ok: false, error: "invalid" });
    expect(db.rpc).not.toHaveBeenCalled();
  });

  it("returns a generic error and hides database details", async () => {
    const db = {
      rpc: vi.fn(async (fn: string, _args?: Record<string, unknown>) =>
        fn === "consume_inquiry_rate_limit" ? { data: true, error: null } : { data: null, error: { code: "XX000", message: "secret internal detail" } },
      ),
    };
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await persistInquiry({ ...base, inquiryType: "quote" }, db, ctx);
    expect(res).toEqual({ ok: false, error: "unavailable" });
    expect(JSON.stringify(res)).not.toContain("secret");
  });
});

describe("bot trap (honeypot)", () => {
  it.each(["contact", "quote", "dwm_demo"])("%s: filled trap stores nothing and answers generically", async (inquiryType) => {
    const db = okDb();
    const res = await persistInquiry({ ...base, inquiryType, hp: "http://spam.example" }, db, ctx);
    expect(res).toEqual({ ok: true });
    expect(db.rpc).not.toHaveBeenCalled();
  });
  it.each(["contact", "quote", "dwm_demo"])("%s: empty trap submits normally", async (inquiryType) => {
    const db = okDb();
    expect(await persistInquiry({ ...base, inquiryType, hp: "" }, db, ctx)).toEqual({ ok: true });
    expect(calls(db, "submit_inquiry")).toHaveLength(1);
  });
});

describe("rate limiting", () => {
  it("passes the configured limit and bucket to the database counter", async () => {
    const db = okDb();
    await persistInquiry({ ...base, inquiryType: "contact" }, db, ctx);
    expect(calls(db, "consume_inquiry_rate_limit")[0]![1]).toEqual({ p_bucket: "ip:test", p_limit: 5, p_window_seconds: 600 });
  });
  it("over the limit: stores nothing and returns a generic error without counters", async () => {
    const db = okDb(false);
    const res = await persistInquiry({ ...base, inquiryType: "contact" }, db, ctx);
    expect(res).toEqual({ ok: false, error: "unavailable" });
    expect(calls(db, "submit_inquiry")).toHaveLength(0);
  });
  it("defaults to 5 per 10 minutes and ignores invalid overrides", () => {
    expect(rateLimitConfig({})).toEqual({ max: 5, windowSeconds: 600 });
    expect(rateLimitConfig({ INQUIRY_RATE_LIMIT_MAX: "abc", INQUIRY_RATE_LIMIT_WINDOW_SECONDS: "-1" })).toEqual({ max: 5, windowSeconds: 600 });
    expect(rateLimitConfig({ INQUIRY_RATE_LIMIT_MAX: "10", INQUIRY_RATE_LIMIT_WINDOW_SECONDS: "3600" })).toEqual({ max: 10, windowSeconds: 3600 });
  });
  it("hashes the client identity (no raw IP stored) and shares one bucket when unidentified", async () => {
    const a = await clientBucket("203.0.113.5", "s");
    expect(a).not.toContain("203.0.113.5");
    expect(a).toBe(await clientBucket("203.0.113.5", "s"));
    expect(a).not.toBe(await clientBucket("203.0.113.6", "s"));
    expect(await clientBucket(undefined, "s")).toBe(await clientBucket(null, "s"));
  });
});

describe("email safety mode", () => {
  it("is disabled by default and unless explicitly 'true'", () => {
    expect(isEmailDispatchEnabled({})).toBe(false);
    expect(isEmailDispatchEnabled({ INQUIRY_EMAIL_DISPATCH_ENABLED: "false" })).toBe(false);
    expect(isEmailDispatchEnabled({ INQUIRY_EMAIL_DISPATCH_ENABLED: "1" })).toBe(false);
  });
  it("persisting an inquiry makes no network/provider call", async () => {
    const fetchSpy = vi.spyOn(globalThis, "fetch");
    await persistInquiry({ ...base, inquiryType: "contact" }, okDb(), ctx);
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(NOTIFICATION_RECIPIENT).toBe("system@weldyard.com");
  });
});
