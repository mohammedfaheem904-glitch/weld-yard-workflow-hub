import { useState } from "react";
import { LOGO_IMAGE_URL, safeUrl } from "@/lib/site";
import { useLocale } from "@/lib/locale";
import { t } from "@/lib/i18n";

// Official horizontal logo (emblem + wordmark + tagline in one file).
// Falls back to the WY monogram + text when no safe URL or the image fails.
export function Logo({ src = LOGO_IMAGE_URL }: { src?: string | null }) {
  const url = safeUrl(src);
  const [failed, setFailed] = useState(false);
  const showImage = url && !failed;
  const { locale } = useLocale();
  if (showImage) {
    return (
      <span className="flex items-center" data-testid="logo-official">
        <img
          src={url}
          alt="Weld Yard — Integrated Welding Solutions"
          width={800}
          height={241}
          className="h-10 w-auto object-contain sm:h-11"
          decoding="async"
          onError={() => setFailed(true)}
        />
      </span>
    );
  }
  return (
    <span className="flex items-center gap-2.5" data-testid="logo-fallback">
      <span aria-hidden className="grid h-9 w-9 place-items-center bg-primary font-display text-base font-black text-primary-foreground">
        WY
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-tight text-brand-wordmark">WELD YARD</span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground rtl:tracking-normal">{t(locale).logoSub}</span>
      </span>
    </span>
  );
}
