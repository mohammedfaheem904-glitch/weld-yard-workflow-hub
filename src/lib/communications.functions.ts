import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { isAllowedStatus, updateInquirySchema } from "./communications";

type Ctx = { supabase: { rpc: (fn: "has_role", args: { _user_id: string; _role: "admin" }) => PromiseLike<{ data: boolean | null }> }; userId: string };

async function assertAdmin(ctx: Ctx) {
  const { data } = await ctx.supabase.rpc("has_role", { _user_id: ctx.userId, _role: "admin" });
  if (data !== true) throw new Response("Forbidden", { status: 403 });
}

/** Is the signed-in user an admin? Used by the UI to show access denied. */
export const checkAdmin = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "admin" });
    return { isAdmin: data === true };
  });

/** All communications for the admin inbox. Read-only; sends nothing. */
export const listCommunications = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as unknown as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const [inq, subs] = await Promise.all([
      supabaseAdmin
        .from("inquiries")
        .select("id, inquiry_type, name, email, company, phone, topic, message, created_at, status, admin_notes, read_at, updated_at")
        .order("created_at", { ascending: false })
        .limit(2000),
      supabaseAdmin
        .from("newsletter_subscribers")
        .select("id, email, status, created_at, updated_at, unsubscribed_at")
        .order("created_at", { ascending: false })
        .limit(5000),
    ]);
    if (inq.error || subs.error) throw new Error("Could not load communications");
    return { inquiries: inq.data, subscribers: subs.data };
  });

/** Update status / read flag / internal note on one inquiry; audited atomically in the DB. */
export const updateInquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateInquirySchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin.from("inquiries").select("inquiry_type").eq("id", data.id).single();
    if (!row) throw new Error("Not found");
    if (data.status !== undefined && !isAllowedStatus(row.inquiry_type, data.status)) throw new Error("Invalid status");
    const { data: res, error } = await supabaseAdmin.rpc("admin_update_inquiry", {
      p_actor: context.userId,
      p_id: data.id,
      p_status: data.status ?? (null as unknown as string),
      p_read: data.read ?? (null as unknown as boolean),
      p_notes: data.notes ?? (null as unknown as string),
      p_set_notes: data.notes !== undefined,
    });
    if (error || res !== "ok") throw new Error("Update failed");
    return { ok: true };
  });

const logEventSchema = z.object({
  action: z.enum(["sign_in", "sign_out", "newsletter_export"]),
  count: z.number().int().min(0).max(100000).optional(),
});

/** Record a client-initiated admin event. Actor always comes from the verified session. */
export const logAdminEvent = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => logEventSchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const isExport = data.action === "newsletter_export";
    const { error } = await supabaseAdmin.rpc("admin_log_event", {
      p_actor: context.userId,
      p_action: data.action,
      p_entity_type: isExport ? "newsletter" : "auth",
      p_entity_id: null as unknown as string,
      p_old: null as unknown as never,
      p_new: (isExport ? { rows: data.count ?? 0 } : null) as never,
    });
    if (error) throw new Error("Audit failed");
    return { ok: true };
  });

/** Audit log, admin only. Read through the admin's own client so RLS also applies. */
export const listAuditLogs = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertAdmin(context as unknown as Ctx);
    const { data, error } = await context.supabase
      .from("admin_audit_logs")
      .select("id, actor_user_id, actor_email, action, entity_type, entity_id, old_values, new_values, created_at")
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw new Error("Could not load audit log");
    return { logs: data };
  });
