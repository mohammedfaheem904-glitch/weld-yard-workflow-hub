import { createFileRoute, Link } from "@tanstack/react-router";
import { INDUSTRIES } from "@/lib/site";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { loc, useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { btnDark, btnDarkOutline, Container, CtaBand, PageHero } from "@/components/site/blocks";

export const Route = createFileRoute("/industries")({
  head: () => seo("Industries", "Weld Yard supports welding operations in oil & gas, petrochemical, power, structural steel, fabrication, marine and infrastructure.", "/industries"),
  component: Page,
});

function Page() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  useLocalizedMeta({ title: "القطاعات", description: "تدعم Weld Yard عمليات اللحام في قطاعات النفط والغاز والبتروكيماويات والطاقة والهياكل الفولاذية والتصنيع والقطاع البحري والبنية التحتية." });
  return (
    <>
      <PageHero eyebrow={d.industries} title={tr("Welding solutions for demanding sectors", "حلول لحام للقطاعات ذات المتطلبات العالية")} intro={tr("Wherever weld quality, traceability and reliable supply matter, Weld Yard can support your team.", "أينما كانت جودة اللحام وإمكانية التتبع والتوريد الموثوق مهمة، يمكن لـ Weld Yard دعم فريقك.")} />
      <section className="py-20">
        <Container>
          <ul className="grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRIES.map((raw, idx) => {
              const i = loc(raw, locale);
              return (
                <li key={raw.name} className="bg-background p-7">
                  <span className="font-mono text-xs text-brand-ink">{String(idx + 1).padStart(2, "0")}</span>
                  <h2 className="mt-8 text-xl font-extrabold">{i.name}</h2>
                  <p className="mt-3 text-sm text-muted-foreground">{i.body}</p>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
      <CtaBand title={tr("Working in a sector not listed?", "تعمل في قطاع غير مدرج؟")} body={tr("Tell us about your welding scope — we'll let you know how we can help.", "أخبرنا عن نطاق أعمال اللحام لديك — وسنوضح لك كيف يمكننا المساعدة.")}>
        <Link to="/contact" className={btnDark}>{d.contactTeam}</Link>
        <Link to="/solutions" className={btnDarkOutline}>{tr("Explore Solutions", "استكشف الحلول")}</Link>
      </CtaBand>
    </>
  );
}
