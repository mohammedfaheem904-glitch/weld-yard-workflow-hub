import { Link } from "@tanstack/react-router";
import { Menu, X, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { NAV, STORE_URL } from "@/lib/site";
import { t } from "@/lib/i18n";
import { Logo } from "./Logo";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const d = t();
  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:start-4 focus:top-4 focus:bg-primary focus:px-3 focus:py-2 focus:text-primary-foreground">
        Skip to content
      </a>
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" aria-label="Weld Yard home" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((n) => (
              <li key={n.key}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  className="px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground data-[status=active]:text-primary"
                >
                  {d.nav[n.key]}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/request-dwm-demo" className="border px-3.5 py-2 text-sm font-semibold transition-colors hover:border-primary hover:text-primary">
            {d.requestDemo}
          </Link>
          <a href={STORE_URL} className="inline-flex items-center gap-2 bg-primary px-4 py-2 text-sm font-bold text-primary-foreground shadow-glow transition-opacity hover:opacity-90">
            <ShoppingBag className="h-4 w-4" aria-hidden /> {d.visitStore}
          </a>
        </div>
        <button
          type="button"
          className="p-2 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t bg-background px-4 pb-6 lg:hidden">
          <ul className="flex flex-col py-2">
            {NAV.map((n) => (
              <li key={n.key}>
                <Link
                  to={n.to}
                  activeOptions={{ exact: n.to === "/" }}
                  onClick={() => setOpen(false)}
                  className="block border-b py-3 font-medium data-[status=active]:text-primary"
                >
                  {d.nav[n.key]}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 grid gap-2">
            <a href={STORE_URL} className="bg-primary px-4 py-3 text-center font-bold text-primary-foreground">{d.visitStore}</a>
            <Link to="/request-dwm-demo" onClick={() => setOpen(false)} className="border px-4 py-3 text-center font-semibold">{d.requestDemo}</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
