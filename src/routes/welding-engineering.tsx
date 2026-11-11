import { createFileRoute, Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import img from "@/assets/engineering.jpg";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { btnDark, btnDarkOutline, btnPrimary, Container, CtaBand, Eyebrow, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/welding-engineering")({
  head: () => seo("Welding Engineering", "Welding procedure development, welder qualification support and technical welding guidance from Weld Yard.", "/welding-engineering"),
  component: Page,
});

const pillars = [
  {
    code: "A",
    title: "Procedures & Qualifications",
    titleAr: "الإجراءات والتأهيل",
    items: [
      ["Welding Procedure Specifications (WPS)", "مواصفات إجراء اللحام (WPS)"],
      ["Procedure Qualification Records (PQR)", "سجلات تأهيل إجراء اللحام (PQR)"],
      ["Welder Performance Qualifications (WPQ)", "تأهيل أداء اللحّام (WPQ)"],
      ["Welding procedure review and technical compliance", "مراجعة إجراءات اللحام والمطابقة الفنية"],
    ],
  },
  {
    code: "B",
    title: "Operational Engineering Support",
    titleAr: "الدعم الهندسي التشغيلي",
    items: [
      ["Welding technical reviews", "المراجعات الفنية للحام"],
      ["Defect analysis and troubleshooting", "تحليل العيوب ومعالجة المشكلات"],
      ["Welding consumable selection", "اختيار مواد اللحام الاستهلاكية"],
      ["Welding engineering support for industrial projects", "دعم هندسة اللحام للمشاريع الصناعية"],
    ],
  },
];

const workflow = [
  ["Requirement review", "مراجعة المتطلبات"],
  ["WPS preparation", "إعداد WPS"],
  ["Procedure qualification (PQR)", "تأهيل الإجراء (PQR)"],
  ["Welder qualification (WPQ)", "تأهيل اللحّام (WPQ)"],
  ["Production support", "دعم الإنتاج"],
];

const docs = [
  { code: "WPS", en: "Welding Procedure Specification", ar: "مواصفة إجراء اللحام", fields: [["Process", "العملية"], ["Base material", "المعدن الأساسي"], ["Filler metal", "معدن الحشو"], ["Parameters", "المعايير"]] },
  { code: "PQR", en: "Procedure Qualification Record", ar: "سجل تأهيل الإجراء", fields: [["Test coupon", "عينة الاختبار"], ["Recorded values", "القيم المسجلة"], ["Test results", "نتائج الاختبار"], ["Supported WPS", "WPS المدعومة"]] },
  { code: "WPQ", en: "Welder Performance Qualification", ar: "تأهيل أداء اللحّام", fields: [["Welder", "اللحّام"], ["Position", "الوضعية"], ["Range qualified", "نطاق التأهيل"], ["Validity", "الصلاحية"]] },
];

const codeHead: [string, string][] = [["Reference", "المرجع"], ["Typical scope", "النطاق المعتاد"], ["Qualifies", "ما يؤهّله"]];
const codeRows: [string, string][][] = [
  [["ASME BPVC Section IX", "ASME BPVC Section IX"], ["Pressure equipment and process piping", "معدات الضغط وأنابيب العمليات"], ["WPS / PQR / WPQ", "WPS / PQR / WPQ"]],
  [["AWS D1.1", "AWS D1.1"], ["Structural steel welding", "لحام الهياكل الفولاذية"], ["WPS / PQR / welder qualification", "WPS / PQR / تأهيل اللحّام"]],
  [["API 1104", "API 1104"], ["Pipeline and related facilities", "خطوط الأنابيب والمرافق المرتبطة"], ["Procedure / welder qualification", "تأهيل الإجراء / اللحّام"]],
  [["ISO 15614-1", "ISO 15614-1"], ["Arc welding procedure tests for steels and nickel alloys", "اختبارات إجراءات اللحام بالقوس للفولاذ وسبائك النيكل"], ["WPQR", "WPQR"]],
  [["ISO 9606-1", "ISO 9606-1"], ["Welder qualification — steels", "تأهيل اللحّامين — الفولاذ"], ["Welder certificate", "شهادة اللحّام"]],
];

