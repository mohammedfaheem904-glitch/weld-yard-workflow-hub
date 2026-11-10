import { Link } from "@tanstack/react-router";
import { CONTACT, DWM_URL, STORE_URL } from "@/lib/site";
import { t } from "@/lib/i18n";
import { useLocale } from "@/lib/locale";
import { Logo } from "./Logo";
import { NewsletterSignup } from "./NewsletterSignup";
import { SocialLinks } from "./SocialLinks";

export function SiteFooter() {
  const { locale } = useLocale();
  const d = t(locale);
  const cols = [
    {
      title: d.footerSolutions,
      links: [
        { label: d.weldingProducts, to: "/products" },
        { label: d.weldingEngineering, to: "/welding-engineering" },
        { label: d.qaqc, to: "/qa-qc-inspection" },
        { label: d.weldYardDwm, to: "/dwm" },
      ],
    },
    {
      title: d.footerCompany,
      links: [
        { label: d.aboutWeldYard, to: "/about" },
        { label: d.industries, to: "/industries" },
        { label: d.contact, to: "/contact" },
        { label: d.requestQuote, to: "/request-quote" },
      ],
    },
  ];
  return (
    <footer className="border-t-2 border-primary bg-background text-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="inline-block"><Logo /></div>
          <p className="mt-5 max-w-sm text-sm text-muted-foreground">{d.supporting}</p>
          {(CONTACT.email || CONTACT.phone || CONTACT.address) && (
            <ul className="mt-5 space-y-1.5 text-sm text-muted-foreground">
              {CONTACT.address && <li>{CONTACT.address}</li>}
              {CONTACT.phone && <li><a dir="ltr" href={`tel:${CONTACT.phone}`} className="hover:text-primary">{CONTACT.phone}</a></li>}
              {CONTACT.email && <li><a dir="ltr" href={`mailto:${CONTACT.email}`} className="hover:text-primary">{CONTACT.email}</a></li>}
            </ul>
          )}
        </div>
        {cols.map((c) => (
          <div key={c.title}>
            <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-navy rtl:tracking-normal">{c.title}</h2>
            <ul className="mt-4 space-y-2.5 text-sm">
              {c.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-muted-foreground hover:text-primary">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] md:items-end">
          <NewsletterSignup />
          <div>
            <h2 className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-navy rtl:tracking-normal">{d.followUs}</h2>
            <SocialLinks />
          </div>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© {new Date().getFullYear()} Weld Yard. {d.rights}{CONTACT.registration ? ` ${CONTACT.registration}` : ""}</p>
          <p className="flex gap-5" dir="ltr">
            <a href={STORE_URL} className="hover:text-primary">store.weldyard.com</a>
            <a href={DWM_URL} className="hover:text-primary">dwm.weldyard.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
