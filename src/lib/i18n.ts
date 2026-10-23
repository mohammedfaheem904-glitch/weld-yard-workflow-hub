// Localization foundation. English ships now; Arabic strings are placeholders
// to be reviewed by a native speaker before an Arabic version goes live.
import type { NavKey } from "./site";

export type Locale = "en" | "ar";
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALES: Record<Locale, { label: string; dir: "ltr" | "rtl" }> = {
  en: { label: "English", dir: "ltr" },
  ar: { label: "العربية", dir: "rtl" },
};

type Dict = {
  nav: Record<NavKey, string>;
  visitStore: string;
  requestDemo: string;
  requestQuote: string;
};

export const DICTIONARY: Record<Locale, Dict> = {
  en: {
    nav: {
      home: "Home",
      solutions: "Solutions",
      products: "Products",
      dwm: "DWM",
      industries: "Industries",
      about: "About",
      contact: "Contact",
    },
    visitStore: "Visit Store",
    requestDemo: "Request DWM Demo",
    requestQuote: "Request a Quote",
  },
  ar: {
    nav: {
      home: "الرئيسية",
      solutions: "الحلول",
      products: "المنتجات",
      dwm: "DWM",
      industries: "القطاعات",
      about: "من نحن",
      contact: "تواصل معنا",
    },
    visitStore: "زيارة المتجر",
    requestDemo: "اطلب عرضاً لـ DWM",
    requestQuote: "اطلب عرض سعر",
  },
};

export function t(locale: Locale = DEFAULT_LOCALE) {
  return DICTIONARY[locale];
}
