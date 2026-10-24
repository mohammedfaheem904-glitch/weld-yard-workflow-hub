import { createFileRoute, Link } from "@tanstack/react-router";
import { STORE_URL } from "@/lib/site";
import { seo } from "@/lib/seo";
import { FormPage } from "@/components/site/FormPage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Checklist } from "@/components/site/blocks";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact", "Contact Weld Yard about welding products, engineering, QA/QC inspection or Weld Yard DWM.", "/contact"),
  component: Page,
});

function Page() {
  return (
    <FormPage
      eyebrow="Contact"
      title="Contact our team"
      intro="Send us a message about products, engineering, inspection or DWM and the right person will get back to you."
      aside={
        <div className="space-y-6">
          <Checklist items={["General enquiries", "Technical questions", "Partnership requests"]} />
          <p className="text-sm text-muted-foreground">
            Need pricing? <Link to="/request-quote" className="font-bold text-primary">Request a quote</Link>. Ready to order? <a href={STORE_URL} className="font-bold text-primary">Visit the store</a>.
          </p>
        </div>
      }
    >
      <InquiryForm type="contact" topics={["General enquiry", "Welding Products", "Welding Engineering", "QA/QC & Inspection", "Weld Yard DWM", "Other"]} />
    </FormPage>
  );
}
