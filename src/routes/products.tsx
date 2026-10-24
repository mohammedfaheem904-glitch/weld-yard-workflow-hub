import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import productsImg from "@/assets/products.jpg";
import { PRODUCT_CATEGORIES, STORE_URL } from "@/lib/site";
import { seo } from "@/lib/seo";
import { btnDark, btnDarkOutline, btnOutline, btnPrimary, Checklist, Container, CtaBand, PageHero, SectionHeading } from "@/components/site/blocks";

export const Route = createFileRoute("/products")({
  head: () => seo("Welding Products", "Welding consumables, equipment, accessories and safety products from Weld Yard. Browse and order through the Weld Yard online store.", "/products"),
  component: Products,
});

function Products() {
  return (
    <>
      <PageHero eyebrow="Welding Products" title="The right products for every weld" intro="Weld Yard supplies welding consumables, equipment, accessories and safety products. Browse the full range and order through our online store." image={productsImg}>
        <a href={STORE_URL} className={btnPrimary}>Shop Now</a>
        <Link to="/request-quote" className={btnOutline}>Request a Quote</Link>
      </PageHero>
      <section className="py-20 sm:py-28">
        <Container>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeading eyebrow="Product categories" title="What you'll find in the store" />
            <a href={STORE_URL} className={btnOutline}>View All Products</a>
          </div>
          <ul className="mt-12 grid gap-px border bg-border sm:grid-cols-2 lg:grid-cols-3">
            {PRODUCT_CATEGORIES.map((c) => (
              <li key={c.name} className="bg-background">
                <a href={STORE_URL} className="group flex h-full flex-col p-7 transition-colors hover:bg-accent">
                  <span className="flex items-start justify-between gap-4">
                    <h3 className="text-xl font-bold">{c.name}</h3>
                    <ArrowUpRight aria-hidden className="h-5 w-5 shrink-0 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </span>
                  <p className="mt-3 text-sm text-muted-foreground">{c.body}</p>
                  <span className="mt-6 text-xs font-bold uppercase tracking-widest text-primary">Browse Products</span>
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>
      <section className="border-t bg-card py-20">
        <Container className="grid gap-12 lg:grid-cols-2">
          <SectionHeading eyebrow="Project supply" title="Buying for a project or a workshop?" intro="For larger quantities, specific grades or recurring supply, send us a quote request and our team will follow up." />
          <div className="self-center">
            <Checklist items={[
              "Order standard items directly in the online store",
              "Request a quote for bulk or project quantities",
              "Combine product supply with engineering and inspection support",
            ]} />
          </div>
        </Container>
      </section>
      <CtaBand title="Visit the Weld Yard Store" body="Browse products, check availability and order online at store.weldyard.com.">
        <a href={STORE_URL} className={btnDark}>Visit Store</a>
        <Link to="/request-quote" className={btnDarkOutline}>Request a Quote</Link>
      </CtaBand>
    </>
  );
}
