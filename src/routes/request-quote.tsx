import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { FormPage } from "@/components/site/FormPage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Checklist } from "@/components/site/blocks";

export const Route = createFileRoute("/request-quote")({
  head: () => seo("Request a Quote", "Request a quote from Weld Yard for welding products, engineering or QA/QC inspection services."),
  component: Page,
});

function Page() {
  return (
    <FormPage
      eyebrow="Request a Quote"
      title="Tell us what you need"
      intro="Share your requirement and our team will prepare a quotation."
      aside={<Checklist items={["Product names, grades and quantities", "Scope of engineering or inspection work", "Project location and timeline"]} />}
    >
      <InquiryForm
        type="quote"
        topicLabel="Quote for"
        messageLabel="Requirement details"
        submitLabel="Request a Quote"
        topics={["Welding Products", "Welding Engineering", "QA/QC & Inspection", "Combined solution"]}
      />
    </FormPage>
  );
}
