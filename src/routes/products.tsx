import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, Cable, HardHat, Ruler, ShoppingBag, Wrench, Zap, Flame } from "lucide-react";
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

const icons = [Flame, Zap, Cable, HardHat, Ruler, Wrench];

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
          <div className="mt-12 grid gap-6 lg:grid-cols-12">
            <figure className="relative overflow-hidden bg-navy lg:col-span-4 lg:row-span-2">
              <img src={productsImg} alt={tr("Welding products and consumables", "منتجات ومواد اللحام")} width={1280} height={896} loading="lazy" className="h-64 w-full object-cover opacity-80 lg:h-full" />
              <figcaption className="absolute inset-x-0 bottom-0 bg-navy/90 p-6 text-navy-foreground">
                <ShoppingBag aria-hidden className="h-5 w-5 text-primary" />
                <p className="mt-3 font-bold">store.weldyard.com</p>
                <p className="mt-1 text-sm text-navy-muted">{tr("Browse, check availability and order online.", "تصفّح وتحقق من التوفر واطلب عبر الإنترنت.")}</p>
              </figcaption>
            </figure>
            <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
              {PRODUCT_CATEGORIES.map((raw, i) => {
                const c = loc(raw, locale);
                const Icon = icons[i % icons.length];
                return (
                  <li key={raw.name}>
                    <a href={categoryHref(raw.url)} className="group relative flex h-full flex-col border bg-background p-6 transition-colors hover:border-primary">
                      <span className="flex items-start justify-between gap-4">
                        <span className="flex h-10 w-10 items-center justify-center bg-card text-brand-ink"><Icon aria-hidden className="h-5 w-5" /></span>
                        <ArrowUpRight aria-hidden className="h-5 w-5 shrink-0 text-muted-foreground transition-colors group-hover:text-brand-ink rtl:-scale-x-100" />
                      </span>
                      <h3 className="mt-5 text-lg font-bold">{c.name}</h3>
                      <p className="mt-2 text-sm text-muted-foreground">{c.body}</p>
                      <span className="mt-auto pt-5 text-xs font-bold uppercase tracking-widest text-brand-ink rtl:tracking-normal">{d.browseProducts}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
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