function Page() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  const ar = locale === "ar";
  useLocalizedMeta({ title: "هندسة اللحام", description: "إعداد إجراءات اللحام ودعم تأهيل اللحّامين والإرشاد الفني في اللحام من Weld Yard." });
  return (
    <>
      <PageHero eyebrow={d.weldingEngineering} title={tr("Engineering support behind every joint", "دعم هندسي وراء كل وصلة")} intro={tr("Technical welding expertise that helps your team plan, qualify and execute welding work with confidence.", "خبرة فنية في اللحام تساعد فريقك على تخطيط أعمال اللحام وتأهيلها وتنفيذها بثقة.")} image={img}>
        <Link to="/contact" className={btnPrimary}>{tr("Talk to an Engineer", "تحدث إلى مهندس")}</Link>
      </PageHero>

      {/* Two pillars */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={tr("Services", "الخدمات")} title={tr("Two pillars of engineering support", "ركيزتان للدعم الهندسي")} />
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            {pillars.map((p) => (
              <article key={p.code} className="relative border bg-card p-8 sm:p-10">
                <span aria-hidden className="absolute inset-y-0 start-0 w-1 bg-primary" />
                <div className="flex items-baseline gap-4">
                  <span className="font-mono text-sm text-brand-ink">{tr("PILLAR", "الركيزة")} {p.code}</span>
                </div>
                <h3 className="mt-4 text-2xl font-extrabold sm:text-3xl">{ar ? p.titleAr : p.title}</h3>
                <ul className="mt-8 divide-y border-t">
                  {p.items.map(([en, a], i) => (
                    <li key={en} className="flex gap-4 py-4">
                      <span className="font-mono text-xs text-muted-foreground pt-1">{p.code}.{i + 1}</span>
                      <span className="font-semibold">{ar ? a : en}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Qualification workflow */}
      <section className="border-y bg-navy py-20 text-navy-foreground sm:py-24">
        <Container>
          <Eyebrow>{tr("Qualification workflow", "مسار التأهيل")}</Eyebrow>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold sm:text-4xl">{tr("From requirement to qualified production", "من المتطلب إلى إنتاج مؤهَّل")}</h2>
          <ol className="mt-12 grid gap-6 md:grid-cols-5">
            {workflow.map(([en, a], i) => (
              <li key={en} className="relative border-t-2 border-navy-border pt-5">
                <span aria-hidden className="absolute -top-[7px] start-0 h-3 w-3 bg-primary" />
                <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-2 font-bold">{ar ? a : en}</p>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Document previews */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={tr("Technical documents", "الوثائق الفنية")} title={tr("The records we help you prepare", "السجلات التي نساعدك في إعدادها")} intro={tr("Illustrative structure only — actual content follows your project's applicable code and specification.", "هيكل توضيحي فقط — يتبع المحتوى الفعلي الكود والمواصفات المعتمدة في مشروعك.")} />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {docs.map((doc) => (
              <figure key={doc.code} className="border bg-background shadow-sm">
                <div className="flex items-center justify-between border-b bg-card px-5 py-3">
                  <span className="flex items-center gap-2 font-mono text-sm font-bold"><FileText aria-hidden className="h-4 w-4 text-brand-ink" />{doc.code}</span>
                  <span className="font-mono text-[10px] uppercase text-muted-foreground">{tr("Template", "نموذج")}</span>
                </div>
                <div className="p-5">
                  <figcaption className="font-bold">{ar ? doc.ar : doc.en}</figcaption>
                  <dl className="mt-4 space-y-2">
                    {doc.fields.map(([en, a]) => (
                      <div key={en} className="flex items-center gap-3 text-sm">
                        <dt className="w-28 shrink-0 text-muted-foreground">{ar ? a : en}</dt>
                        <dd aria-hidden className="h-2 flex-1 bg-muted" />
                      </div>
                    ))}
                  </dl>
                </div>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow={tr("Code references", "المراجع والأكواد")} title={tr("Common qualification references", "مراجع التأهيل الشائعة")} intro={tr("General guidance only — the governing code is set by your project specification and client.", "إرشاد عام فقط — يحدد الكود المعتمد مواصفات مشروعك والعميل.")} />
          <div className="mt-10 overflow-x-auto border">
            <table className="w-full min-w-[640px] text-start text-sm">
              <thead className="bg-navy text-navy-foreground">
                <tr>{codeHead.map(([en, a]) => <th key={en} scope="col" className="px-4 py-3 text-start font-mono text-xs uppercase">{ar ? a : en}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {codeRows.map((r) => (
                  <tr key={r[0][0]} className="even:bg-card">
                    {r.map(([en, a], j) => <td key={j} className={j === 0 ? "px-4 py-3 font-mono font-bold" : "px-4 py-3"}>{ar ? a : en}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <CtaBand title={tr("Have a welding engineering requirement?", "لديك متطلب في هندسة اللحام؟")} body={tr("Share your scope and our team will discuss how we can support.", "شاركنا نطاق العمل وسيناقش فريقنا كيف يمكننا الدعم.")}>
        <Link to="/request-quote" className={btnDark}>{d.requestQuote}</Link>
        <Link to="/contact" className={btnDarkOutline}>{d.contactTeam}</Link>
      </CtaBand>
    </>
  );
}
