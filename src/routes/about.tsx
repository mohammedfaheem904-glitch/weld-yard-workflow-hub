import { createFileRoute, Link } from "@tanstack/react-router";
import hero from "@/assets/hero-welding.jpg";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { btnDark, btnDarkOutline, Container, CtaBand, FeatureGrid, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/about")({
  head: () => seo("About Weld Yard", "Weld Yard is an integrated welding solutions company connecting products, engineering, inspection and digital welding management.", "/about"),
  component: Page,
});

const values = [
  { title: "Integrated", body: "We connect stages of welding work that are usually handled by separate suppliers." },
  { title: "Practical", body: "Our focus is on what helps teams on the shop floor and on site." },
  { title: "Quality-minded", body: "Traceable records and clear documentation are part of everything we do." },
];
const valuesAr = [
  { title: "متكاملون", body: "نربط بين مراحل أعمال اللحام التي يتولاها عادةً موردون منفصلون." },
  { title: "عمليون", body: "نركز على ما يساعد الفرق في الورشة وفي الموقع." },
  { title: "نهتم بالجودة", body: "السجلات القابلة للتتبع والتوثيق الواضح جزء من كل ما نقوم به." },
];

function Page() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  useLocalizedMeta({ title: "عن Weld Yard", description: "Weld Yard شركة حلول لحام متكاملة تربط بين المنتجات والهندسة والفحص والإدارة الرقمية للحام." });
  return (
    <>
      <PageHero eyebrow={d.aboutWeldYard} title={tr("Integrated Welding Solutions", "حلول لحام متكاملة")} intro={tr("Weld Yard brings welding products, engineering, QA/QC inspection and digital welding management together under one company.", "تجمع Weld Yard بين منتجات اللحام والهندسة وفحص ضمان/مراقبة الجودة (QA/QC) والإدارة الرقمية للحام تحت مظلة شركة واحدة.")} image={hero} />
      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow={tr("Our approach", "نهجنا")} title={tr("Connecting the essential stages of welding", "ربط المراحل الأساسية للّحام")} />
          <div className="space-y-5 text-lg text-muted-foreground">
            <p>{tr("Welding projects depend on many moving parts: the right materials, qualified procedures and welders, careful inspection and complete quality records.", "تعتمد مشاريع اللحام على عناصر عديدة: المواد المناسبة، والإجراءات واللحّامون المؤهلون، والفحص الدقيق، وسجلات الجودة الكاملة.")}</p>
            <p>{tr("Weld Yard was set up to support these stages in a connected way — supplying products through our online store, providing engineering and inspection support, and offering Weld Yard DWM to manage welding data digitally.", "تأسست Weld Yard لدعم هذه المراحل بطريقة مترابطة — من خلال توريد المنتجات عبر متجرنا الإلكتروني، وتقديم الدعم الهندسي ودعم الفحص، وتوفير Weld Yard DWM لإدارة بيانات اللحام رقمياً.")}</p>
          </div>
        </Container>
      </section>
      <section className="border-t bg-card py-20">
        <Container>
          <SectionHeading eyebrow={tr("What guides us", "ما يوجّهنا")} title={tr("Our principles", "مبادئنا")} />
          <div className="mt-12"><FeatureGrid items={tr(values, valuesAr)} /></div>
        </Container>
      </section>
      <CtaBand title={tr("Work with Weld Yard", "اعمل مع Weld Yard")} body={tr("Let's discuss how we can support your welding operations.", "لنناقش كيف يمكننا دعم عمليات اللحام لديكم.")}>
        <Link to="/contact" className={btnDark}>{d.contactTeam}</Link>
        <Link to="/solutions" className={btnDarkOutline}>{tr("Our Solutions", "حلولنا")}</Link>
      </CtaBand>
    </>
  );
}
