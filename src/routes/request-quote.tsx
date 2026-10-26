import { createFileRoute } from "@tanstack/react-router";
import { seo } from "@/lib/seo";
import { useLocalizedMeta, useTr } from "@/lib/locale";
import { FormPage } from "@/components/site/FormPage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Checklist } from "@/components/site/blocks";

export const Route = createFileRoute("/request-quote")({
  head: () => seo("Request a Quote", "Request a quote from Weld Yard for welding products, engineering or QA/QC inspection services.", "/request-quote"),
  component: Page,
});

function Page() {
  const tr = useTr();
  useLocalizedMeta({ title: "طلب عرض سعر", description: "اطلب عرض سعر من Weld Yard لمنتجات اللحام أو الهندسة أو خدمات فحص ضمان/مراقبة الجودة (QA/QC)." });
  const topics = ([
    ["Welding Products", "منتجات اللحام"],
    ["Welding Engineering", "هندسة اللحام"],
    ["QA/QC & Inspection", "ضمان/مراقبة الجودة (QA/QC) والفحص"],
    ["Combined solution", "حل متكامل"],
  ] as [string, string][]).map(([en, ar]) => ({ value: en, label: tr(en, ar) }));
  return (
    <FormPage
      eyebrow={tr("Request a Quote", "طلب عرض سعر")}
      title={tr("Tell us what you need", "أخبرنا بما تحتاجه")}
      intro={tr("Share your requirement and our team will prepare a quotation.", "شاركنا متطلباتك وسيُعد فريقنا عرض سعر.")}
      aside={<Checklist items={tr(["Product names, grades and quantities", "Scope of engineering or inspection work", "Project location and timeline"], ["أسماء المنتجات ورتبها وكمياتها", "نطاق الأعمال الهندسية أو أعمال الفحص", "موقع المشروع وجدوله الزمني"])} />}
    >
      <InquiryForm
        type="quote"
        topicLabel={tr("Quote for", "عرض السعر لـ")}
        messageLabel={tr("Requirement details", "تفاصيل المتطلبات")}
        submitLabel={tr("Request a Quote", "طلب عرض سعر")}
        topics={topics}
      />
    </FormPage>
  );
}
