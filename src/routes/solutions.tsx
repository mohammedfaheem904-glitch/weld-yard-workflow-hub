import { createFileRoute, Link } from "@tanstack/react-router";
import { BUSINESS_AREAS } from "@/lib/site";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { loc, useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { btnDark, btnDarkOutline, Container, CtaBand, Eyebrow, PageHero, SectionHeading, TextLink } from "@/components/site/blocks";

export const Route = createFileRoute("/solutions")({
  head: () => seo("Solutions", "Weld Yard solutions: welding products, welding engineering, QA/QC & inspection, and digital welding management.", "/solutions"),
  component: Solutions,
});

// Which project phases each business area supports (index into phases).
const phases = [
  ["Material selection", "اختيار المواد"],
  ["Welding execution", "تنفيذ اللحام"],
  ["Inspection", "الفحص"],
  ["Documentation & handover", "التوثيق والتسليم"],
];
const coverage: Record<string, number[]> = {
  "01": [0, 1],
  "02": [0, 1],
  "03": [1, 2, 3],
  "04": [1, 2, 3],
};

function Solutions() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  const ar = locale === "ar";
  useLocalizedMeta({ title: "الحلول", description: "حلول Weld Yard: منتجات اللحام، هندسة اللحام، ضمان/مراقبة الجودة (QA/QC) والفحص، والإدارة الرقمية للحام." });
  return (
    <>
      <PageHero eyebrow={tr("Solutions", "الحلول")} title={tr("One partner across the welding lifecycle", "شريك واحد عبر دورة حياة اللحام")} intro={tr("Products. Engineering. Inspection. Digital Welding Management. Use one service or combine them for a connected approach.", "المنتجات. الهندسة. الفحص. الإدارة الرقمية للحام. استخدم خدمة واحدة أو اجمع بينها لنهج مترابط.")} />

      {/* Ecosystem */}
      <section className="py-20 sm:py-28">
        <Container>
          <SectionHeading eyebrow={tr("Solution ecosystem", "منظومة الحلول")} title={tr("Four capabilities, one connected approach", "أربع قدرات ونهج واحد مترابط")} />
          <div className="relative mt-12 grid gap-px border bg-border md:grid-cols-2">
            {BUSINESS_AREAS.map((raw) => {
              const a = loc(raw, locale);
              return (
                <article key={a.n} className="group relative bg-background p-8 sm:p-10">
                  <span aria-hidden className="absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0 bg-primary transition-transform group-hover:scale-x-100 rtl:origin-right" />
                  <span className="font-mono text-sm text-brand-ink">{a.n}</span>
                  <h2 className="mt-5 text-2xl font-extrabold sm:text-3xl">{a.title}</h2>
                  <p className="mt-3 text-muted-foreground">{a.body}</p>
                  <div className="mt-8"><TextLink to={a.to}>{tr(`Explore ${a.title}`, `استكشف ${a.title}`)}</TextLink></div>
                </article>
              );
            })}
            <div aria-hidden className="pointer-events-none absolute start-1/2 top-1/2 hidden h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-navy font-mono text-xs font-bold text-primary md:flex rtl:translate-x-1/2">WY</div>
          </div>
        </Container>
      </section>

      {/* Coverage matrix */}
      <section className="border-y bg-navy py-20 text-navy-foreground">
        <Container>
          <Eyebrow>{tr("How it connects", "كيف تترابط")}</Eyebrow>
          <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">{tr("From material to handover", "من المواد حتى التسليم")}</h2>
          <div className="mt-12 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-start text-sm">
              <thead>
                <tr>
                  <th className="w-1/3 py-3 text-start font-mono text-xs font-normal text-navy-muted">{tr("Capability", "القدرة")}</th>
                  {phases.map(([en, a], i) => (
                    <th key={en} className="py-3 text-start font-bold">
                      <span className="block font-mono text-xs font-normal text-primary">{String(i + 1).padStart(2, "0")}</span>
                      {ar ? a : en}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BUSINESS_AREAS.map((raw) => {
                  const a = loc(raw, locale);
                  return (
                    <tr key={a.n} className="border-t border-navy-border">
                      <th scope="row" className="py-4 text-start font-semibold">{a.title}</th>
                      {phases.map(([en], i) => (
                        <td key={en} className="py-4">
                          {coverage[raw.n]?.includes(i) ? (
                            <span className="block h-2 w-full max-w-24 bg-primary" aria-label={tr("Supports", "يدعم")} />
                          ) : (
                            <span className="block h-px w-full max-w-24 bg-navy-border" aria-hidden />
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Container>
      </section>

      <CtaBand title={tr("Not sure where to start?", "لست متأكداً من أين تبدأ؟")} body={tr("Describe your requirement and we'll point you to the right solution.", "صِف متطلباتك وسنرشدك إلى الحل المناسب.")}>
        <Link to="/contact" className={btnDark}>{d.contactTeam}</Link>
        <Link to="/request-quote" className={btnDarkOutline}>{d.requestQuote}</Link>
      </CtaBand>
    </>
  );
}
