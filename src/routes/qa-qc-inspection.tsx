import { createFileRoute, Link } from "@tanstack/react-router";
import img from "@/assets/inspection.jpg";
import { seo } from "@/lib/seo";
import { btnDark, btnDarkOutline, btnPrimary, Container, CtaBand, FeatureGrid, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/qa-qc-inspection")({
  head: () => seo("QA/QC & Inspection", "Weld inspection, quality control support and quality documentation services from Weld Yard."),
  component: Page,
});

const services = [
  { title: "Visual & dimensional weld inspection", body: "Inspection of fit-up, weld profile and dimensions against project requirements." },
  { title: "NDT coordination", body: "Planning and coordinating non-destructive testing activities for your welds." },
  { title: "Quality control support", body: "Day-to-day QC presence and follow-up on fabrication and site work." },
  { title: "Inspection & test plans", body: "Help preparing and following inspection and test plans." },
  { title: "Non-conformance follow-up", body: "Recording, tracking and closing out quality issues." },
  { title: "Quality documentation", body: "Compiling organised weld records and quality dossiers for handover." },
];

function Page() {
  return (
    <>
      <PageHero eyebrow="QA/QC & Inspection" title="Quality you can document" intro="Inspection and quality control support from fit-up to final acceptance, with records that are ready for handover." image={img}>
        <Link to="/request-quote" className={btnPrimary}>Request Inspection Support</Link>
      </PageHero>
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow="Services" title="Inspection & quality services" />
          <div className="mt-12"><FeatureGrid items={services} /></div>
        </Container>
      </section>
      <CtaBand title="Go digital with your inspection records" body="Pair inspection services with Weld Yard DWM for traceable, organised quality data.">
        <Link to="/dwm" className={btnDark}>Discover DWM</Link>
        <Link to="/contact" className={btnDarkOutline}>Contact Our Team</Link>
      </CtaBand>
    </>
  );
}
