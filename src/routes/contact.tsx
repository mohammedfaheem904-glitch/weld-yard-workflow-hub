import { createFileRoute, Link } from "@tanstack/react-router";
import { STORE_URL } from "@/lib/site";
import { seo } from "@/lib/seo";
import { useLocalizedMeta, useTr } from "@/lib/locale";
import { FormPage } from "@/components/site/FormPage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Checklist } from "@/components/site/blocks";

export const Route = createFileRoute("/contact")({
  head: () => seo("Contact", "Contact Weld Yard about welding products, engineering, QA/QC inspection or Weld Yard DWM.", "/contact"),
  component: Page,
});

function Page() {
  const tr = useTr();
  useLocalizedMeta({ title: "تواصل معنا", description: "تواصل مع Weld Yard بشأن منتجات اللحام أو الهندسة أو فحص ضمان/مراقبة الجودة (QA/QC) أو Weld Yard DWM." });
  const topics = [
    ["General enquiry", "استفسار عام"],
    ["Welding Products", "منتجات اللحام"],
    ["Welding Engineering", "هندسة اللحام"],
    ["QA/QC & Inspection", "ضمان/مراقبة الجودة (QA/QC) والفحص"],
    ["Weld Yard DWM", "Weld Yard DWM"],
    ["Other", "أخرى"],
  ].map(([en, ar]) => ({ value: en, label: tr(en, ar) }));
  return (
    <FormPage
      eyebrow={tr("Contact", "تواصل معنا")}
      title={tr("Contact our team", "تواصل مع فريقنا")}
      intro={tr("Send us a message about products, engineering, inspection or DWM and the right person will get back to you.", "أرسل لنا رسالة بشأن المنتجات أو الهندسة أو الفحص أو DWM وسيتواصل معك الشخص المختص.")}
      aside={
        <div className="space-y-6">
          <Checklist items={tr(["General enquiries", "Technical questions", "Partnership requests"], ["الاستفسارات العامة", "الأسئلة الفنية", "طلبات الشراكة"])} />
          <p className="text-sm text-muted-foreground">
            {tr("Need pricing?", "تحتاج إلى أسعار؟")} <Link to="/request-quote" className="font-bold text-brand-ink">{tr("Request a quote", "اطلب عرض سعر")}</Link>. {tr("Ready to order?", "جاهز للطلب؟")} <a href={STORE_URL} className="font-bold text-brand-ink">{tr("Visit the store", "زُر المتجر")}</a>.
          </p>
        </div>
      }
    >
      <InquiryForm type="contact" topics={topics} />
    </FormPage>
  );
}
