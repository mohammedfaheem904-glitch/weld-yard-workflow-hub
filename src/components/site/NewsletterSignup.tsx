import { useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { subscribeNewsletter } from "@/lib/newsletter.functions";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export function NewsletterSignup() {
  const { locale } = useLocale();
  const d = t(locale).newsletter;
  const submit = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const v = email.trim();
    if (!v) return setError(d.errEmpty);
    if (v.length > 254 || !EMAIL_RE.test(v)) return setError(d.errInvalid);
    setError(null);
    setState("loading");
    try {
      const r = await submit({ data: { email: v, hp } });
      if (r.ok) { setState("done"); setEmail(""); return; }
      setError(r.error === "invalid" ? d.errInvalid : d.errSubmit);
    } catch {
      setError(d.errSubmit);
    }
    setState("idle");
  }

  return (
    <div>
      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary rtl:tracking-normal">{d.title}</h2>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">{d.copy}</p>
      {state === "done" ? (
        <p role="status" className="mt-4 border border-primary/50 bg-primary/15 px-3 py-2 text-sm text-foreground">{d.success}</p>
      ) : (
        <form onSubmit={onSubmit} noValidate className="mt-4">
          <div className="flex max-w-md flex-col gap-2 sm:flex-row">
            <label htmlFor="newsletter-email" className="sr-only">{d.label}</label>
            <input
              id="newsletter-email"
              type="email"
              dir="ltr"
              autoComplete="email"
              maxLength={254}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={d.placeholder}
              aria-invalid={!!error}
              aria-describedby={error ? "newsletter-error" : undefined}
              className="h-11 min-w-0 flex-1 border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rtl:text-end"
            />
            <div aria-hidden="true" className="absolute -start-[9999px] h-px w-px overflow-hidden">
              <input tabIndex={-1} autoComplete="off" name="company_url" value={hp} onChange={(e) => setHp(e.target.value)} />
            </div>
            <button
              type="submit"
              disabled={state === "loading"}
              className="h-11 shrink-0 bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
            >
              {state === "loading" ? d.loading : d.button}
            </button>
          </div>
          {error && <p id="newsletter-error" role="alert" className="mt-2 inline-block bg-background px-2 py-1 text-sm text-destructive">{error}</p>}
        </form>
      )}
    </div>
  );
}
