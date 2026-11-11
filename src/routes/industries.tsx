import { createFileRoute, Link } from "@tanstack/react-router";
import oilGas from "@/assets/industry-oil-gas.jpg";
import power from "@/assets/industry-power.jpg";
import structural from "@/assets/industry-structural.jpg";
import marine from "@/assets/industry-marine.jpg";
import hero from "@/assets/hero-welding.jpg";
import engineering from "@/assets/engineering.jpg";
import inspection from "@/assets/inspection.jpg";
import products from "@/assets/products.jpg";
import heroImg from "@/assets/hero-industries.jpg";
import { INDUSTRIES } from "@/lib/site";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { loc, useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { btnDark, btnDarkOutline, Container, CtaBand, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/industries")({
  head: () => seo("Industries", "Weld Yard supports welding operations in oil & gas, petrochemical, power, structural steel, fabrication, marine and infrastructure.", "/industries"),
  component: Page,
});

type Svc = "P" | "E" | "Q" | "D";
const SVC: Record<Svc, [string, string]> = {
  P: ["Products", "المنتجات"],
  E: ["Engineering", "الهندسة"],
  Q: ["QA/QC", "QA/QC"],
  D: ["DWM", "DWM"],
};

// Indexed to INDUSTRIES order in src/lib/site.ts.
const details: { img: string; challenge: [string, string]; svc: Svc[] }[] = [
  { img: oilGas, challenge: ["Weld integrity and traceability on pressure-containing systems", "سلامة اللحام وتتبعه في الأنظمة الحاوية للضغط"], svc: ["P", "E", "Q", "D"] },
  { img: power, challenge: ["Qualified procedures for process plant and shutdown work", "إجراءات مؤهلة لأعمال المصانع والتوقف الدوري"], svc: ["P", "E", "Q"] },
  { img: hero, challenge: ["Consistent quality on pressure parts and maintenance welds", "جودة ثابتة في أجزاء الضغط ولحامات الصيانة"], svc: ["P", "E", "Q"] },
  { img: structural, challenge: ["Inspection and records across many structural connections", "الفحص والسجلات عبر وصلات إنشائية كثيرة"], svc: ["P", "Q", "D"] },
  { img: engineering, challenge: ["Dependable supply, procedures and quality records", "توريد موثوق وإجراءات وسجلات جودة"], svc: ["P", "E", "D"] },
  { img: marine, challenge: ["Welding quality in shipyard, repair and offshore work", "جودة اللحام في أحواض السفن والإصلاح والأعمال البحرية"], svc: ["P", "E", "Q"] },
  { img: inspection, challenge: ["Inspection of tank and pipeline welds", "فحص لحامات الخزانات وخطوط الأنابيب"], svc: ["P", "Q", "D"] },
  { img: products, challenge: ["Reliable consumables and repeatable weld quality", "مواد استهلاكية موثوقة وجودة لحام قابلة للتكرار"], svc: ["P", "E"] },
];

const refHead: [string, string][] = [["Sector", "القطاع"], ["Typical challenge", "التحدي المعتاد"], ["Commonly referenced", "المراجع الشائعة"]];
const refRows: [string, string][][] = [
  [["Oil & gas pipelines", "خطوط أنابيب النفط والغاز"], ["Field welds, traceability over long runs", "لحامات ميدانية وتتبع عبر مسافات طويلة"], ["API 1104", "API 1104"]],
  [["Process piping", "أنابيب العمليات"], ["Material grades, PWHT, NDT extent", "درجات المواد والمعالجة الحرارية ونطاق NDT"], ["ASME B31.3, ASME IX", "ASME B31.3، ASME IX"]],
  [["Power / boilers", "الطاقة / الغلايات"], ["Pressure parts and repair welds", "أجزاء الضغط ولحامات الإصلاح"], ["ASME Section I, ASME IX", "ASME Section I، ASME IX"]],
  [["Structural steel", "الهياكل الفولاذية"], ["High volume of connections to inspect", "عدد كبير من الوصلات للفحص"], ["AWS D1.1, EN 1090", "AWS D1.1، EN 1090"]],
  [["Storage tanks", "خزانات التخزين"], ["Shell and bottom weld inspection", "فحص لحامات الجدار والقاع"], ["API 650", "API 650"]],
];

