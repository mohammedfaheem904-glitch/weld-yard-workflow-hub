// @vitest-environment node
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
const email = `zz-nl-${crypto.randomUUID()}@example.com`;

afterAll(async () => { if (ready) await admin.from("newsletter_subscribers").delete().eq("email", email); });

describe.skipIf(!ready)("newsletter database", () => {
  it("one row per email; duplicates and re-subscribe handled", async () => {
    expect((await admin.rpc("subscribe_newsletter", { p_email: email.toUpperCase() })).data).toBe("subscribed");
    expect((await admin.rpc("subscribe_newsletter", { p_email: email })).data).toBe("already_active");
    await admin.from("newsletter_subscribers").update({ status: "unsubscribed" }).eq("email", email);
    expect((await admin.rpc("subscribe_newsletter", { p_email: email })).data).toBe("resubscribed");
    const { data } = await admin.from("newsletter_subscribers").select("status").eq("email", email);
    expect(data).toEqual([{ status: "active" }]);
  });
  it("visitors cannot read, write or call the function directly", async () => {
    expect((await anon.from("newsletter_subscribers").select("id")).error).not.toBeNull();
    expect((await anon.from("newsletter_subscribers").insert({ email: "x@y.com" })).error).not.toBeNull();
    expect((await anon.rpc("subscribe_newsletter", { p_email: "x@y.com" })).error).not.toBeNull();
  });
});
