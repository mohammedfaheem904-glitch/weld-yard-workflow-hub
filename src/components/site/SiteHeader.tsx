import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, X, ShoppingBag, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { categoryHref, NAV, PRODUCT_CATEGORIES, STORE_URL, type NavKey } from "@/lib/site";
import { t } from "@/lib/i18n";
import { loc, useLocale } from "@/lib/locale";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

type SubItem = { label: string; to?: string; href?: string };

const PRODUCT_ORDER = [
  "Welding Machines & Equipment",
  "Welding Consumables",
  "Torches & Accessories",
  "Workshop Essentials",
  "Inspection Tools",
  "Safety & PPE",
];

function useSubmenus(locale: "en" | "ar"): Partial<Record<NavKey, SubItem[]>> {
  const d = t(locale);
  return {
    solutions: [
      { label: d.weldingProducts, to: "/products" },
      { label: d.weldingEngineering, to: "/welding-engineering" },
      { label: d.qaqc, to: "/qa-qc-inspection" },
      { label: d.weldYardDwm, to: "/dwm" },
    ],
    products: PRODUCT_ORDER.flatMap((name) => {
      const raw = PRODUCT_CATEGORIES.find((c) => c.name === name);
      return raw ? [{ label: loc(raw, locale).name, href: categoryHref(raw.url) }] : [];
    }),
  };
}

const itemCls =
  "relative block px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors before:absolute before:inset-y-2 before:start-0 before:w-0.5 before:bg-primary before:opacity-0 before:transition-opacity hover:bg-card hover:text-foreground hover:before:opacity-100 focus-visible:bg-card focus-visible:text-foreground focus-visible:outline-none focus-visible:before:opacity-100";

