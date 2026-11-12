import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-welding.jpg";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { STORE_URL } from "@/lib/site";
import { useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { StatsCounter } from "@/components/site/StatsCounter";
import { btnDark, btnDarkOutline, btnOutline, btnPrimary, Container, CtaBand, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/about")({
  head: () => seo("About Weld Yard", "Weld Yard is an integrated welding solutions company connecting products, engineering, inspection and digital welding management.", "/about"),
  component: Page,
});

type L = readonly [string, string];

const fragmented: readonly { stage: L; issue: L }[] = [
  { stage: ["Consumables", "المواد الاستهلاكية"], issue: ["Bought from one supplier, without reference to the qualified procedure", "تُشترى من مورد دون الرجوع إلى الإجراء المؤهَّل"] },
  { stage: ["Procedures", "الإجراءات"], issue: ["Qualified by a separate consultant, documented in isolation", "تؤهَّل عبر استشاري منفصل وتوثَّق بمعزل عن غيرها"] },
  { stage: ["Inspection", "الفحص"], issue: ["Performed by another party, with reports in another format", "تنفذه جهة أخرى بتقارير بصيغة مختلفة"] },
  { stage: ["Records", "السجلات"], issue: ["Kept in binders and spreadsheets until turnover", "تُحفظ في ملفات وجداول حتى التسليم"] },
];

const pillars: readonly { n: string; title: L; body: L; to?: string; href?: string; cta: L }[] = [
  { n: "01", title: ["Welding Products", "منتجات اللحام"], body: ["Consumables, equipment and accessories selected against your process and specification.", "مواد استهلاكية ومعدات وملحقات تُختار وفق العملية والمواصفات."], href: STORE_URL, cta: ["Visit Store", "زيارة المتجر"] },
  { n: "02", title: ["Welding Engineering", "هندسة اللحام"], body: ["Procedure development and qualification support — pWPS, PQR, WPS and WPQ.", "دعم تطوير الإجراءات وتأهيلها — pWPS وPQR وWPS وWPQ."], to: "/welding-engineering", cta: ["Engineering services", "الخدمات الهندسية"] },
  { n: "03", title: ["QA/QC & Inspection", "ضمان ومراقبة الجودة والفحص"], body: ["Inspection planning and execution before, during and after welding.", "تخطيط الفحص وتنفيذه قبل اللحام وأثناءه وبعده."], to: "/qa-qc-inspection", cta: ["Inspection services", "خدمات الفحص"] },
  { n: "04", title: ["Weld Yard DWM", "Weld Yard DWM"], body: ["A digital workspace to organise welding documentation and quality records.", "مساحة عمل رقمية لتنظيم وثائق اللحام وسجلات الجودة."], to: "/dwm", cta: ["Explore DWM", "اكتشف DWM"] },
];

const codes = ["ASME IX", "AWS D1.1", "API 1104", "ISO 15614-1", "ISO 9606-1"];

const commitments: readonly { title: L; body: L }[] = [
  { title: ["Shop-floor realism", "واقعية الورشة"], body: ["Procedures and plans written to be executed in real fabrication conditions.", "إجراءات وخطط مكتوبة لتُنفَّذ في ظروف التصنيع الفعلية."] },
  { title: ["Traceable records", "سجلات قابلة للتتبع"], body: ["Documentation organised so it can be reviewed at any stage up to turnover.", "توثيق منظم يمكن مراجعته في أي مرحلة حتى التسليم."] },
  { title: ["Specification first", "المواصفات أولاً"], body: ["Recommendations start from your project requirements and applicable codes.", "تنطلق توصياتنا من متطلبات مشروعك والأكواد المعمول بها."] },
  { title: ["One accountable partner", "شريك واحد مسؤول"], body: ["A single point of contact across products, engineering, inspection and records.", "جهة تواصل واحدة عبر المنتجات والهندسة والفحص والسجلات."] },
];

