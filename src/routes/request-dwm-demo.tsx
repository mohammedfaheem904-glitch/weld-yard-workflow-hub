import { createFileRoute } from "@tanstack/react-router";
import { DWM_URL } from "@/lib/site";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { FormPage } from "@/components/site/FormPage";
import { InquiryForm } from "@/components/site/InquiryForm";
import { Checklist } from "@/components/site/blocks";

export const Route = createFileRoute("/request-dwm-demo")({
  head: () => seo("Request a DWM Demo", "Book a walkthrough of Weld Yard DWM, the digital welding management application.", "/request-dwm-demo"),
  component: Page,
});

function Page() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  useLocalizedMeta({ title: "طلب عرض تجريبي لـ DWM", description: "احجز جولة تعريفية في Weld Yard DWM، تطبيق الإدارة الرقمية للحام." });
  const topics = ([
    ["1–10 people", "1–10 أشخاص"],
    ["11–50 people", "11–50 شخصاً"],
    ["51–200 people", "51–200 شخص"],
    ["200+ people", "أكثر من 200 شخص"],
  ] as [string, string][]).map(([en, ar]) => ({ value: en, label: tr(en, ar) }));
  return (
    <FormPage
      eyebrow="Weld Yard DWM"
      title={tr("Request a DWM demo", "طلب عرض تجريبي لـ DWM")}
      intro={tr("See how Weld Yard DWM can organise your welders, joints, inspections and quality records.", "اكتشف كيف يمكن لـ Weld Yard DWM تنظيم اللحّامين والوصلات والفحوصات وسجلات الجودة لديك.")}
      aside={
        <div className="space-y-6">
          <div>
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-brand-ink">{tr("How the demo works", "كيف يتم العرض التجريبي")}</p>
            <ol className="mt-4 space-y-4">
              {([
                ["Send your request", "أرسل طلبك", "Tell us about your team and projects.", "أخبرنا عن فريقك ومشاريعك."],
                ["We contact you", "نتواصل معك", "Our team reaches out to agree a time.", "يتواصل فريقنا معك لتحديد موعد."],
                ["Guided walkthrough", "جولة تعريفية موجّهة", "We walk through the DWM workflow with you.", "نستعرض معك مسار العمل في DWM."],
                ["Next steps", "الخطوات التالية", "We discuss how to get your team started.", "نناقش كيفية بدء فريقك."],
              ] as const).map(([en, ar, dEn, dAr], i) => (
                <li key={en} className="flex gap-3">
                  <span className="grid size-7 shrink-0 place-items-center border-2 border-brand font-mono text-xs font-bold text-brand-ink">{i + 1}</span>
                  <div><p className="font-bold">{tr(en, ar)}</p><p className="text-sm text-muted-foreground">{tr(dEn, dAr)}</p></div>
                </li>
              ))}
            </ol>
          </div>
          <Checklist items={tr(["A walkthrough tailored to your workflow", "Answers to your team's questions", "Next steps for getting started"], ["جولة تعريفية مصممة وفق سير عملك", "إجابات عن أسئلة فريقك", "الخطوات التالية للبدء"])} />
          <p className="text-sm text-muted-foreground">
            {tr("Already a user?", "مستخدم حالي؟")} <a href={DWM_URL} className="font-bold text-brand-ink">{d.accessDwm}</a>
          </p>
        </div>
      }
    >
      <InquiryForm
        type="dwm_demo"
        topicLabel={tr("Team size", "حجم الفريق")}
        messageLabel={tr("What would you like to see?", "ما الذي تود رؤيته؟")}
        submitLabel={d.requestDemo}
        topics={topics}
      />
    </FormPage>
  );
}
