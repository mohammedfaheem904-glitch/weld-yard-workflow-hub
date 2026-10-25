import { createFileRoute, Link } from "@tanstack/react-router";
import { INDUSTRIES } from "@/lib/site";
import { seo } from "@/lib/seo";
import { btnDark, btnDarkOutline, Container, CtaBand, PageHero } from "@/components/site/blocks";

export const Route = createFileRoute("/industries")({
  head: () => seo("Industries", "Weld Yard supports welding operations in oil & gas, petrochemical, power, structural steel, fabrication, marine and infrastructure.", "/industries"),
  component: Page,
});

function Page() {
  return (
    <>
      <PageHero eyebrow="Industries" title="Welding solutions for demanding sectors" intro="Wherever weld quality, traceability and reliable supply matter, Weld Yard can support your team." />
      <section className="py-20">
        <Container>
          <ul className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((i, idx) => (
              <li key={i.name} className="bg-background p-7">
                <span className="font-mono text-xs text-brand-ink">{String(idx + 1).padStart(2, "0")}</span>
                <h2 className="mt-8 text-xl font-extrabold">{i.name}</h2>
                <p className="mt-3 text-sm text-muted-foreground">{i.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <CtaBand title="Working in a sector not listed?" body="Tell us about your welding scope — we'll let you know how we can help.">
        <Link to="/contact" className={btnDark}>Contact Our Team</Link>
        <Link to="/solutions" className={btnDarkOutline}>Explore Solutions</Link>
      </CtaBand>
    </>
  );
}
