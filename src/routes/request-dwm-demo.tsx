import { createFileRoute } from "@tanstack/react-router";
import { DWM_URL } from "@/lib/site";
import { seo } from "@/lib/seo";
import { FormPage } from "@/components/site/FormPage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Checklist } from "@/components/site/blocks";

export const Route = createFileRoute("/request-dwm-demo")({
  head: () => seo("Request a DWM Demo", "Book a walkthrough of Weld Yard DWM, the digital welding management application.", "/request-dwm-demo"),
  component: Page,
});

function Page() {
  return (
    <FormPage
      eyebrow="Weld Yard DWM"
      title="Request a DWM demo"
      intro="See how Weld Yard DWM can organise your welders, joints, inspections and quality records."
      aside={
        <div className="space-y-6">
          <Checklist items={["A walkthrough tailored to your workflow", "Answers to your team's questions", "Next steps for getting started"]} />
          <p className="text-sm text-muted-foreground">
            Already a user? <a href={DWM_URL} className="font-bold text-primary">Open dwm.weldyard.com</a>
          </p>
        </div>
      }
    >
      <InquiryForm
        type="dwm_demo"
        topicLabel="Team size"
        messageLabel="What would you like to see?"
        submitLabel="Request DWM Demo"
        topics={["1–10 people", "11–50 people", "51–200 people", "200+ people"]}
      />
    </FormPage>
  );
}
