import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./i18n";

// Client-side locale state. URLs stay identical in both languages; the choice
// is persisted in localStorage and applied to <html lang dir>.
export const LOCALE_STORAGE_KEY = "weldyard-locale";

type Ctx = { locale: Locale; setLocale: (l: Locale) => void };
const LocaleContext = createContext<Ctx>({ locale: DEFAULT_LOCALE, setLocale: () => {} });

function applyDocument(l: Locale) {
  const el = document.documentElement;
  el.lang = l;
  el.dir = LOCALES[l].dir;
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
    } catch {
      /* storage unavailable */
    }
    if (stored === "ar" || stored === "en") setLocaleState(stored);
  }, []);

  useEffect(() => {
    applyDocument(locale);
  }, [locale]);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      window.localStorage.setItem(LOCALE_STORAGE_KEY, l);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return <LocaleContext.Provider value={{ locale, setLocale }}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  return useContext(LocaleContext);
}

/** Returns a picker: tr("English", "العربية"). */
export function useTr() {
  const { locale } = useLocale();
  return useCallback(<T,>(en: T, ar: T): T => (locale === "ar" ? ar : en), [locale]);
}

/** Pick localized fields from a data item that carries an `ar` override. */
export function loc<T extends object>(item: T & { ar?: Partial<T> }, locale: Locale): T {
  return locale === "ar" && item.ar ? { ...item, ...item.ar } : item;
}

/**
 * Updates title/description in the browser when Arabic is active. Server HTML
 * and crawler-facing metadata stay English (no separate Arabic URLs exist).
 */
export function useLocalizedMeta(ar: { title: string; description: string }) {
  const { locale } = useLocale();
  useEffect(() => {
    const desc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevTitle = document.title;
    const prevDesc = desc?.content ?? "";
    if (locale !== "ar") return;
    document.title = `${ar.title} | ويلد يارد Weld Yard`;
    if (desc) desc.content = ar.description;
    return () => {
      document.title = prevTitle;
      if (desc) desc.content = prevDesc;
    };
  }, [locale, ar.title, ar.description]);
}
