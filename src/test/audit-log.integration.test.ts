// @vitest-environment node
import { describe, it, expect } from "vitest";
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
const stranger = crypto.randomUUID();

describe.skipIf(!ready)("admin audit log", () => {
  it("refuses to log or update on behalf of a non-admin actor", async () => {
    const before = (await admin.from("admin_audit_logs").select("id", { count: "exact", head: true })).count;
    const log = await admin.rpc("admin_log_event", { p_actor: stranger, p_action: "sign_in", p_entity_type: "auth", p_entity_id: null as never, p_old: null as never, p_new: null as never });
    expect(log.error).not.toBeNull();
    const upd = await admin.rpc("admin_update_inquiry", { p_actor: stranger, p_id: crypto.randomUUID(), p_status: "won", p_read: null as never, p_notes: null as never, p_set_notes: false });
    expect(upd.error).not.toBeNull();
    const after = (await admin.from("admin_audit_logs").select("id", { count: "exact", head: true })).count;
    expect(after).toBe(before);
  });
  it("visitors cannot read, write or call audit functions", async () => {
    const r = await anon.from("admin_audit_logs").select("id").limit(1);
    expect(r.data ?? []).toHaveLength(0);
    expect((await anon.from("admin_audit_logs").insert({ actor_user_id: stranger, action: "x", entity_type: "auth" })).error).not.toBeNull();
    expect((await anon.rpc("admin_log_event", { p_actor: stranger, p_action: "sign_in", p_entity_type: "auth", p_entity_id: null as never, p_old: null as never, p_new: null as never })).error).not.toBeNull();
  });
});
