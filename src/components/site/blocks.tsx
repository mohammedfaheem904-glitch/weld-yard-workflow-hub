import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";
import { LIFECYCLE } from "@/lib/site";
import { cn } from "@/lib/utils";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto max-w-7xl px-4 sm:px-6", className)}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.25em] text-brand-ink">
      <span aria-hidden className="h-px w-8 bg-primary" />
      {children}
    </p>
  );
}

export function SectionHeading({ eyebrow, title, intro }: { eyebrow: string; title: string; intro?: string }) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">{title}</h2>
      {intro && <p className="mt-5 text-lg text-muted-foreground">{intro}</p>}
    </div>
  );
}

export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  image?: string;
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b">
      {image ? (
        <>
          <img src={image} alt="" width={1280} height={896} className="absolute inset-0 h-full w-full object-cover" />
          <div aria-hidden className="absolute inset-0 bg-hero-fade" />
        </>
      ) : (
        <div aria-hidden className="absolute inset-0 grid-lines opacity-40" />
      )}
      <Container className="relative py-20 sm:py-28">
        <div className="max-w-2xl">
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-4xl font-black leading-[1.05] sm:text-5xl lg:text-6xl">{title}</h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl">{intro}</p>
          {children && <div className="mt-9 flex flex-wrap gap-3">{children}</div>}
        </div>
      </Container>
    </section>
  );
}

const btn = "inline-flex items-center gap-2 px-6 py-3.5 text-sm font-bold transition-all";
export const btnPrimary = cn(btn, "bg-primary text-primary-foreground shadow-glow hover:opacity-90");
export const btnOutline = cn(btn, "border border-foreground/40 bg-background text-foreground hover:border-primary hover:text-brand-ink");

export function FeatureGrid({ items }: { items: readonly { title: string; body: string }[] }) {
  return (
    <ul className="grid gap-px overflow-hidden border bg-border sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => (
        <li key={i.title} className="bg-background p-7">
          <span aria-hidden className="block h-1 w-8 bg-primary" />
          <h3 className="mt-5 text-lg font-bold">{i.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{i.body}</p>
        </li>
      ))}
    </ul>
  );
}

export function Lifecycle() {
  return (
    <ol className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-7">
      {LIFECYCLE.map((s, i) => (
        <li key={s} className="group relative bg-background p-5 transition-colors hover:bg-accent">
          <span className="font-mono text-xs text-brand-ink">{String(i + 1).padStart(2, "0")}</span>
          <p className="mt-6 font-display text-base font-bold leading-tight">{s}</p>
          {i < LIFECYCLE.length - 1 && (
            <ArrowRight aria-hidden className="absolute end-3 top-5 hidden h-4 w-4 text-muted-foreground lg:block rtl:rotate-180" />
          )}
        </li>
      ))}
    </ol>
  );
}

export function CtaBand({ title, body, children }: { title: string; body: string; children: ReactNode }) {
  return (
    <section className="bg-primary text-primary-foreground">
      <Container className="flex flex-col gap-8 py-16 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black sm:text-4xl">{title}</h2>
          <p className="mt-3 text-lg opacity-80">{body}</p>
        </div>
        <div className="flex flex-wrap gap-3">{children}</div>
      </Container>
    </section>
  );
}

export const btnDark = cn(btn, "bg-primary-foreground text-primary hover:opacity-90");
export const btnDarkOutline = cn(btn, "border border-primary-foreground/40 hover:bg-primary-foreground/10");

export function TextLink({ to, children }: { to: string; children: ReactNode }) {
  return (
    <Link to={to} className="inline-flex items-center gap-2 text-sm font-bold text-brand-ink hover:gap-3 transition-all">
      {children} <ArrowRight aria-hidden className="h-4 w-4 rtl:rotate-180" />
    </Link>
  );
}

export function Checklist({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {items.map((i) => (
        <li key={i} className="flex gap-3">
          <span aria-hidden className="mt-2 h-2 w-2 shrink-0 bg-primary" />
          <span className="text-muted-foreground">{i}</span>
        </li>
      ))}
    </ul>
  );
}
