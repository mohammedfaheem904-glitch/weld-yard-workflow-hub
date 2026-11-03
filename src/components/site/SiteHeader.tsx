import { Link } from "@tanstack/react-router";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { NAV, STORE_URL } from "@/lib/site";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { Logo } from "./Logo";

/*
 * Full desktop nav appears at xl (1280px+). Between 1024–1279px the menu
 * collapses so links and actions never crowd. One language switcher per view.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const { locale } = useLocale();
  const d = t(locale);
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
      <span aria-hidden className="block h-0.5 bg-primary" />
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        {d.skip}
      </a>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6">
        <Link to="/" aria-label={d.homeLabel} onClick={() => setOpen(false)} className="shrink-0">
          <Logo />
        </Link>
        <nav aria-label={d.mainNav} className="hidden xl:block">
          <ul className="flex items-center gap-0.5">
            {NAV.map((n) => (
              <li key={n.key}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  className="relative block px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-foreground data-[status=active]:after:absolute data-[status=active]:after:inset-x-3 data-[status=active]:after:-bottom-[1.05rem] data-[status=active]:after:h-0.5 data-[status=active]:after:bg-primary"
                >
                  {d.nav[n.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden shrink-0 items-center gap-3 xl:flex">
          <LanguageSwitcher />
          <span aria-hidden className="h-6 w-px bg-border" />
          <Link to="/request-dwm-demo" className="border border-foreground/30 px-3.5 py-2 text-sm font-semibold transition-colors hover:border-primary hover:text-brand-ink">
            {d.requestDemo}
          </Link>
          <a href={STORE_URL} className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition-opacity hover:opacity-90">
            <ShoppingBag className="h-4 w-4" aria-hidden /> {d.visitStore}
          </a>
        </div>
        <div className="flex items-center gap-2 xl:hidden">
          <LanguageSwitcher />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center border"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={open ? d.closeMenu : d.openMenu}
            onClick={() => setOpen((o) => !o)}
          >
            {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label={d.mobileNav} className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto border-t bg-background xl:hidden">
          <div className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
            <ul className="flex flex-col py-2 lg:grid lg:grid-cols-4 lg:gap-x-6">
              {NAV.map((n) => (
                <li key={n.key}>
                  <Link
                    to={n.to}
                    activeOptions={{ exact: n.to === "/" }}
                    onClick={() => setOpen(false)}
                    className="block border-b py-3.5 font-semibold data-[status=active]:border-primary data-[status=active]:text-brand-ink"
                  >
                    {d.nav[n.key]}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-5 grid gap-2 sm:grid-cols-2">
              <a href={STORE_URL} className="inline-flex items-center justify-center gap-2 bg-primary px-4 py-3 font-bold text-primary-foreground">
                <ShoppingBag className="h-4 w-4" aria-hidden /> {d.visitStore}
              </a>
              <Link to="/request-dwm-demo" onClick={() => setOpen(false)} className="border border-foreground/30 px-4 py-3 text-center font-semibold">{d.requestDemo}</Link>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
