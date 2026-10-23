import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-welding.jpg";
import { seo } from "@/lib/seo";
import { btnDark, btnDarkOutline, Container, CtaBand, FeatureGrid, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/about")({
  head: () => seo("About Weld Yard", "Weld Yard is an integrated welding solutions company connecting products, engineering, inspection and digital welding management."),
  component: Page,
});

const values = [
  { title: "Integrated", body: "We connect stages of welding work that are usually handled by separate suppliers." },
  { title: "Practical", body: "Our focus is on what helps teams on the shop floor and on site." },
  { title: "Quality-minded", body: "Traceable records and clear documentation are part of everything we do." },
];

function Page() {
  return (
    <>
      <PageHero eyebrow="About Weld Yard" title="Integrated Welding Solutions" intro="Weld Yard brings welding products, engineering, QA/QC inspection and digital welding management together under one company." image={hero} />
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow="Our approach" title="Connecting the essential stages of welding" />
          <div className="space-y-5 text-lg text-muted-foreground">
            <p>Welding projects depend on many moving parts: the right materials, qualified procedures and welders, careful inspection and complete quality records.</p>
            <p>Weld Yard was set up to support these stages in a connected way — supplying products through our online store, providing engineering and inspection support, and offering Weld Yard DWM to manage welding data digitally.</p>
          </div>
        </Container>
      </section>
      <section className="border-t bg-card py-20">
        <Container>
          <SectionHeading eyebrow="What guides us" title="Our principles" />
          <div className="mt-12"><FeatureGrid items={values} /></div>
        </Container>
      </section>
      <CtaBand title="Work with Weld Yard" body="Let's discuss how we can support your welding operations.">
        <Link to="/contact" className={btnDark}>Contact Our Team</Link>
        <Link to="/solutions" className={btnDarkOutline}>Our Solutions</Link>
      </CtaBand>
    </>
  );
}
