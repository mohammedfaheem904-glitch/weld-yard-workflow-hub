import { supabaseAdmin as a } from "./src/integrations/supabase/client.server.ts";
const mode = process.argv[2];
if (mode === "up") {
  for (const [e, admin] of [["zz-admin@example.invalid", true], ["zz-user@example.invalid", false]] as const) {
    const { data, error } = await a.auth.admin.createUser({ email: e, password: "Zz-Test-Pass-9182!", email_confirm: true });
    if (error) throw error;
    if (admin) await a.from("user_roles").insert({ user_id: data.user.id, role: "admin" });
  }
} else {
  const { data } = await a.auth.admin.listUsers();
  for (const u of data.users) if (u.email?.startsWith("zz-")) await a.auth.admin.deleteUser(u.id);
  console.log("users left:", (await a.auth.admin.listUsers()).data.users.length);
}
