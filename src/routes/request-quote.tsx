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
      aside={
        <div>
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand-ink">{tr("Preparing your RFQ", "تجهيز طلب عرض السعر")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{tr("Including these details helps us quote accurately.", "تساعدنا هذه التفاصيل على إعداد عرض سعر دقيق.")}</p>
          <div className="mt-4 space-y-4">
            {([
              ["For products", "للمنتجات", ["Product names, grades and specifications", "Sizes / diameters and quantities", "Required certificates, if any"], ["أسماء المنتجات ورتبها ومواصفاتها", "المقاسات / الأقطار والكميات", "الشهادات المطلوبة إن وُجدت"]],
              ["For engineering", "للهندسة", ["Base materials and thickness ranges", "Applicable code or standard", "Required timeline"], ["المواد الأساسية ونطاقات السماكة", "الكود أو المعيار المطبّق", "الجدول الزمني المطلوب"]],
              ["For inspection", "للفحص", ["Project location", "Approximate scope or number of joints", "Required inspection / NDT methods"], ["موقع المشروع", "النطاق التقريبي أو عدد الوصلات", "طرق الفحص / الاختبارات غير الإتلافية المطلوبة"]],
            ] as const).map(([en, ar, iEn, iAr]) => (
              <div key={en} className="border-s-2 border-primary bg-card p-4">
                <p className="font-bold">{tr(en, ar)}</p>
                <div className="mt-2"><Checklist items={tr([...iEn], [...iAr])} /></div>
              </div>
            ))}
          </div>
        </div>
      }
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