const models: readonly { title: L; body: L }[] = [
  { title: ["Integrated engagement", "تعاقد متكامل"], body: ["Products, engineering, inspection and DWM combined for one project scope.", "المنتجات والهندسة والفحص وDWM مجتمعة لنطاق مشروع واحد."] },
  { title: ["Specialist support", "دعم متخصص"], body: ["A single service — for example procedure qualification or inspection only.", "خدمة واحدة — مثل تأهيل الإجراءات أو الفحص فقط."] },
  { title: ["Digital adoption", "التحول الرقمي"], body: ["Moving existing paper-based welding records into Weld Yard DWM.", "نقل سجلات اللحام الورقية الحالية إلى Weld Yard DWM."] },
];

const audiences: readonly { who: L; body: L; to: string; cta: L }[] = [
  { who: ["Procurement teams", "فرق المشتريات"], body: ["Send a material list or request pricing for welding products.", "أرسلوا قائمة المواد أو اطلبوا أسعار منتجات اللحام."], to: "/request-quote", cta: ["Request a Quote", "اطلب عرض سعر"] },
  { who: ["Project & QA/QC managers", "مديرو المشاريع والجودة"], body: ["Discuss procedures, inspection plans or on-site inspection scope.", "ناقشوا الإجراءات أو خطط الفحص أو نطاق الفحص الميداني."], to: "/contact", cta: ["Contact our team", "تواصل مع فريقنا"] },
  { who: ["Operations leaders", "قادة العمليات"], body: ["See how Weld Yard DWM can organise your welding records.", "اطلعوا على كيفية تنظيم Weld Yard DWM لسجلات اللحام."], to: "/request-dwm-demo", cta: ["Request a DWM Demo", "اطلب عرضاً لـ DWM"] },
];