function SubLink({ item, onClick, className = itemCls }: { item: SubItem; onClick?: () => void; className?: string }) {
  if (item.to) return <Link to={item.to} onClick={onClick} className={className}>{item.label}</Link>;
  return <a href={item.href} onClick={onClick} className={className}>{item.label}</a>;
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState<NavKey | null>(null);
  const [mobileSub, setMobileSub] = useState<NavKey | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const { locale } = useLocale();
  const d = t(locale);
  const subs = useSubmenus(locale);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isHome = pathname === "/";

  useEffect(() => { setMenu(null); }, [pathname]);
  useEffect(() => {
    if (!menu) return;
    const onDown = (e: PointerEvent) => { if (!navRef.current?.contains(e.target as Node)) setMenu(null); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        const k = menu; setMenu(null);
        navRef.current?.querySelector<HTMLButtonElement>(`[data-trigger="${k}"]`)?.focus();
      }
    };
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("pointerdown", onDown); document.removeEventListener("keydown", onKey); };
  }, [menu]);

  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setMenu(null), 150); };
  const closeMobile = () => { setOpen(false); setMobileSub(null); };

  const linkCls = "relative flex items-center gap-1 px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:after:absolute data-[status=active]:after:inset-x-3 data-[status=active]:after:-bottom-[1.05rem] data-[status=active]:after:h-0.5 data-[status=active]:after:bg-primary";

  return (
    <header className={`sticky top-0 z-50 backdrop-blur ${isHome ? "border-b border-foreground/10 bg-background/55" : "border-b bg-background/95"}`}>
      <span aria-hidden className="block h-0.5 bg-primary" />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        {d.skip}
      </a>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link to="/" aria-label={d.homeLabel} onClick={closeMobile} className="shrink-0">
          <Logo />
        </Link>
        <nav ref={navRef} aria-label={d.mainNav} className="hidden min-[1360px]:block">
          <ul className="flex items-center gap-0.5">
            {NAV.map((n) => {
              const items = subs[n.key];
              if (!items) {
                return (
                  <li key={n.key}>
                    <Link to={n.to} activeOptions={{ exact: n.to === "/" }} className={linkCls}>{d.nav[n.key]}</Link>
                  </li>
                );
              }
              const isOpen = menu === n.key;
              const active = pathname.startsWith(n.to);
              return (
                <li key={n.key} className="relative" onMouseEnter={() => { cancelClose(); setMenu(n.key); }} onMouseLeave={scheduleClose}>
                  <button
                    type="button"
                    data-trigger={n.key}
                    data-status={active ? "active" : undefined}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    aria-controls={`submenu-${n.key}`}
                    onClick={() => setMenu(isOpen ? null : n.key)}
                    className={linkCls}
                  >
                    {d.nav[n.key]}
                    <ChevronDown aria-hidden className={`h-3.5 w-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  <div
                    id={`submenu-${n.key}`}
                    className={`absolute start-0 top-full pt-3 transition-all duration-150 ${isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-1 opacity-0"}`}
                  >
                    <ul className="min-w-64 border border-t-2 border-t-primary bg-background py-2 shadow-lg">
                      <li>
                        <Link to={n.to} onClick={() => setMenu(null)} className={`${itemCls} font-semibold text-foreground`}>
                          {locale === "ar" ? `كل ${d.nav[n.key]}` : `All ${d.nav[n.key]}`}
                        </Link>
                      </li>
                      <li aria-hidden className="mx-4 my-1 border-t" />
                      {items.map((it) => (
                        <li key={it.label}><SubLink item={it} onClick={() => setMenu(null)} /></li>
                      ))}
                    </ul>
                  </div>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="hidden shrink-0 items-center gap-3 min-[1360px]:flex">
          <LanguageSwitcher />
          <span aria-hidden className="h-6 w-px bg-border" />
          <Link to="/request-dwm-demo" className="border border-foreground/30 px-3.5 py-2 text-sm font-semibold transition-colors hover:border-primary hover:text-brand-ink">
            {d.requestDemo}
          </Link>
          <a href={STORE_URL} className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90">
            <ShoppingBag className="h-4 w-4" aria-hidden /> {d.visitStore}
          </a>
        </div>
        <div className="flex items-center gap-2 min-[1360px]:hidden">
          <LanguageSwitcher className="hidden sm:inline-flex" />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? d.closeMenu : d.openMenu}
            onClick={() => (open ? closeMobile() : setOpen(true))}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label={d.mobileNav} className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t bg-background min-[1360px]:hidden">
          <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
            <ul className="flex flex-col py-2 lg:grid lg:grid-cols-4 lg:gap-x-6">
              {NAV.map((n) => {
                const items = subs[n.key];
                const expanded = mobileSub === n.key;
                return (
                  <li key={n.key} className={items && expanded ? "lg:col-span-4" : undefined}>
                    <div className="flex items-stretch border-b">
                      <Link
                        to={n.to}
                        activeOptions={{ exact: n.to === "/" }}
                        onClick={closeMobile}
                        className="block flex-1 py-3.5 font-semibold data-[status=active]:text-brand-ink"
                      >
                        {d.nav[n.key]}
                      </Link>
                      {items && (
                        <button
                          type="button"
                          aria-expanded={expanded}
                          aria-controls={`m-submenu-${n.key}`}
                          aria-label={d.nav[n.key]}
                          onClick={() => setMobileSub(expanded ? null : n.key)}
                          className="flex w-11 items-center justify-center text-muted-foreground"
                        >
                          <ChevronDown aria-hidden className={`h-4 w-4 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} />
                        </button>
                      )}
                    </div>
                    {items && expanded && (
                      <ul id={`m-submenu-${n.key}`} className="border-s-2 border-primary py-1 ms-1">
                        {items.map((it) => (
                          <li key={it.label}>
                            <SubLink item={it} onClick={closeMobile} className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground" />
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
            <LanguageSwitcher className="mt-5 sm:hidden" />
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <a href={STORE_URL} className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-bold text-primary-foreground">
                <ShoppingBag className="h-4 w-4" aria-hidden /> {d.visitStore}
              </a>
              <Link to="/request-dwm-demo" onClick={closeMobile} className="border border-foreground/30 px-4 py-3 text-center font-semibold">{d.requestDemo}</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
