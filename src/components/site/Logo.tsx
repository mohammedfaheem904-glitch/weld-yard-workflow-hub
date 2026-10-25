import { useState } from "react";
import { LOGO_IMAGE_URL, safeUrl } from "@/lib/site";

// Official mark + brand text. The mark is decorative (alt="") because the
// visible "WELD YARD" text already names the brand for screen readers.
export function Logo({ src = LOGO_IMAGE_URL }: { src?: string | null }) {
  const url = safeUrl(src);
  const [failed, setFailed] = useState(false);
  const showImage = url && !failed;
  return (
    <span className="flex items-center gap-2.5" data-testid={showImage ? "logo-official" : "logo-fallback"}>
      {showImage ? (
        <span aria-hidden className="grid h-10 w-10 shrink-0 place-items-center">
          <img
            src={url}
            alt=""
            width={287}
            height={286}
            className="h-full w-full object-contain"
            decoding="async"
            onError={() => setFailed(true)}
          />
        </span>
      ) : (
        <span aria-hidden className="grid h-9 w-9 place-items-center bg-primary font-display text-base font-black text-primary-foreground">
          WY
        </span>
      )}
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-tight text-brand-wordmark">WELD YARD</span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Integrated Welding Solutions</span>
      </span>
    </span>
  );
}
