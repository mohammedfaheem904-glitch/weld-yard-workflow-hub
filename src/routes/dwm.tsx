import { createFileRoute, Link } from "@tanstack/react-router";
import { DWM_FEATURES, DWM_URL } from "@/lib/site";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { loc, useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { btnDark, btnDarkOutline, btnOutline, btnPrimary, Checklist, Container, CtaBand, FeatureGrid, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/dwm")({
  head: () => seo("Weld Yard DWM — Digital Welding Management", "Weld Yard DWM is a digital welding management application for welder qualifications, weld traceability, inspections and quality documentation.", "/dwm"),
  component: Page,
});

const steps = [
  { title: "Set up your project", body: "Register welders, procedures and the joints you need to track." },
  { title: "Record work as it happens", body: "Capture welding and inspection activity against each joint." },
  { title: "Hand over with confidence", body: "Use organised records to build your quality documentation." },
];
const stepsAr = [
  { title: "أعِدّ مشروعك", body: "سجّل اللحّامين والإجراءات والوصلات التي تحتاج إلى تتبعها." },
  { title: "سجّل العمل أثناء تنفيذه", body: "دوّن أنشطة اللحام والفحص لكل وصلة." },
  { title: "سلّم بثقة", body: "استخدم السجلات المنظمة لإعداد توثيق الجودة." },
];

function Page() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  useLocalizedMeta({ title: "Weld Yard DWM — الإدارة الرقمية للحام", description: "Weld Yard DWM تطبيق للإدارة الرقمية للحام يشمل تأهيل اللحّامين وتتبع اللحامات والفحوصات وتوثيق الجودة." });
  return (
    <>
      <PageHero eyebrow="Weld Yard DWM" title={tr("Digital Welding Management", "الإدارة الرقمية للحام")} intro={tr("One workspace for welders, joints, inspections and quality records — so your team spends less time chasing paperwork.", "مساحة عمل واحدة للّحامين والوصلات والفحوصات وسجلات الجودة — ليقضي فريقك وقتاً أقل في ملاحقة الأوراق.")}>
        <Link to="/request-dwm-demo" className={btnPrimary}>{d.requestDemo}</Link>
        <a href={DWM_URL} className={btnOutline}>{d.accessDwm}</a>
      </PageHero>
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={tr("Features", "المزايا")} title={tr("What DWM helps you manage", "ما يساعدك DWM على إدارته")} />
          <div className="mt-12"><FeatureGrid items={DWM_FEATURES.map((f) => loc(f, locale))} /></div>
        </Container>
      </section>
      <section className="border-y bg-card py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={tr("Why DWM", "لماذا DWM")} title={tr("Built around how welding quality really works", "مصمم وفق الطريقة الفعلية لإدارة جودة اللحام")} />
            <div className="mt-8">
              <Checklist items={tr([
                "Structured data instead of scattered spreadsheets",
                "Clear link between welders, joints and inspections",
                "Easier preparation of quality documentation",
                "Designed by a team that works across the welding lifecycle",
              ], [
                "بيانات منظمة بدلاً من جداول بيانات متفرقة",
                "ربط واضح بين اللحّامين والوصلات والفحوصات",
                "إعداد أسهل لتوثيق الجودة",
                "صُمم من قِبل فريق يعمل عبر دورة حياة اللحام",
              ])} />
            </div>
          </div>
          <ol className="grid gap-px border bg-border">
            {tr(steps, stepsAr).map((s, i) => (
              <li key={s.title} className="flex gap-6 bg-background p-7">
                <span className="font-mono text-2xl text-brand-ink">{i + 1}</span>
                <div>
                  <h3 className="text-lg font-bold">{s.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>
      <CtaBand title={tr("See Weld Yard DWM in action", "شاهد Weld Yard DWM أثناء العمل")} body={tr("Book a walkthrough with our team, or open the application if you already have an account.", "احجز جولة تعريفية مع فريقنا، أو افتح التطبيق إذا كان لديك حساب بالفعل.")}>
        <Link to="/request-dwm-demo" className={btnDark}>{d.requestDemo}</Link>
        <a href={DWM_URL} className={btnDarkOutline}>{d.accessDwm}</a>
      </CtaBand>
    </>
  );
}
