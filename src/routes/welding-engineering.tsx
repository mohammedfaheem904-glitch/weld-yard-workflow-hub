import { createFileRoute, Link } from "@tanstack/react-router";
import img from "@/assets/engineering.jpg";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { btnDark, btnDarkOutline, btnPrimary, Container, CtaBand, FeatureGrid, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/welding-engineering")({
  head: () => seo("Welding Engineering", "Welding procedure development, welder qualification support and technical welding guidance from Weld Yard.", "/welding-engineering"),
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

const servicesAr = [
  { title: "إعداد إجراءات اللحام", body: "دعم إعداد مواصفات إجراء اللحام (WPS) وسجلات التأهيل المرتبطة بها مثل سجل تأهيل إجراء اللحام (PQR)." },
  { title: "دعم تأهيل اللحّامين", body: "تخطيط وتنظيم اختبارات تأهيل أداء اللحّام (WPQ) وسجلاتها." },
  { title: "اختيار العمليات والمواد الاستهلاكية", body: "إرشاد لاختيار العمليات والمواد الاستهلاكية والمعايير المناسبة لموادكم." },
  { title: "المراجعة الفنية", body: "مراجعة متطلبات اللحام في المخططات والمواصفات ووثائق المشروع." },
  { title: "معالجة المشكلات", body: "مساعدة عملية في دراسة عيوب اللحام المتكررة ومشكلات الإنتاج." },
  { title: "جلسات التدريب والتوعية الميدانية", body: "جلسات معرفية للّحامين والمشرفين وفرق الجودة." },
];

function Page() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  useLocalizedMeta({ title: "هندسة اللحام", description: "إعداد إجراءات اللحام ودعم تأهيل اللحّامين والإرشاد الفني في اللحام من Weld Yard." });
  return (
    <>
      <PageHero eyebrow={d.weldingEngineering} title={tr("Engineering support behind every joint", "دعم هندسي وراء كل وصلة")} intro={tr("Technical welding expertise that helps your team plan, qualify and execute welding work with confidence.", "خبرة فنية في اللحام تساعد فريقك على تخطيط أعمال اللحام وتأهيلها وتنفيذها بثقة.")} image={img}>
        <Link to="/contact" className={btnPrimary}>{tr("Talk to an Engineer", "تحدث إلى مهندس")}</Link>
      </PageHero>
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={tr("Services", "الخدمات")} title={tr("What we help with", "ما نساعد فيه")} />
          <div className="mt-12"><FeatureGrid items={tr(services, servicesAr)} /></div>
        </Container>
      </section>
      <CtaBand title={tr("Have a welding engineering requirement?", "لديك متطلب في هندسة اللحام؟")} body={tr("Share your scope and our team will discuss how we can support.", "شاركنا نطاق العمل وسيناقش فريقنا كيف يمكننا الدعم.")}>
        <Link to="/request-quote" className={btnDark}>{d.requestQuote}</Link>
        <Link to="/contact" className={btnDarkOutline}>{d.contactTeam}</Link>
      </CtaBand>
    </>
  );
}
