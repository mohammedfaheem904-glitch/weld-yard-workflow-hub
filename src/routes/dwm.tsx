import { createFileRoute, Link } from "@tanstack/react-router";
import { DWM_FEATURES, DWM_URL } from "@/lib/site";
import { seo } from "@/lib/seo";
import { btnDark, btnDarkOutline, btnOutline, btnPrimary, Checklist, Container, CtaBand, FeatureGrid, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/dwm")({
  head: () => seo("Weld Yard DWM — Digital Welding Management", "Weld Yard DWM is a digital welding management application for welder qualifications, weld traceability, inspections and quality documentation.", "/dwm"),
  component: Page,
});

const steps = [
  { title: "Set up your project", body: "Register welders, procedures and the joints you need to track." },
  { title: "Record work as it happens", body: "Capture welding and inspection activity against each joint." },
  { title: "Hand over with confidence", body: "Use organised records to build your quality documentation." },
];

function Page() {
  return (
    <>
      <PageHero eyebrow="Weld Yard DWM" title="Digital Welding Management" intro="One workspace for welders, joints, inspections and quality records — so your team spends less time chasing paperwork.">
        <Link to="/request-dwm-demo" className={btnPrimary}>Request DWM Demo</Link>
        <a href={DWM_URL} className={btnOutline}>Go to DWM</a>
      </PageHero>
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Features" title="What DWM helps you manage" />
          <div className="mt-12"><FeatureGrid items={DWM_FEATURES} /></div>
        </Container>
      </section>
      <section className="border-y bg-card py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Why DWM" title="Built around how welding quality really works" />
            <div className="mt-8">
              <Checklist items={[
                "Structured data instead of scattered spreadsheets",
                "Clear link between welders, joints and inspections",
                "Easier preparation of quality documentation",
                "Designed by a team that works across the welding lifecycle",
              ]} />
            </div>
          </div>
          <ol className="grid gap-px border bg-border">
            {steps.map((s, i) => (
              <li key={s.title} className="flex gap-6 bg-background p-7">
                <span className="font-mono text-2xl text-primary">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <CtaBand title="See Weld Yard DWM in action" body="Book a walkthrough with our team, or open the application if you already have an account.">
        <Link to="/request-dwm-demo" className={btnDark}>Request DWM Demo</Link>
        <a href={DWM_URL} className={btnDarkOutline}>Visit dwm.weldyard.com</a>
      </CtaBand>
    </>
  );
}