function Page() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  const ar = locale === "ar";
  useLocalizedMeta({ title: "القطاعات", description: "تدعم Weld Yard عمليات اللحام في قطاعات النفط والغاز والبتروكيماويات والطاقة والهياكل الفولاذية والتصنيع والقطاع البحري والبنية التحتية." });
  return (
    <>
      <PageHero eyebrow={d.industries} title={tr("Welding solutions for demanding sectors", "حلول لحام للقطاعات ذات المتطلبات العالية")} intro={tr("Wherever weld quality, traceability and reliable supply matter, Weld Yard can support your team.", "أينما كانت جودة اللحام وإمكانية التتبع والتوريد الموثوق مهمة، يمكن لـ Weld Yard دعم فريقك.")} image={heroImg} fixedImage imagePosition="70% 60%" />
      <section className="py-20">
        <Container>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((raw, idx) => {
              const i = loc(raw, locale);
              const det = details[idx];
              return (
                <li key={raw.name} className="flex flex-col border bg-background">
                  <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                    {det && <img src={det.img} alt="" width={1024} height={768} loading="lazy" className="h-full w-full object-cover" />}
                    <span className="absolute start-0 top-0 bg-navy px-3 py-1.5 font-mono text-xs text-primary">{String(idx + 1).padStart(2, "0")}</span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h2 className="text-xl font-extrabold">{i.name}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">{i.body}</p>
                    {det && (
                      <>
                        <p className="mt-5 border-s-2 border-primary ps-3 text-sm font-semibold">
                          <span className="block font-mono text-[10px] uppercase text-muted-foreground">{tr("Key challenge", "التحدي الرئيسي")}</span>
                          {ar ? det.challenge[1] : det.challenge[0]}
                        </p>
                        <ul className="mt-auto flex flex-wrap gap-1.5 pt-5" aria-label={tr("Relevant services", "الخدمات ذات الصلة")}>
                          {det.svc.map((s) => (
                            <li key={s} className="bg-card px-2 py-1 font-mono text-[11px] font-bold">{ar ? SVC[s][1] : SVC[s][0]}</li>
                          ))}
                        </ul>
                      </>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
      <section className="py-20 sm:py-24">
        <Container>
          <SectionHeading eyebrow={tr("Sector references", "مراجع القطاعات")} title={tr("Sector challenges and common codes", "تحديات القطاعات والأكواد الشائعة")} intro={tr("Typical references only — the applicable codes are defined by each project and client.", "مراجع معتادة فقط — تحدد كل مشروع وعميل الأكواد المعتمدة.")} />
          <div className="mt-10 overflow-x-auto border">
            <table className="w-full min-w-[640px] text-start text-sm">
              <thead className="bg-navy text-navy-foreground">
                <tr>{refHead.map(([en, a]) => <th key={en} scope="col" className="px-4 py-3 text-start font-mono text-xs uppercase">{ar ? a : en}</th>)}</tr>
              </thead>
              <tbody className="divide-y">
                {refRows.map((r) => (
                  <tr key={r[0]?.[0]} className="even:bg-card">
                    {r.map(([en, a], j) => <td key={j} className={j === 0 ? "px-4 py-3 font-mono font-bold" : "px-4 py-3"}>{ar ? a : en}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <CtaBand title={tr("Working in a sector not listed?", "تعمل في قطاع غير مدرج؟")} body={tr("Tell us about your welding scope — we'll let you know how we can help.", "أخبرنا عن نطاق أعمال اللحام لديك — وسنوضح لك كيف يمكننا المساعدة.")}>
        <Link to="/contact" className={btnDark}>{d.contactTeam}</Link>
        <Link to="/solutions" className={btnDarkOutline}>{tr("Explore Solutions", "استكشف الحلول")}</Link>
      </CtaBand>
    </>
  );
}
