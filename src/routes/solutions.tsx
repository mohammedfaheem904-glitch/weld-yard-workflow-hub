import { createFileRoute, Link } from "@tanstack/react-router";
import { BUSINESS_AREAS } from "@/lib/site";
import { seo } from "@/lib/seo";
import { btnDark, btnDarkOutline, Container, CtaBand, Lifecycle, PageHero, SectionHeading, TextLink } from "@/components/site/blocks";

export const Route = createFileRoute("/solutions")({
  head: () => seo("Solutions", "Weld Yard solutions: welding products, welding engineering, QA/QC & inspection, and digital welding management."),
  component: Solutions,
});

function Solutions() {
  return (
    <>
      <PageHero eyebrow="Solutions" title="One partner across the welding lifecycle" intro="Products. Engineering. Inspection. Digital Welding Management. Use one service or combine them for a connected approach." />
      <section className="py-20">
        <Container className="grid gap-6 md:grid-cols-2">
          {BUSINESS_AREAS.map((a) => (
            <article key={a.n} className="border bg-card p-8 sm:p-10">
              <span className="font-mono text-sm text-primary">{a.n}</span>
              <h2 className="mt-6 text-3xl font-extrabold">{a.title}</h2>
              <p className="mt-4 text-muted-foreground">{a.body}</p>
              <div className="mt-8"><TextLink to={a.to}>Explore {a.title}</TextLink></div>
            </article>
          ))}
        </Container>
      </section>
      <section className="border-t bg-card py-20">
        <Container>
          <SectionHeading eyebrow="How it connects" title="From material to handover" />
          <div className="mt-12"><Lifecycle /></div>
        </Container>
      </section>
      <CtaBand title="Not sure where to start?" body="Describe your requirement and we'll point you to the right solution.">
        <Link to="/contact" className={btnDark}>Contact Our Team</Link>
        <Link to="/request-quote" className={btnDarkOutline}>Request a Quote</Link>
      </CtaBand>
    </>
  );
}
