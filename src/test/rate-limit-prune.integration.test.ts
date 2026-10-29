// @vitest-environment node
// Runs against the real backend. Skipped when server credentials are not present.
import { describe, it, expect, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

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

const buckets: string[] = [];
const OLD = new Date(Date.now() - 48 * 3600_000).toISOString();

async function seedStale(bucket: string) {
  buckets.push(bucket);
  const { error } = await admin.from("inquiry_rate_limits").upsert({ bucket, window_start: OLD, hits: 3, updated_at: OLD });
  if (error) throw error;
}
const prune = () => admin.rpc("prune_inquiry_rate_limits", { p_retention: "24 hours" });
const refresh = (bucket: string) => admin.rpc("consume_inquiry_rate_limit", { p_bucket: bucket, p_limit: 5, p_window_seconds: 600 });

afterAll(async () => {
  if (ready && buckets.length) await admin.from("inquiry_rate_limits").delete().in("bucket", buckets);
});

describe.skipIf(!ready)("rate-limit cleanup", () => {
  it("rejects retention shorter than 24 hours", async () => {
    const { error } = await admin.rpc("prune_inquiry_rate_limits", { p_retention: "23 hours" });
    expect((error as { code?: string } | null)?.code).toBe("22023");
  });

  it("visitors cannot run the cleanup", async () => {
    const { error } = await anon.rpc("prune_inquiry_rate_limits", { p_retention: "24 hours" });
    expect(error).not.toBeNull();
  });

  it("removes a row idle for over 24 hours and keeps a recent one", async () => {
    const stale = `test:${crypto.randomUUID()}`;
    const fresh = `test:${crypto.randomUUID()}`;
    await seedStale(stale);
    buckets.push(fresh);
    await refresh(fresh);
    const { error } = await prune();
    expect(error).toBeNull();
    const { data } = await admin.from("inquiry_rate_limits").select("bucket").in("bucket", [stale, fresh]);
    expect((data ?? []).map((r) => r.bucket)).toEqual([fresh]);
  });

  it("a row refreshed concurrently with cleanup is never lost (40 races)", async () => {
    for (let i = 0; i < 40; i++) {
      const b = `test:${crypto.randomUUID()}`;
      await seedStale(b);
      // Fire both at once; alternate start order to vary interleavings.
      const [r1, r2] = i % 2
        ? await Promise.all([prune(), refresh(b)])
        : (await Promise.all([refresh(b), prune()])).reverse();
      expect(r1.error).toBeNull();
      expect(r2.error).toBeNull();
      expect(r2.data).toBe(true);
      const { data } = await admin.from("inquiry_rate_limits").select("hits, updated_at").eq("bucket", b).single();
      // Whichever committed first, the visitor's activity must survive with a fresh window.
      expect(data).not.toBeNull();
      expect(Date.now() - new Date(data!.updated_at).getTime()).toBeLessThan(10 * 60_000);
      expect(data!.hits).toBe(1);
    }
  }, 120_000);
});
