import type { ReactNode } from "react";
import { Container, Eyebrow } from "./blocks";

export function FormPage({ eyebrow, title, intro, aside, children }: { eyebrow: string; title: string; intro: string; aside: ReactNode; children: ReactNode }) {
  return (
    <section className="relative py-16 sm:py-24">
      <div aria-hidden className="absolute inset-0 grid-lines opacity-25" />
      <Container className="relative grid gap-12 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h1 className="mt-5 text-4xl font-black leading-tight sm:text-5xl">{title}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{intro}</p>
          <div className="mt-10">{aside}</div>
        </div>
        <div>{children}</div>
      </Container>
    </section>
  );
}
