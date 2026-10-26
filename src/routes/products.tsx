import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import productsImg from "@/assets/products.jpg";
import { categoryHref, PRODUCT_CATEGORIES, STORE_URL } from "@/lib/site";
import { seo } from "@/lib/seo";
import { t } from "@/lib/i18n";
import { loc, useLocale, useLocalizedMeta, useTr } from "@/lib/locale";
import { btnDark, btnDarkOutline, btnOutline, btnPrimary, Checklist, Container, CtaBand, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/products")({
  head: () => seo("Welding Products", "Welding consumables, equipment, accessories and safety products from Weld Yard. Browse and order through the Weld Yard online store.", "/products"),
  component: Products,
});

function Products() {
  const { locale } = useLocale();
  const tr = useTr();
  const d = t(locale);
  useLocalizedMeta({ title: "منتجات اللحام", description: "مواد اللحام الاستهلاكية والمعدات والملحقات ومنتجات السلامة من Weld Yard. تصفّح واطلب عبر متجر Weld Yard الإلكتروني." });
  return (
    <>
      <PageHero eyebrow={d.weldingProducts} title={tr("The right products for every weld", "المنتجات المناسبة لكل لحام")} intro={tr("Weld Yard supplies welding consumables, equipment, accessories and safety products. Browse the full range and order through our online store.", "توفّر Weld Yard مواد اللحام الاستهلاكية والمعدات والملحقات ومنتجات السلامة. تصفّح المجموعة الكاملة واطلب عبر متجرنا الإلكتروني.")} image={productsImg}>
        <a href={STORE_URL} className={btnPrimary}>{d.browseProducts}</a>
        <Link to="/request-quote" className={btnOutline}>{d.requestQuote}</Link>
      </PageHero>
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow={tr("Product categories", "فئات المنتجات")} title={tr("What you'll find in the store", "ما ستجده في المتجر")} />
            <a href={STORE_URL} className={btnOutline}>{tr("View All Products", "عرض جميع المنتجات")}</a>
          </div>
          <ul className="mt-12 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_CATEGORIES.map((raw) => {
              const c = loc(raw, locale);
              return (
                <li key={raw.name} className="bg-background">
                  <a href={categoryHref(raw.url)} className="group flex h-full flex-col p-7 transition-colors hover:bg-accent">
                    <span className="flex items-start justify-between gap-4">
                      <h3 className="text-xl font-bold">{c.name}</h3>
                      <ArrowUpRight aria-hidden className="h-5 w-5 shrink-0 text-brand-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5" />
                    </span>
                    <p className="mt-3 text-sm text-muted-foreground">{c.body}</p>
                    <span className="mt-6 text-xs font-bold uppercase tracking-widest text-brand-ink rtl:tracking-normal">{d.browseProducts}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </Container>
      </section>
      <section className="border-t bg-card py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow={tr("Project supply", "توريد المشاريع")} title={tr("Buying for a project or a workshop?", "تشتري لمشروع أو ورشة؟")} intro={tr("For larger quantities, specific grades or recurring supply, send us a quote request and our team will follow up.", "للكميات الكبيرة أو الرتب المحددة أو التوريد المتكرر، أرسل لنا طلب عرض سعر وسيتابع فريقنا معك.")} />
          <div className="self-center">
            <Checklist items={tr([
              "Order standard items directly in the online store",
              "Request a quote for bulk or project quantities",
              "Combine product supply with engineering and inspection support",
            ], [
              "اطلب الأصناف القياسية مباشرة من المتجر الإلكتروني",
              "اطلب عرض سعر للكميات الكبيرة أو كميات المشاريع",
              "اجمع بين توريد المنتجات والدعم الهندسي ودعم الفحص",
            ])} />
          </div>
        </Container>
      </section>
      <CtaBand title={tr("Visit the Weld Yard Store", "زُر متجر Weld Yard")} body={tr("Browse products, check availability and order online at store.weldyard.com.", "تصفّح المنتجات وتحقق من التوفر واطلب عبر الإنترنت على store.weldyard.com.")}>
        <a href={STORE_URL} className={btnDark}>{d.visitStore}</a>
        <Link to="/request-quote" className={btnDarkOutline}>{d.requestQuote}</Link>
      </CtaBand>
    </>
  );
}
