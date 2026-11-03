import { createFileRoute, Link } from "@tanstack/react-router";
import { DWM_URL } from "@/lib/site";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { btnDark, btnDarkOutline, btnOutline, btnPrimary, Checklist, Container, CtaBand, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/dwm")({
  head: () => seo("Weld Yard DWM — Digital Welding Management", "Weld Yard DWM is a digital welding management application covering the welding quality workflow from project initialization to turnover and closure.", "/dwm"),
  component: Page,
});

type Item = { en: string; ar: string; dEn: string; dAr: string };

// Official DWM workflow — order is fixed by Weld Yard. Do not reorder, merge or rename.
export const DWM_INIT_ACTIVITIES: Item[] = [
  { en: "ITP", ar: "خطة الفحص والاختبار (ITP)", dEn: "Inspection & Test Plan defining hold and witness points.", dAr: "خطة الفحص والاختبار التي تحدد نقاط التوقف والمعاينة." },
  { en: "Materials Receiving", ar: "استلام المواد", dEn: "Receipt and review of incoming materials and their certificates.", dAr: "استلام المواد الواردة ومراجعة شهاداتها." },
  { en: "Drawing Approval", ar: "اعتماد المخططات", dEn: "Review and approval of drawings before fabrication.", dAr: "مراجعة المخططات واعتمادها قبل التصنيع." },
];
export const DWM_STAGES: Item[] = [
  { en: "pWPS", ar: "pWPS", dEn: "Preliminary welding procedure specification.", dAr: "مواصفة إجراء اللحام الأولية." },
  { en: "PQR", ar: "PQR", dEn: "Procedure qualification record.", dAr: "سجل تأهيل الإجراء." },
  { en: "WPS", ar: "WPS", dEn: "Qualified welding procedure specification.", dAr: "مواصفة إجراء اللحام المؤهلة." },
  { en: "WPQ", ar: "WPQ", dEn: "Welder performance qualification.", dAr: "تأهيل أداء اللحّام." },
  { en: "WELD LOG", ar: "سجل اللحام", dEn: "Recording welds against joints, welders and procedures.", dAr: "تسجيل اللحامات مقابل الوصلات واللحّامين والإجراءات." },
  { en: "INSPECTION", ar: "الفحص", dEn: "Inspection activities and results.", dAr: "أنشطة الفحص ونتائجه." },
  { en: "NCR", ar: "تقرير عدم المطابقة (NCR)", dEn: "Non-conformance reporting and follow-up.", dAr: "الإبلاغ عن حالات عدم المطابقة ومتابعتها." },
  { en: "TURNOVER & HANDOVER", ar: "التسليم والتسلّم", dEn: "Compiling quality records for handover.", dAr: "تجميع سجلات الجودة للتسليم." },
  { en: "CLOSED", ar: "مغلق", dEn: "Project quality records closed.", dAr: "إغلاق سجلات جودة المشروع." },
];

const modules = [
  ["Project setup & ITP", "إعداد المشروع وخطة الفحص"],
  ["Materials & drawings", "المواد والمخططات"],
  ["Welding procedures (pWPS / PQR / WPS)", "إجراءات اللحام (pWPS / PQR / WPS)"],
  ["Welder qualifications (WPQ)", "تأهيل اللحّامين (WPQ)"],
  ["Weld log", "سجل اللحام"],
  ["Inspection & NCR", "الفحص وعدم المطابقة"],
  ["Turnover & handover", "التسليم والتسلّم"],
];

const roles = [
  ["QA/QC Manager", "مدير ضمان وضبط الجودة", "Oversees the quality workflow and records.", "يشرف على مسار الجودة وسجلاتها."],
  ["Welding Engineer", "مهندس اللحام", "Works on procedures and qualifications.", "يعمل على الإجراءات والتأهيلات."],
  ["QC Inspector", "مفتش ضبط الجودة", "Records inspection activity.", "يسجّل أنشطة الفحص."],
  ["Project Manager", "مدير المشروع", "Follows project quality status.", "يتابع حالة جودة المشروع."],
  ["Client / Third-Party", "العميل / الطرف الثالث", "Reviews quality records relevant to them.", "يراجع سجلات الجودة ذات الصلة."],
];

function Badge() {
  const tr = useTr();
  return (
    <span className="inline-flex items-center gap-2 border border-dashed border-primary/60 bg-background px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-wider text-brand-ink">
      {tr("Illustrative Workflow", "مخطط توضيحي لمسار العمل")}
    </span>
  );
}

