import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, setLocale } = useLocale();
  const d = t(locale);
  const item = "min-h-9 min-w-9 px-2.5 py-1.5 text-sm font-semibold transition-colors";
  return (
    <div role="group" aria-label={d.langGroup} className={cn("inline-flex items-center border", className)}>
      <button
        type="button"
        lang="en"
        aria-pressed={locale === "en"}
        aria-label={d.switchToEn}
        onClick={() => setLocale("en")}
        className={cn(item, locale === "en" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
      >
        EN
      </button>
      <button
        type="button"
        lang="ar"
        aria-pressed={locale === "ar"}
        aria-label={d.switchToAr}
        onClick={() => setLocale("ar")}
        className={cn(item, "font-arabic", locale === "ar" ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground")}
      >
        العربية
      </button>
    </div>
  );
}
