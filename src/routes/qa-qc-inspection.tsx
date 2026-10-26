import { createFileRoute, Link } from "@tanstack/react-router";
import img from "@/assets/inspection.jpg";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { btnDark, btnDarkOutline, btnPrimary, Container, CtaBand, FeatureGrid, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/qa-qc-inspection")({
  head: () => seo("QA/QC & Inspection", "Weld inspection, quality control support and quality documentation services from Weld Yard.", "/qa-qc-inspection"),
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

const servicesAr = [
  { title: "الفحص البصري وفحص أبعاد اللحام", body: "فحص التجميع وشكل اللحام وأبعاده وفق متطلبات المشروع." },
  { title: "تنسيق الاختبارات غير الإتلافية (NDT)", body: "تخطيط وتنسيق أنشطة الاختبارات غير الإتلافية للحاماتكم." },
  { title: "دعم مراقبة الجودة", body: "تواجد يومي لمراقبة الجودة (QC) ومتابعة أعمال التصنيع والموقع." },
  { title: "خطط الفحص والاختبار", body: "المساعدة في إعداد خطط الفحص والاختبار ومتابعتها." },
  { title: "متابعة حالات عدم المطابقة", body: "تسجيل مشكلات الجودة وتتبعها وإغلاقها." },
  { title: "توثيق الجودة", body: "تجميع سجلات لحام منظمة وملفات جودة للتسليم." },
];

function Page() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  useLocalizedMeta({ title: "ضمان/مراقبة الجودة (QA/QC) والفحص", description: "خدمات فحص اللحام ودعم مراقبة الجودة وتوثيق الجودة من Weld Yard." });
  return (
    <>
      <PageHero eyebrow={d.qaqc} title={tr("Quality you can document", "جودة يمكنك توثيقها")} intro={tr("Inspection and quality control support from fit-up to final acceptance, with records that are ready for handover.", "دعم الفحص ومراقبة الجودة من مرحلة التجميع حتى القبول النهائي، مع سجلات جاهزة للتسليم.")} image={img}>
        <Link to="/request-quote" className={btnPrimary}>{tr("Request Inspection Support", "طلب دعم الفحص")}</Link>
      </PageHero>
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={tr("Services", "الخدمات")} title={tr("Inspection & quality services", "خدمات الفحص والجودة")} />
          <div className="mt-12"><FeatureGrid items={tr(services, servicesAr)} /></div>
        </Container>
      </section>
      <CtaBand title={tr("Go digital with your inspection records", "حوّل سجلات الفحص إلى سجلات رقمية")} body={tr("Pair inspection services with Weld Yard DWM for traceable, organised quality data.", "اجمع بين خدمات الفحص وWeld Yard DWM للحصول على بيانات جودة منظمة وقابلة للتتبع.")}>
        <Link to="/dwm" className={btnDark}>{tr("Discover DWM", "اكتشف DWM")}</Link>
        <Link to="/contact" className={btnDarkOutline}>{d.contactTeam}</Link>
      </CtaBand>
    </>
  );
}
