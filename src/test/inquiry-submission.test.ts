// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { persistInquiry, isEmailDispatchEnabled, NOTIFICATION_RECIPIENT } from "@/lib/inquiry.server";

const base = {
  name: "Test User",
  email: "  Buyer@Example.COM ",
  company: "Acme",
  phone: "",
  topic: "Welding Products",
  message: "Need rods",
  idempotencyKey: "7f1c3c1e-2b1a-4c4e-9a7e-1f2d3c4b5a69",
};
const okDb = () => ({ rpc: vi.fn(async () => ({ data: [{ inquiry_id: "x", duplicate: false }], error: null })) });

describe("server-side inquiry validation", () => {
  it.each(["contact", "quote", "dwm_demo"])("accepts a valid %s submission", async (inquiryType) => {
    const db = okDb();
    expect(await persistInquiry({ ...base, inquiryType }, db)).toEqual({ ok: true });
    const args = (db.rpc.mock.calls[0] as unknown[])[1] as Record<string, unknown>;
    expect(args.p_inquiry_type).toBe(inquiryType);
    expect(args.p_email).toBe("buyer@example.com");
    expect(args.p_phone).toBeNull();
    expect(args.p_recipient).toBe("system@weldyard.com");
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
    expect(await persistInquiry({ ...base, inquiryType: "contact", ...patch }, db)).toEqual({ ok: false, error: "invalid" });
    expect(db.rpc).not.toHaveBeenCalled();
  });

  it("returns a generic error and hides database details", async () => {
    const db = { rpc: vi.fn(async () => ({ data: null, error: { code: "XX000", message: "secret internal detail" } })) };
    vi.spyOn(console, "error").mockImplementation(() => {});
    const res = await persistInquiry({ ...base, inquiryType: "quote" }, db);
    expect(res).toEqual({ ok: false, error: "unavailable" });
    expect(JSON.stringify(res)).not.toContain("secret");
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
    await persistInquiry({ ...base, inquiryType: "contact" }, okDb());
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(NOTIFICATION_RECIPIENT).toBe("system@weldyard.com");
  });
});
