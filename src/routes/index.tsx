import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-welding.jpg";
import engineering from "@/assets/engineering.jpg";
import { JOURNEYS, BUSINESS_AREAS, DWM_FEATURES, DWM_URL, INDUSTRIES } from "@/lib/site";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { loc, useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import {
  btnDark, btnDarkOutline, btnOutline, btnPrimary, Checklist, Container, CtaBand, Eyebrow,
  FeatureGrid, Lifecycle, SectionHeading, TextLink,
} from "@/components/site/blocks";

export const Route = createFileRoute("/")({
  head: () => seo("Integrated Welding Solutions", "Weld Yard connects welding products, engineering support, QA/QC inspection and digital welding management across your welding operations.", "/"),
  component: Home,
});

function Home() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  useLocalizedMeta({
    title: "حلول لحام متكاملة",
    description: "تربط Weld Yard بين منتجات اللحام والدعم الهندسي وفحص ضمان/مراقبة الجودة (QA/QC) والإدارة الرقمية للحام عبر جميع مراحل عمليات اللحام لديكم.",
  });
  return (
    <>
      <section className="relative overflow-hidden border-b">
        <img src={hero} alt={tr("Welder working on a large steel pipe with sparks", "لحّام يعمل على أنبوب فولاذي كبير مع تطاير الشرر")} width={1640} height={1088} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover object-[70%_center] rtl:-scale-x-100" />
        <div aria-hidden className="absolute inset-0 bg-hero-fade" />
        <Container className="relative py-24 sm:py-32 lg:py-40">
          <div className="max-w-2xl">
            <Eyebrow>{d.tagline}</Eyebrow>
            <h1 className="mt-6 text-5xl font-black leading-[0.98] sm:text-6xl lg:text-7xl rtl:leading-[1.2]">
              {tr(<>Integrated Welding <span className="text-brand-ink">Solutions</span></>, <>حلول لحام <span className="text-brand-ink">متكاملة</span></>)}
            </h1>
            <p className="mt-7 max-w-xl text-lg text-muted-foreground sm:text-xl">
              {tr(
                "From welding products and engineering support to quality inspection and digital welding management, Weld Yard connects the essential stages of your welding operations.",
                "من منتجات اللحام والدعم الهندسي إلى فحص الجودة والإدارة الرقمية للحام، تربط Weld Yard بين المراحل الأساسية لعمليات اللحام لديكم.",
              )}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/solutions" className={btnPrimary}>{tr("Explore Our Solutions", "استكشف حلولنا")}</Link>
              <Link to="/contact" className={btnOutline}>{d.contactTeam}</Link>
            </div>
            <p className="mt-12 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground rtl:font-arabic rtl:tracking-normal">{d.supporting}</p>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={tr("What we do", "ما نقدمه")} title={tr("Four connected business areas", "أربعة مجالات أعمال مترابطة")} intro={tr("One partner for the products, expertise, inspection and digital records your welding work depends on.", "شريك واحد للمنتجات والخبرات والفحص والسجلات الرقمية التي تعتمد عليها أعمال اللحام لديكم.")} />
          <ul className="mt-14 grid gap-px border bg-border md:grid-cols-2 lg:grid-cols-4">
            {BUSINESS_AREAS.map((raw) => {
              const a = loc(raw, locale);
              return (
                <li key={a.n} className="flex flex-col bg-background p-8">
                  <span className="font-mono text-sm text-brand-ink">{a.n}</span>
                  <h3 className="mt-8 text-2xl font-extrabold">{a.title}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{a.body}</p>
                  <div className="mt-8"><TextLink to={a.to}>{d.learnMore}</TextLink></div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="border-y bg-card py-20 sm:py-28" aria-labelledby="journeys-title">
        <Container>
          <SectionHeading eyebrow={tr("Start here", "ابدأ من هنا")} title={tr("Find the right next step", "اختر خطوتك التالية المناسبة")} intro={tr("Choose the path that matches your team.", "اختر المسار الذي يناسب فريقك.")} />
          <ul className="mt-14 grid gap-px border bg-border lg:grid-cols-3">
            {JOURNEYS.map((raw) => {
              const j = loc(raw, locale);
              return (
                <li key={raw.audience} className="flex flex-col bg-card p-8">
                  <h3 className="text-2xl font-extrabold">{j.audience}</h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{j.body}</p>
                  <ul className="mt-8 flex flex-col gap-2">
                    {raw.actions.map((a) => {
                      const label = tr(a.label, a.labelAr);
                      return (
                        <li key={a.label}>
                          {a.external ? (
                            <a href={a.href} className="flex min-h-11 items-center justify-between border px-4 py-2 text-sm font-bold transition-colors hover:border-primary hover:text-brand-ink">{label}<span aria-hidden className="rtl:-scale-x-100">↗</span></a>
                          ) : (
                            <Link to={a.href} className="flex min-h-11 items-center justify-between border px-4 py-2 text-sm font-bold transition-colors hover:border-primary hover:text-brand-ink">{label}<span aria-hidden className="rtl:rotate-180">→</span></Link>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={tr("The welding lifecycle", "دورة حياة اللحام")} title={tr("Every stage, connected", "كل مرحلة، مترابطة")} intro={tr("Weld Yard supports the full path of a weld — from the material on the rack to the quality dossier at handover.", "تدعم Weld Yard المسار الكامل للّحام — من المواد على الرف حتى ملف الجودة عند التسليم.")} />
          <div className="mt-14"><Lifecycle /></div>
        </Container>
      </section>

      <section className="py-20 sm:py-28">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <img src={engineering} alt={tr("Welding engineer reviewing drawings in a fabrication hall", "مهندس لحام يراجع المخططات في صالة تصنيع")} width={1280} height={896} loading="lazy" className="aspect-[4/3] w-full object-cover" />
          <div>
            <SectionHeading eyebrow={tr("Capabilities", "القدرات")} title={tr("Practical support where welding happens", "دعم عملي حيث يتم اللحام")} />
            <div className="mt-8">
              <Checklist items={tr([
                "Supply of welding consumables, equipment and safety products",
                "Welding procedure and qualification support",
                "Weld inspection and quality control activities",
                "Organised quality documentation for handover",
                "Digital tracking of welders, joints and inspections with Weld Yard DWM",
              ], [
                "توريد مواد اللحام الاستهلاكية والمعدات ومنتجات السلامة",
                "دعم إجراءات اللحام والتأهيل",
                "أنشطة فحص اللحام ومراقبة الجودة",
                "توثيق جودة منظم للتسليم",
                "تتبع رقمي للّحامين والوصلات والفحوصات عبر Weld Yard DWM",
              ])} />
            </div>
            <div className="mt-10"><TextLink to="/solutions">{tr("See all solutions", "عرض جميع الحلول")}</TextLink></div>
          </div>
        </Container>
      </section>

      <section className="border-y bg-card py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow={tr("Industries", "القطاعات")} title={tr("Built for demanding sectors", "مصممة للقطاعات ذات المتطلبات العالية")} />
            <TextLink to="/industries">{tr("All industries", "جميع القطاعات")}</TextLink>
          </div>
          <ul className="mt-12 grid grid-cols-2 gap-px border bg-border lg:grid-cols-4">
            {INDUSTRIES.map((i) => (
              <li key={i.name} className="bg-card p-6 font-display text-lg font-bold">{loc(i, locale).name}</li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="relative overflow-hidden py-20 sm:py-28">
        <div aria-hidden className="absolute inset-0 grid-lines opacity-30" />
        <Container className="relative">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Weld Yard DWM" title={tr("Digital Welding Management", "الإدارة الرقمية للحام")} intro={tr("Replace paper forms and scattered spreadsheets with one structured workspace for welding quality.", "استبدل النماذج الورقية وجداول البيانات المتفرقة بمساحة عمل واحدة منظمة لجودة اللحام.")} />
            <div className="flex flex-wrap gap-3">
              <Link to="/request-dwm-demo" className={btnPrimary}>{d.requestDemo}</Link>
              <a href={DWM_URL} className={btnOutline}>{d.accessDwm}</a>
            </div>
          </div>
          <div className="mt-14"><FeatureGrid items={DWM_FEATURES.map((f) => loc(f, locale))} /></div>
        </Container>
      </section>

      <CtaBand title={tr("Let's talk about your welding operations", "لنتحدث عن عمليات اللحام لديكم")} body={tr("Tell us about your project, product needs or quality requirements.", "أخبرنا عن مشروعك أو احتياجاتك من المنتجات أو متطلبات الجودة.")}>
        <Link to="/contact" className={btnDark}>{d.contactTeam}</Link>
        <Link to="/request-quote" className={btnDarkOutline}>{d.requestQuote}</Link>
      </CtaBand>
    </>
  );
}
