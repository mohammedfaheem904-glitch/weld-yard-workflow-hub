import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-welding.jpg";
import engineering from "@/assets/engineering.jpg";
import { BUSINESS_AREAS, DWM_FEATURES, DWM_URL, INDUSTRIES, SUPPORTING } from "@/lib/site";
import { seo } from "@/lib/seo";
import {
  btnDark, btnDarkOutline, btnOutline, btnPrimary, Checklist, Container, CtaBand, Eyebrow,
  FeatureGrid, Lifecycle, SectionHeading, TextLink,
} from "@/components/site/blocks";

export const Route = createFileRoute("/")({
  head: () => seo("Integrated Welding Solutions", "Weld Yard connects welding products, engineering support, QA/QC inspection and digital welding management across your welding operations."),
  component: Home,
});

function Home() {
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <img src={hero} alt="Welder working on a large steel pipe with sparks" width={1640} height={1088} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[70%_center]" />
        <div aria-hidden className="absolute inset-0 bg-hero-fade" />
        <Container className="relative py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <Eyebrow>Weld Yard — Integrated Welding Solutions</Eyebrow>
            <h1 className="mt-6 text-5xl font-black leading-[0.98] sm:text-6xl lg:text-7xl">
              Integrated Welding <span className="text-primary">Solutions</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg text-muted-foreground sm:text-xl">
              From welding products and engineering support to quality inspection and digital welding management, Weld Yard connects the essential stages of your welding operations.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/solutions" className={btnPrimary}>Explore Our Solutions</Link>
              <Link to="/contact" className={btnOutline}>Contact Our Team</Link>
            </div>
            <p className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">{SUPPORTING}</p>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="What we do" title="Four connected business areas" intro="One partner for the products, expertise, inspection and digital records your welding work depends on." />
          <ul className="mt-14 grid gap-px border bg-border md:grid-cols-2 lg:grid-cols-4">
            {BUSINESS_AREAS.map((a) => (
              <li key={a.n} className="flex flex-col bg-background p-8">
                <span className="font-mono text-sm text-primary">{a.n}</span>
                <h3 className="mt-8 text-2xl font-extrabold">{a.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                <div className="mt-8"><TextLink to={a.to}>Learn more</TextLink></div>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="border-y bg-card py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="The welding lifecycle" title="Every stage, connected" intro="Weld Yard supports the full path of a weld — from the material on the rack to the quality dossier at handover." />
          <div className="mt-14"><Lifecycle /></div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <img src={engineering} alt="Welding engineer reviewing drawings in a fabrication hall" width={1280} height={896} loading="lazy" className="aspect-[4/3] w-full object-cover" />
          <div>
            <SectionHeading eyebrow="Capabilities" title="Practical support where welding happens" />
            <div className="mt-8">
              <Checklist items={[
                "Supply of welding consumables, equipment and safety products",
                "Welding procedure and qualification support",
                "Weld inspection and quality control activities",
                "Organised quality documentation for handover",
                "Digital tracking of welders, joints and inspections with Weld Yard DWM",
              ]} />
            </div>
            <div className="mt-10"><TextLink to="/solutions">See all solutions</TextLink></div>
          </div>
        </Container>
      </section>

      <section className="border-y bg-card py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Industries" title="Built for demanding sectors" />
            <TextLink to="/industries">All industries</TextLink>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-px border bg-border lg:grid-cols-4">
            {INDUSTRIES.map((i) => (
              <li key={i.name} className="bg-card p-6 font-display text-lg font-bold">{i.name}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="relative overflow-hidden py-20 sm:py-28">
        <div aria-hidden className="absolute inset-0 grid-lines opacity-30" />
        <Container className="relative">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Weld Yard DWM" title="Digital Welding Management" intro="Replace paper forms and scattered spreadsheets with one structured workspace for welding quality." />
            <div className="flex flex-wrap gap-3">
              <Link to="/request-dwm-demo" className={btnPrimary}>Request DWM Demo</Link>
              <a href={DWM_URL} className={btnOutline}>Visit DWM</a>
            </div>
          </div>
          <div className="mt-14"><FeatureGrid items={DWM_FEATURES} /></div>
        </Container>
      </section>

      <CtaBand title="Let's talk about your welding operations" body="Tell us about your project, product needs or quality requirements.">
        <Link to="/contact" className={btnDark}>Contact Our Team</Link>
        <Link to="/request-quote" className={btnDarkOutline}>Request a Quote</Link>
      </CtaBand>
    </>
  );
}
