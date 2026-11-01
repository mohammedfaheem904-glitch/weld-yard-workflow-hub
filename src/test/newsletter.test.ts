// @vitest-environment node
import { describe, it, expect, vi } from "vitest";
import { persistSubscription } from "@/lib/newsletter.server";
import { SOCIAL_LINKS } from "@/lib/site";

const ctx = { bucket: "ip:test", limit: { max: 5, windowSeconds: 600 } };
const db = (rl: unknown = true, sub: { error: unknown } = { error: null }) => {
  const rpc = vi.fn(async (fn: string) => (fn === "consume_inquiry_rate_limit" ? { data: rl, error: null } : { data: "subscribed", ...sub }));
  return { rpc };
};

describe("newsletter subscription", () => {
  it("stores a valid email, lowercased, under its own rate-limit bucket", async () => {
    const d = db();
    expect(await persistSubscription({ email: " Buyer@Example.COM " }, d, ctx)).toEqual({ ok: true });
    expect(d.rpc).toHaveBeenCalledWith("consume_inquiry_rate_limit", expect.objectContaining({ p_bucket: "nl:ip:test" }));
    expect(d.rpc).toHaveBeenCalledWith("subscribe_newsletter", { p_email: "buyer@example.com" });
  });
  it("rejects invalid and empty emails without touching the database", async () => {
    for (const email of ["", "not-an-email", "a@b"]) {
      const d = db();
      expect(await persistSubscription({ email }, d, ctx)).toEqual({ ok: false, error: "invalid" });
      expect(d.rpc).not.toHaveBeenCalled();
    }
  });
  it("bot-trap field returns generic success and stores nothing", async () => {
    const d = db();
    expect(await persistSubscription({ email: "a@b.com", hp: "x" }, d, ctx)).toEqual({ ok: true });
    expect(d.rpc).not.toHaveBeenCalled();
  });
  it("blocks when the rate limit is exhausted", async () => {
    const d = db(false);
    expect(await persistSubscription({ email: "a@b.com" }, d, ctx)).toEqual({ ok: false, error: "unavailable" });
    expect(d.rpc).toHaveBeenCalledTimes(1);
  });
});

describe("social links", () => {
  it("uses the confirmed destinations and has no YouTube entry", () => {
    expect(Object.fromEntries(SOCIAL_LINKS.map((s) => [s.key, s.url]))).toEqual({
      facebook: "https://www.facebook.com/weldyardco",
      linkedin: "https://www.linkedin.com/company/weld-yard",
      instagram: "https://www.instagram.com/weld_yard",
      whatsapp: "https://wa.me/201014565099",
    });
    expect(SOCIAL_LINKS.some((s) => /youtube/i.test(s.url + s.key))).toBe(false);
  });
});
