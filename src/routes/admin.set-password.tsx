import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useTr } from "@/lib/locale";
import { Logo } from "@/components/site/Logo";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/set-password")({
  head: () => ({
    meta: [
      { title: "Set password | Weld Yard Admin" },
      { name: "description", content: "Set the password for a Weld Yard staff account." },
      { property: "og:title", content: "Set password | Weld Yard Admin" },
      { property: "og:description", content: "Weld Yard staff password setup." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: SetPassword,
});

function SetPassword() {
  const tr = useTr();
  const navigate = useNavigate();
  const [ready, setReady] = useState<boolean | null>(null);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const ok = () => { if (!cancelled) setReady(true); };
    const fail = () => { if (!cancelled) setReady((r) => (r ? r : false)); };
    const { data } = supabase.auth.onAuthStateChange((_e, session) => { if (session) ok(); });

    (async () => {
      const url = new URL(window.location.href);
      const hash = new URLSearchParams(url.hash.replace(/^#/, ""));
      if (hash.get("error") || url.searchParams.get("error")) return fail();
      try {
        const code = url.searchParams.get("code");
        const at = hash.get("access_token");
        const rt = hash.get("refresh_token");
        if (code) {
          const { error } = await supabase.auth.exchangeCodeForSession(code);
          if (!error) { window.history.replaceState(null, "", url.pathname); return ok(); }
        } else if (at && rt) {
          const { error } = await supabase.auth.setSession({ access_token: at, refresh_token: rt });
          if (!error) { window.history.replaceState(null, "", url.pathname); return ok(); }
        }
      } catch { /* fall through to session check */ }
      // Give the auth client time to finish restoring any session before deciding.
      for (let i = 0; i < 8 && !cancelled; i++) {
        const { data: d } = await supabase.auth.getSession();
        if (d.session) return ok();
        await new Promise((r) => setTimeout(r, 500));
      }
      fail();
    })();

    return () => { cancelled = true; data.subscription.unsubscribe(); };
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr("");
    if (pw.length < 12) return setErr(tr("Use at least 12 characters.", "استخدم 12 حرفًا على الأقل."));
    if (pw !== pw2) return setErr(tr("Passwords do not match.", "كلمتا المرور غير متطابقتين."));
    setBusy(true);
    const { error } = await supabase.auth.updateUser({ password: pw });
    setBusy(false);
    if (error) return setErr(tr("Could not set the password. It may be too weak or the link expired.", "تعذر تعيين كلمة المرور. قد تكون ضعيفة أو انتهت صلاحية الرابط."));
    navigate({ to: "/admin/communications", replace: true });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="w-full max-w-sm border bg-card p-8">
        <Logo />
        <h1 className="mt-6 text-2xl font-bold">{tr("Set your password", "تعيين كلمة المرور")}</h1>
        {ready === false ? (
          <p role="alert" className="mt-4 text-sm text-muted-foreground">{tr("This setup link is invalid or has expired.", "رابط الإعداد غير صالح أو منتهي الصلاحية.")}</p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-4">
            <Input type="password" dir="ltr" autoComplete="new-password" placeholder={tr("New password", "كلمة المرور الجديدة")} aria-label={tr("New password", "كلمة المرور الجديدة")} value={pw} onChange={(e) => setPw(e.target.value)} />
            <Input type="password" dir="ltr" autoComplete="new-password" placeholder={tr("Confirm password", "تأكيد كلمة المرور")} aria-label={tr("Confirm password", "تأكيد كلمة المرور")} value={pw2} onChange={(e) => setPw2(e.target.value)} />
            {err && <p role="alert" className="text-sm text-destructive">{err}</p>}
            <Button type="submit" className="w-full" disabled={busy || !ready}>{tr("Save password", "حفظ كلمة المرور")}</Button>
          </form>
        )}
      </div>
    </main>
  );
}
