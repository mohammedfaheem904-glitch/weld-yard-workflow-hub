import { useMemo, useRef, useState, type FormEvent } from "react";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { submitInquiry } from "@/lib/inquiry.functions";
import type { InquiryType } from "@/lib/inquiry-schema";
import { t, type Dict } from "@/lib/i18n";
import { useLocale } from "@/lib/locale";

export type { InquiryType };

// Schema limits are unchanged; only the messages follow the active language.
export function inquirySchema(f: Dict["form"]) {
  return z.object({
    name: z.string().trim().min(1, f.errName).max(120, f.errTooLong),
    email: z.string().trim().email(f.errEmail).max(255, f.errTooLong),
    company: z.string().trim().max(160, f.errTooLong).optional(),
    phone: z.string().trim().max(40, f.errTooLong).optional(),
    topic: z.string().trim().max(120, f.errTooLong).optional(),
    message: z.string().trim().min(1, f.errMessage).max(3000, f.errTooLong),
  });
}

type Fields = "name" | "email" | "company" | "phone" | "topic" | "message";
type Errors = Partial<Record<Fields, string>>;

const field =
  "mt-2 w-full border border-input bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-brand-ink focus:outline-none focus:ring-2 focus:ring-ring/30";

export type TopicOption = { value: string; label: string };

export function InquiryForm({
  type,
  topics,
  topicLabel,
  messageLabel,
  submitLabel,
}: {
  type: InquiryType;
  /** `value` is stored (English, stable); `label` is shown. */
  topics: TopicOption[];
  topicLabel?: string;
  messageLabel?: string;
  submitLabel?: string;
}) {
  const { locale } = useLocale();
  const f = t(locale).form;
  const schema = useMemo(() => inquirySchema(f), [f]);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const send = useServerFn(submitInquiry);
  // One key per submission attempt: a retried/double-clicked send is stored once.
  const keyRef = useRef<string | null>(null);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as Fields] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    keyRef.current ??= crypto.randomUUID();
    const v = parsed.data;
    try {
      const res = await send({
        data: {
          inquiryType: type,
          name: v.name,
          email: v.email,
          company: v.company,
          phone: v.phone,
          topic: v.topic,
          message: v.message,
          idempotencyKey: keyRef.current,
        },
      });
      if (!res.ok) {
        setStatus("error");
        return;
      }
    } catch {
      setStatus("error");
      return;
    }
    keyRef.current = null;
    form.reset();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div role="status" className="border border-primary/50 bg-card p-8">
        <CheckCircle2 className="h-8 w-8 text-brand-ink" aria-hidden />
        <h3 className="mt-4 text-2xl font-bold">{f.sentTitle}</h3>
        <p className="mt-2 text-muted-foreground">{f.sentBody}</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm font-bold text-brand-ink">
          {f.another}
        </button>
      </div>
    );
  }

  const err = (k: Fields) =>
    errors[k] ? <p id={`${k}-err`} className="mt-1.5 text-xs text-destructive">{errors[k]}</p> : null;
  const describe = (k: Fields) => (errors[k] ? `${k}-err` : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 border bg-card p-6 sm:grid-cols-2 sm:p-8">
      <label className="text-sm font-semibold">
        {f.name} *
        <input name="name" dir="auto" autoComplete="name" required aria-required="true" className={field} aria-invalid={!!errors.name} aria-describedby={describe("name")} />
        {err("name")}
      </label>
      <label className="text-sm font-semibold">
        {f.email} *
        <input name="email" type="email" dir="ltr" autoComplete="email" required aria-required="true" className={`${field} text-start rtl:text-end`} aria-invalid={!!errors.email} aria-describedby={describe("email")} />
        {err("email")}
      </label>
      <label className="text-sm font-semibold">
        {f.company}
        <input name="company" dir="auto" autoComplete="organization" className={field} />
      </label>
      <label className="text-sm font-semibold">
        {f.phone}
        <input name="phone" type="tel" dir="ltr" autoComplete="tel" className={`${field} text-start rtl:text-end`} />
      </label>
      <label className="text-sm font-semibold sm:col-span-2">
        {topicLabel ?? f.topic}
        <select name="topic" className={field} defaultValue={topics[0]?.value}>
          {topics.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold sm:col-span-2">
        {messageLabel ?? f.message} *
        <textarea name="message" dir="auto" rows={5} required aria-required="true" className={field} aria-invalid={!!errors.message} aria-describedby={describe("message")} />
        {err("message")}
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">{f.required}</p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"
        >
          {status === "sending" ? f.sending : submitLabel ?? f.send}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive sm:col-span-2">
          {f.errSubmit}
        </p>
      )}
    </form>
  );
}
