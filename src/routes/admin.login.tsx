import { logAdminEvent } from "@/lib/communications.functions";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTr } from "@/lib/locale";
import { Logo } from "@/components/site/Logo";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin sign in | Weld Yard" },
      { name: "description", content: "Weld Yard staff sign in." },
      { property: "og:title", content: "Admin sign in | Weld Yard" },
      { property: "og:description", content: "Weld Yard staff sign in." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const tr = useTr();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setError(tr("Sign in failed. Check your email and password.", "فشل تسجيل الدخول. تحقق من البريد وكلمة المرور."));
    try { await logAdminEvent({ data: { action: "sign_in" } }); } catch { /* non-admins are not logged */ }
    navigate({ to: "/admin/communications", replace: true });
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-4">
      <form onSubmit={onSubmit} className="w-full max-w-sm space-y-5 border bg-card p-8 shadow-sm">
        <Logo />
        <h1 className="text-xl font-bold">{tr("Staff sign in", "تسجيل دخول الموظفين")}</h1>
        <div className="space-y-2">
          <Label htmlFor="email">{tr("Email", "البريد الإلكتروني")}</Label>
          <Input id="email" type="email" dir="ltr" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{tr("Password", "كلمة المرور")}</Label>
          <Input id="password" type="password" dir="ltr" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={busy}>{tr("Sign in", "دخول")}</Button>
      </form>
    </div>
  );
}
