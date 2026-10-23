import { useState, type FormEvent } from "react";
import { z } from "zod";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export type InquiryType = "contact" | "quote" | "dwm_demo";

const schema = z.object({
  name: z.string().trim().min(1, "Please enter your name").max(120),
  email: z.string().trim().email("Please enter a valid email").max(255),
  company: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(40).optional(),
  topic: z.string().trim().max(120).optional(),
  message: z.string().trim().min(1, "Please add a short message").max(3000),
});

type Errors = Partial<Record<keyof z.infer<typeof schema>, string>>;

const field =
  "mt-2 w-full border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none";

export function InquiryForm({
  type,
  topics,
  topicLabel = "Topic",
  messageLabel = "Message",
  submitLabel = "Send message",
}: {
  type: InquiryType;
  topics: string[];
  topicLabel?: string;
  messageLabel?: string;
  submitLabel?: string;
}) {
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const raw = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const parsed = schema.safeParse(raw);
    if (!parsed.success) {
      const errs: Errors = {};
      for (const issue of parsed.error.issues) errs[issue.path[0] as keyof Errors] ??= issue.message;
      setErrors(errs);
      return;
    }
    setErrors({});
    setStatus("sending");
    const v = parsed.data;
    const { error } = await supabase.from("inquiries").insert({
      inquiry_type: type,
      name: v.name,
      email: v.email,
      company: v.company || null,
      phone: v.phone || null,
      topic: v.topic || null,
      message: v.message,
    });
    if (error) {
      setStatus("error");
      return;
    }
    form.reset();
    setStatus("sent");
  }

  if (status === "sent") {
    return (
      <div role="status" className="border border-primary/50 bg-card p-8">
        <CheckCircle2 className="h-8 w-8 text-primary" aria-hidden />
        <h3 className="mt-4 text-2xl font-bold">Thank you — your request was received.</h3>
        <p className="mt-2 text-muted-foreground">Our team will review it and get back to you.</p>
        <button type="button" onClick={() => setStatus("idle")} className="mt-6 text-sm font-bold text-primary">
          Send another request
        </button>
      </div>
    );
  }

  const err = (k: keyof Errors) =>
    errors[k] ? <p id={`${k}-err`} className="mt-1.5 text-xs text-destructive">{errors[k]}</p> : null;

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5 border bg-card p-6 sm:grid-cols-2 sm:p-8">
      <label className="text-sm font-semibold">
        Full name *
        <input name="name" autoComplete="name" className={field} aria-invalid={!!errors.name} aria-describedby="name-err" />
        {err("name")}
      </label>
      <label className="text-sm font-semibold">
        Work email *
        <input name="email" type="email" autoComplete="email" className={field} aria-invalid={!!errors.email} aria-describedby="email-err" />
        {err("email")}
      </label>
      <label className="text-sm font-semibold">
        Company
        <input name="company" autoComplete="organization" className={field} />
      </label>
      <label className="text-sm font-semibold">
        Phone
        <input name="phone" type="tel" autoComplete="tel" className={field} />
      </label>
      <label className="text-sm font-semibold sm:col-span-2">
        {topicLabel}
        <select name="topic" className={field} defaultValue={topics[0]}>
          {topics.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </label>
      <label className="text-sm font-semibold sm:col-span-2">
        {messageLabel} *
        <textarea name="message" rows={5} className={field} aria-invalid={!!errors.message} aria-describedby="message-err" />
        {err("message")}
      </label>
      <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-muted-foreground">* Required fields</p>
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-primary px-7 py-3.5 text-sm font-bold text-primary-foreground shadow-glow disabled:opacity-60"
        >
          {status === "sending" ? "Sending…" : submitLabel}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="text-sm text-destructive sm:col-span-2">
          Something went wrong sending your request. Please try again.
        </p>
      )}
    </form>
  );
}