function Page() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  const ar = locale === "ar";
  useLocalizedMeta({ title: "Weld Yard DWM — الإدارة الرقمية للحام", description: "Weld Yard DWM تطبيق للإدارة الرقمية للحام يغطي مسار جودة اللحام من بدء المشروع حتى التسليم والإغلاق." });
  return (
    <>
      <PageHero eyebrow="Weld Yard DWM" title={tr("Digital Welding Management", "الإدارة الرقمية للحام")} intro={tr("One workspace for the welding quality workflow — from project initialization to turnover and closure.", "مساحة عمل واحدة لمسار جودة اللحام — من بدء المشروع حتى التسليم والإغلاق.")}>
        <Link to="/request-dwm-demo" className={btnPrimary}>{d.requestDemo}</Link>
        <a href={DWM_URL} className={btnOutline}>{d.accessDwm}</a>
      </PageHero>

      {/* Official workflow */}
      <section className="py-20 sm:py-28" aria-labelledby="wf">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow={tr("End-to-end workflow", "مسار العمل الشامل")} title={tr("The DWM quality workflow", "مسار الجودة في DWM")} />
            <Badge />
          </div>
          <p className="mt-4 max-w-3xl text-sm text-muted-foreground">
            {tr("A conceptual map of the stages DWM is organised around. This is not a screenshot of the application; exact screens and options are shown during a demo.", "خريطة مفاهيمية للمراحل التي يُنظَّم حولها DWM. هذه ليست لقطة شاشة من التطبيق؛ تُعرض الشاشات والخيارات الفعلية خلال العرض التجريبي.")}
          </p>

          <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,20rem)_1fr]">
            <div className="border-2 border-navy bg-navy p-6 text-navy-foreground">
              <div className="flex items-center gap-3">
                <span className="grid size-9 place-items-center bg-primary font-mono text-sm font-bold text-primary-foreground">01</span>
                <h3 className="text-base font-bold uppercase tracking-wide">{tr("Project Initialization", "بدء المشروع")}</h3>
              </div>
              <ul className="mt-5 space-y-3">
                {DWM_INIT_ACTIVITIES.map((a, i) => (
                  <li key={a.en} className="border border-navy-border p-3">
                    <p className="font-mono text-xs text-primary">1.{i + 1}</p>
                    <p className="font-bold">{ar ? a.ar : a.en}</p>
                    <p className="mt-1 text-xs text-navy-muted">{ar ? a.dAr : a.dEn}</p>
                  </li>
                ))}
              </ul>
            </div>

            <ol className="relative grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {DWM_STAGES.map((s, i) => (
                <li key={s.en} className="relative flex gap-4 border bg-card p-5">
                  <span className="grid size-9 shrink-0 place-items-center border-2 border-primary font-mono text-sm font-bold text-brand-ink">{String(i + 2).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <p className="font-bold tracking-wide">{ar ? s.ar : s.en}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{ar ? s.dAr : s.dEn}</p>
                  </div>
                  {i < DWM_STAGES.length - 1 && <span aria-hidden className="absolute -bottom-3 start-9 h-3 w-0.5 bg-primary sm:hidden" />}
                </li>
              ))}
            </ol>
          </div>
          <p className="mt-6 font-mono text-xs text-muted-foreground" dir="ltr">
            ITP · Materials Receiving · Drawing Approval → pWPS → PQR → WPS → WPQ → WELD LOG → INSPECTION → NCR → TURNOVER &amp; HANDOVER → CLOSED
          </p>
        </Container>
      </section>

      {/* Modules + roles */}
      <section className="border-y bg-card py-20 sm:py-28">
        <Container className="grid gap-14 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow={tr("Workspace areas", "مجالات العمل")} title={tr("Seven areas, one connected record", "سبعة مجالات، سجل واحد مترابط")} />
            <ol className="mt-8 grid gap-px border bg-border">
              {modules.map(([en, a], i) => (
                <li key={en} className="flex items-center gap-4 bg-background px-5 py-4">
                  <span className="font-mono text-sm text-brand-ink">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-semibold">{ar ? a : en}</span>
                </li>
              ))}
            </ol>
          </div>
          <div>
            <SectionHeading eyebrow={tr("Who it's for", "لمن صُمّم")} title={tr("Built for every role in welding quality", "لكل دور في جودة اللحام")} />
            <ul className="mt-8 grid gap-3">
              {roles.map(([en, a, dEn, dAr]) => (
                <li key={en} className="border-s-2 border-primary bg-background p-4">
                  <p className="font-bold">{ar ? a : en}</p>
                  <p className="text-sm text-muted-foreground">{ar ? dAr : dEn}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">{tr("Access levels and permissions for each role are confirmed with your team during the demo.", "تُحدَّد مستويات الوصول والصلاحيات لكل دور مع فريقك خلال العرض التجريبي.")}</p>
          </div>
        </Container>
      </section>

      {/* Benefits */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={tr("Why DWM", "لماذا DWM")} title={tr("Built around how welding quality really works", "مصمم وفق الطريقة الفعلية لإدارة جودة اللحام")} />
          <div className="mt-8 max-w-3xl">
            <Checklist items={tr([
              "Structured data instead of scattered spreadsheets",
              "Welding procedures, welders, welds and inspections organised in one workflow",
              "Easier preparation of turnover documentation",
              "Designed by a team that works across the welding lifecycle",
            ], [
              "بيانات منظمة بدلاً من جداول بيانات متفرقة",
              "تنظيم إجراءات اللحام واللحّامين واللحامات والفحوصات في مسار واحد",
              "إعداد أسهل لوثائق التسليم",
              "صُمم من قِبل فريق يعمل عبر دورة حياة اللحام",
            ])} />
          </div>
        </Container>
      </section>

      <CtaBand title={tr("See Weld Yard DWM in action", "شاهد Weld Yard DWM أثناء العمل")} body={tr("Book a walkthrough with our team, or open the application if you already have an account.", "احجز جولة تعريفية مع فريقنا، أو افتح التطبيق إذا كان لديك حساب بالفعل.")}>
        <Link to="/request-dwm-demo" className={btnDark}>{d.requestDemo}</Link>
        <a href={DWM_URL} className={btnDarkOutline}>{d.accessDwm}</a>
      </CtaBand>
    </>
  );
}