function Page() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  const l = (v: L) => tr(v[0], v[1]);
  useLocalizedMeta({ title: "عن Weld Yard", description: "Weld Yard شركة حلول لحام متكاملة تربط بين المنتجات والهندسة والفحص والإدارة الرقمية للحام." });
  return (
    <>
      <PageHero eyebrow={d.aboutWeldYard} title={tr("Integrated Welding Solutions", "حلول لحام متكاملة")} intro={tr("Weld Yard brings welding products, engineering, QA/QC inspection and digital welding management together under one company.", "تجمع Weld Yard بين منتجات اللحام والهندسة وفحص ضمان/مراقبة الجودة (QA/QC) والإدارة الرقمية للحام تحت مظلة شركة واحدة.")} image={hero} fixedImage />
      <StatsCounter />

      {/* Manifesto */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <SectionHeading eyebrow={tr("Why we exist", "لماذا نحن")} title={tr("Welding quality breaks down between suppliers", "جودة اللحام تتعثر بين الموردين")} />
            <p className="mt-6 text-lg text-muted-foreground">{tr("On many projects, each stage of welding is handled by a different party. Information is passed by email and paper, and gaps appear exactly where responsibilities meet.", "في كثير من المشاريع، تتولى جهة مختلفة كل مرحلة من مراحل اللحام. تنتقل المعلومات عبر البريد والورق، وتظهر الفجوات حيث تلتقي المسؤوليات.")}</p>
            <p className="mt-4 text-lg font-semibold text-foreground">{tr("Weld Yard was set up to connect those stages under one partner.", "تأسست Weld Yard لربط هذه المراحل تحت شريك واحد.")}</p>
          </div>
          <ol className="divide-y border">
            {fragmented.map((f, i) => (
              <li key={f.stage[0]} className="grid grid-cols-[3rem_1fr] gap-4 p-5">
                <span className="font-mono text-sm text-brand-ink">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <p className="font-bold">{l(f.stage)}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{l(f.issue)}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Pillars */}
      <section className="border-t bg-navy py-20 text-navy-foreground sm:py-28">
        <Container>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">{tr("The integrated model", "النموذج المتكامل")}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-extrabold sm:text-4xl">{tr("Four disciplines, one welding partner", "أربعة تخصصات، شريك لحام واحد")}</h2>
          <div className="mt-12 grid gap-px border border-navy-border bg-navy-border sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p) => (
              <div key={p.n} className="flex flex-col bg-navy p-7">
                <span className="font-mono text-sm text-primary">{p.n}</span>
                <h3 className="mt-4 text-xl font-bold">{l(p.title)}</h3>
                <p className="mt-3 flex-1 text-sm text-navy-muted">{l(p.body)}</p>
                {p.href ? (
                  <a href={p.href} className="mt-6 text-sm font-semibold text-primary hover:underline">{l(p.cta)} <span className="rtl:inline-block rtl:rotate-180">→</span></a>
                ) : (
                  <Link to={p.to!} className="mt-6 text-sm font-semibold text-primary hover:underline">{l(p.cta)} <span className="rtl:inline-block rtl:rotate-180">→</span></Link>
                )}
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Governance */}
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow={tr("Technical governance", "الحوكمة الفنية")} title={tr("Work aligned to recognised welding codes", "عمل متوافق مع أكواد اللحام المعترف بها")} intro={tr("We start from the codes and specifications that apply to your project, and keep the records that show how they were met.", "ننطلق من الأكواد والمواصفات المطبقة على مشروعك، ونحتفظ بالسجلات التي تثبت الالتزام بها.")} />
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">{tr("Codes we commonly work with", "أكواد نعمل بها عادةً")}</p>
            <ul className="mt-4 flex flex-wrap gap-2" dir="ltr">
              {codes.map((c) => <li key={c} className="border px-3 py-2 font-mono text-sm">{c}</li>)}
            </ul>
            <p className="mt-6 text-sm text-muted-foreground">{tr("The applicable code is always set by your project specification.", "يحدد الكود المطبق دائماً وفق مواصفات مشروعك.")}</p>
          </div>
        </Container>
      </section>

      {/* Commitments */}
      <section className="border-t bg-card py-20">
        <Container>
          <SectionHeading eyebrow={tr("What guides us", "ما يوجّهنا")} title={tr("Our operating commitments", "التزاماتنا في العمل")} />
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {commitments.map((c) => (
              <div key={c.title[0]} className="border-s-2 border-primary ps-5">
                <h3 className="font-bold">{l(c.title)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{l(c.body)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Engagement models */}
      <section className="border-t py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={tr("How to work with us", "كيف تعمل معنا")} title={tr("Engagements sized to your scope", "تعاقدات بحجم نطاق عملك")} intro={tr("Support is available in English and Arabic.", "الدعم متاح باللغتين العربية والإنجليزية.")} />
          <div className="mt-12 grid gap-px border bg-border md:grid-cols-3">
            {models.map((m, i) => (
              <div key={m.title[0]} className="bg-background p-7">
                <span className="font-mono text-xs text-brand-ink">{tr("Model", "نموذج")} {String.fromCharCode(65 + i)}</span>
                <h3 className="mt-3 text-lg font-bold">{l(m.title)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{l(m.body)}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Audience pathways */}
      <section className="border-t bg-card py-20">
        <Container>
          <SectionHeading eyebrow={tr("Next step", "الخطوة التالية")} title={tr("Start from your role", "ابدأ من دورك")} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {audiences.map((a, i) => (
              <div key={a.who[0]} className="flex flex-col border bg-background p-7">
                <h3 className="text-lg font-bold">{l(a.who)}</h3>
                <p className="mt-2 flex-1 text-sm text-muted-foreground">{l(a.body)}</p>
                <Link to={a.to} className={`mt-6 ${i === 0 ? btnPrimary : btnOutline}`}>{l(a.cta)}</Link>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <CtaBand title={tr("Work with Weld Yard", "اعمل مع Weld Yard")} body={tr("Let's discuss how we can support your welding operations.", "لنناقش كيف يمكننا دعم عمليات اللحام لديكم.")}>
        <Link to="/contact" className={btnDark}>{d.contactTeam}</Link>
        <Link to="/solutions" className={btnDarkOutline}>{tr("Our Solutions", "حلولنا")}</Link>
      </CtaBand>
    </>
  );
}
