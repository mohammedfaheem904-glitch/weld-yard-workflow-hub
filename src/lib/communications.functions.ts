import { createServerFn } from "@tanstack/react-start";
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

/** Update status / read flag / internal note on one inquiry. */
export const updateInquiry = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => updateInquirySchema.parse(d))
  .handler(async ({ data, context }) => {
    await assertAdmin(context as unknown as Ctx);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: row } = await supabaseAdmin.from("inquiries").select("inquiry_type").eq("id", data.id).single();
    if (!row) throw new Error("Not found");
    const patch: { status?: string; read_at?: string | null; admin_notes?: string | null; updated_at: string } = { updated_at: new Date().toISOString() };
    if (data.status !== undefined) {
      if (!isAllowedStatus(row.inquiry_type, data.status)) throw new Error("Invalid status");
      patch.status = data.status;
    }
    if (data.read !== undefined) patch.read_at = data.read ? new Date().toISOString() : null;
    if (data.notes !== undefined) patch.admin_notes = data.notes.trim() || null;
    const { error } = await supabaseAdmin.from("inquiries").update(patch).eq("id", data.id);
    if (error) throw new Error("Update failed");
    return { ok: true };
  });
