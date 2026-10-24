import { LOGO_IMAGE_URL, safeUrl } from "@/lib/site";

export function Logo({ src = LOGO_IMAGE_URL }: { src?: string | null }) {
  const url = safeUrl(src);
  if (url) {
    return <img src={url} alt="Weld Yard — Integrated Welding Solutions" className="h-10 w-auto max-w-[200px] object-contain" decoding="async" />;
  }
  return (
    <span className="flex items-center gap-2.5" data-testid="logo-fallback">
      <span aria-hidden className="grid h-9 w-9 place-items-center bg-primary font-display text-base font-black text-primary-foreground">
        WY
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-lg font-extrabold tracking-tight">WELD YARD</span>
        <span className="mt-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Integrated Welding Solutions</span>
      </span>
    </span>
  );
}
