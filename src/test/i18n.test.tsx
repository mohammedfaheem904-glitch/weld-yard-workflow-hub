import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { LocaleProvider, LOCALE_STORAGE_KEY, useTr } from "@/lib/locale";
import { LanguageSwitcher } from "@/components/site/LanguageSwitcher";
import { DICTIONARY, t } from "@/lib/i18n";
import { inquirySchema } from "@/components/site/InquiryForm";
import { BUSINESS_AREAS, DWM_FEATURES, INDUSTRIES, JOURNEYS, LIFECYCLE, LIFECYCLE_AR, PRODUCT_CATEGORIES } from "@/lib/site";

function Probe() {
  const tr = useTr();
  return <p>{tr("Hello", "مرحبا")}</p>;
}

describe("Arabic locale", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.lang = "en";
    document.documentElement.dir = "ltr";
  });

  it("defaults to English LTR", () => {
    render(<LocaleProvider><Probe /></LocaleProvider>);
    expect(screen.getByText("Hello")).toBeTruthy();
    expect(document.documentElement.dir).toBe("ltr");
  });

  it("switching to Arabic sets lang=ar, dir=rtl and persists", () => {
    render(<LocaleProvider><LanguageSwitcher /><Probe /></LocaleProvider>);
    fireEvent.click(screen.getByRole("button", { name: "التبديل إلى العربية" }));
    expect(screen.getByText("مرحبا")).toBeTruthy();
    expect(document.documentElement.lang).toBe("ar");
    expect(document.documentElement.dir).toBe("rtl");
    expect(localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("ar");
  });

  it("restores the saved locale on load", () => {
    localStorage.setItem(LOCALE_STORAGE_KEY, "ar");
    render(<LocaleProvider><Probe /></LocaleProvider>);
    expect(screen.getByText("مرحبا")).toBeTruthy();
  });

  it("Arabic dictionary has a value for every English key", () => {
    const walk = (en: Record<string, unknown>, ar: Record<string, unknown>) => {
      for (const k of Object.keys(en)) {
        expect(ar[k], k).toBeTruthy();
        if (typeof en[k] === "object") walk(en[k] as never, ar[k] as never);
      }
    };
    walk(DICTIONARY.en as never, DICTIONARY.ar as never);
  });

  it("every content item has an Arabic translation", () => {
    for (const i of [...BUSINESS_AREAS, ...DWM_FEATURES, ...INDUSTRIES, ...PRODUCT_CATEGORIES, ...JOURNEYS]) expect(i.ar).toBeTruthy();
    for (const j of JOURNEYS) for (const a of j.actions) expect(a.labelAr).toBeTruthy();
    expect(LIFECYCLE_AR.length).toBe(LIFECYCLE.length);
  });

  it("form validation messages follow the language", () => {
    const r = inquirySchema(t("ar").form).safeParse({ name: "", email: "x", message: "" });
    expect(r.success).toBe(false);
    const msgs = r.success ? [] : r.error.issues.map((i) => i.message);
    expect(msgs).toContain("يرجى إدخال اسمك");
    expect(msgs).toContain("يرجى إدخال بريد إلكتروني صحيح");
  });
});
