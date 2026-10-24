import { Link } from "@tanstack/react-router";
import { CONTACT, DWM_URL, STORE_URL, SUPPORTING } from "@/lib/site";
import { Logo } from "./Logo";

const cols = [
  {
    title: "Solutions",
    links: [
      { label: "Welding Products", to: "/products" },
      { label: "Welding Engineering", to: "/welding-engineering" },
      { label: "QA/QC & Inspection", to: "/qa-qc-inspection" },
      { label: "Weld Yard DWM", to: "/dwm" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Weld Yard", to: "/about" },
      { label: "Industries", to: "/industries" },
      { label: "Contact", to: "/contact" },
      { label: "Request a Quote", to: "/request-quote" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-5 max-w-sm text-sm text-muted-foreground">{SUPPORTING}</p>
          {(CONTACT.email || CONTACT.phone || CONTACT.address) && (
            <ul className="mt-5 space-y-1.5 text-sm text-muted-foreground">
              {CONTACT.address && <li>{CONTACT.address}</li>}
              {CONTACT.phone && <li><a href={`tel:${CONTACT.phone}`} className="hover:text-foreground">{CONTACT.phone}</a></li>}
              {CONTACT.email && <li><a href={`mailto:${CONTACT.email}`} className="hover:text-foreground">{CONTACT.email}</a></li>}
            </ul>
          )}
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-primary">{c.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground hover:text-foreground">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Weld Yard. All rights reserved.{CONTACT.registration ? ` ${CONTACT.registration}` : ""}</p>
          <p className="flex gap-5">
            <a href={STORE_URL} className="hover:text-primary">store.weldyard.com</a>
            <a href={DWM_URL} className="hover:text-primary">dwm.weldyard.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
