import { createFileRoute, Link } from "@tanstack/react-router";
import img from "@/assets/engineering.jpg";
import { seo } from "@/lib/seo";
import { btnDark, btnDarkOutline, btnPrimary, Container, CtaBand, FeatureGrid, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/welding-engineering")({
  head: () => seo("Welding Engineering", "Welding procedure development, welder qualification support and technical welding guidance from Weld Yard."),
  component: Page,
});

const services = [
  { title: "Welding procedure development", body: "Support preparing welding procedure specifications and the related qualification records." },
  { title: "Welder qualification support", body: "Planning and organising welder qualification testing and records." },
  { title: "Process & consumable selection", body: "Guidance on choosing suitable processes, consumables and parameters for your materials." },
  { title: "Technical review", body: "Review of welding requirements in drawings, specifications and project documents." },
  { title: "Troubleshooting", body: "Practical help investigating recurring weld defects and production issues." },
  { title: "Training & toolbox sessions", body: "Knowledge sessions for welders, supervisors and quality teams." },
];

function Page() {
  return (
    <>
      <PageHero eyebrow="Welding Engineering" title="Engineering support behind every joint" intro="Technical welding expertise that helps your team plan, qualify and execute welding work with confidence." image={img}>
        <Link to="/contact" className={btnPrimary}>Talk to an Engineer</Link>
      </PageHero>
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Services" title="What we help with" />
          <div className="mt-12"><FeatureGrid items={services} /></div>
        </Container>
      </section>
      <CtaBand title="Have a welding engineering requirement?" body="Share your scope and our team will discuss how we can support.">
        <Link to="/request-quote" className={btnDark}>Request a Quote</Link>
        <Link to="/contact" className={btnDarkOutline}>Contact Our Team</Link>
      </CtaBand>
    </>
  );
}
