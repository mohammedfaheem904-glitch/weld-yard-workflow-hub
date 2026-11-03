import { createFileRoute, Link } from "@tanstack/react-router";
import { ClipboardCheck, Flame, PackageCheck } from "lucide-react";
import img from "@/assets/inspection.jpg";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { btnDark, btnDarkOutline, btnPrimary, Container, CtaBand, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/qa-qc-inspection")({
  head: () => seo("QA/QC & Inspection", "Weld inspection, quality control support and quality documentation services from Weld Yard.", "/qa-qc-inspection"),
  component: Page,
});

const stages = [
  {
    icon: ClipboardCheck,
    en: "Pre-Welding", ar: "قبل اللحام",
    noteEn: "Verify before the arc is struck", noteAr: "التحقق قبل بدء اللحام",
    items: [["Material verification", "التحقق من المواد"], ["Material traceability", "تتبع المواد"], ["Fit-up inspection", "فحص التجميع"], ["WPS and documentation review", "مراجعة WPS والوثائق"]],
  },
  {
    icon: Flame,
    en: "In-Process", ar: "أثناء اللحام",
    noteEn: "Control while work is under way", noteAr: "المراقبة أثناء تنفيذ العمل",
    items: [["Welding parameter monitoring", "مراقبة معايير اللحام"], ["Visual inspection", "الفحص البصري"], ["Welding activity monitoring", "مراقبة أنشطة اللحام"], ["Inspection records", "سجلات الفحص"]],
  },
  {
    icon: PackageCheck,
    en: "Post-Welding", ar: "بعد اللحام",
    noteEn: "Confirm, test and hand over", noteAr: "التأكيد والاختبار والتسليم",
    items: [["Visual inspection", "الفحص البصري"], ["NDT coordination: RT, UT, PT, MT", "تنسيق الاختبارات غير الإتلافية: RT وUT وPT وMT"], ["Dimensional inspection", "فحص الأبعاد"], ["Final documentation and turnover records", "التوثيق النهائي وسجلات التسليم"]],
  },
];

const trace = [
  ["Material", "المادة"], ["Joint", "الوصلة"], ["Welder", "اللحّام"], ["Procedure", "الإجراء"], ["Inspection result", "نتيجة الفحص"], ["Turnover dossier", "ملف التسليم"],
];

function Page() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  const ar = locale === "ar";
  useLocalizedMeta({ title: "ضمان/مراقبة الجودة (QA/QC) والفحص", description: "خدمات فحص اللحام ودعم مراقبة الجودة وتوثيق الجودة من Weld Yard." });
  return (
    <>
      <PageHero eyebrow={d.qaqc} title={tr("Quality you can document", "جودة يمكنك توثيقها")} intro={tr("Inspection and quality control support from fit-up to final acceptance, with records that are ready for handover.", "دعم الفحص ومراقبة الجودة من مرحلة التجميع حتى القبول النهائي، مع سجلات جاهزة للتسليم.")} image={img}>
        <Link to="/request-quote" className={btnPrimary}>{tr("Request Inspection Support", "طلب دعم الفحص")}</Link>
      </PageHero>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={tr("Inspection workflow", "مسار الفحص")} title={tr("Three stages of weld quality control", "ثلاث مراحل لمراقبة جودة اللحام")} />
          <ol className="relative mt-14 grid gap-10 lg:grid-cols-3 lg:gap-0">
            <span aria-hidden className="absolute inset-x-0 top-6 hidden h-0.5 bg-border lg:block" />
            {stages.map((s, i) => {
              const Icon = s.icon;
              return (
                <li key={s.en} className="relative lg:pe-8">
                  <div className="flex items-center gap-4">
                    <span className="relative z-10 flex h-12 w-12 items-center justify-center bg-navy text-primary">
                      <Icon aria-hidden className="h-5 w-5" />
                    </span>
                    <span className="font-mono text-xs text-brand-ink">{tr("STAGE", "المرحلة")} {String(i + 1).padStart(2, "0")}</span>
                  </div>
                  <h3 className="mt-6 text-2xl font-extrabold">{ar ? s.ar : s.en}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{ar ? s.noteAr : s.noteEn}</p>
                  <ul className="mt-6 space-y-3 border-s-2 border-primary/40 ps-5">
                    {s.items.map(([en, a]) => (
                      <li key={en} className="text-sm font-semibold">{ar ? a : en}</li>
                    ))}
                  </ul>
                </li>
              );
            })}
          </ol>
        </Container>
      </section>

      <section className="border-y bg-card py-20">
        <Container>
          <SectionHeading eyebrow={tr("Traceability", "إمكانية التتبع")} title={tr("Every weld linked to its record", "كل لحام مرتبط بسجله")} intro={tr("Organised records connect materials, joints, welders, procedures and inspection results for handover.", "تربط السجلات المنظمة المواد والوصلات واللحّامين والإجراءات ونتائج الفحص استعداداً للتسليم.")} />
          <ol className="mt-10 flex flex-wrap items-center gap-2">
            {trace.map(([en, a], i) => (
              <li key={en} className="flex items-center gap-2">
                <span className="border bg-background px-4 py-2 font-mono text-xs font-bold">{ar ? a : en}</span>
                {i < trace.length - 1 && <span aria-hidden className="h-px w-5 bg-primary" />}
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <CtaBand title={tr("Go digital with your inspection records", "حوّل سجلات الفحص إلى سجلات رقمية")} body={tr("Pair inspection services with Weld Yard DWM for traceable, organised quality data.", "اجمع بين خدمات الفحص وWeld Yard DWM للحصول على بيانات جودة منظمة وقابلة للتتبع.")}>
        <Link to="/dwm" className={btnDark}>{tr("Discover DWM", "اكتشف DWM")}</Link>
        <Link to="/contact" className={btnDarkOutline}>{d.contactTeam}</Link>
      </CtaBand>
    </>
  );
}
