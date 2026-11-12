import { useEffect, useRef, useState } from "react";
import { Award, Building2, HardHat, ThumbsUp, type LucideIcon } from "lucide-react";
import { useTr } from "@/lib/locale";
import { Container } from "@/components/site/blocks";

type Stat = { value: number; suffix: string; en: string; ar: string; icon: LucideIcon };

const STATS: Stat[] = [
  { value: 150, suffix: "+", en: "Projects Completed", ar: "مشروع تم تنفيذه", icon: HardHat },
  { value: 50, suffix: "+", en: "Clients", ar: "عميل", icon: Building2 },
  { value: 3, suffix: "+", en: "Years of Experience", ar: "سنة خبرة", icon: Award },
  { value: 95, suffix: "%", en: "Customer Satisfaction", ar: "نسبة رضا العملاء", icon: ThumbsUp },
];

const DURATION = 1800;

export function StatsCounter() {
  const tr = useTr();
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setProgress(1);
      return;
    }
    let raf = 0;
    const obs = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return;
        obs.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / DURATION);
          setProgress(1 - Math.pow(1 - t, 3));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => { obs.disconnect(); cancelAnimationFrame(raf); };
  }, []);

  return (
    <section ref={ref} aria-label={tr("Weld Yard in numbers", "Weld Yard بالأرقام")} className="border-b bg-secondary/40 py-14 sm:py-16">
      <Container>
        <ul className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {STATS.map((s) => {
            const Icon = s.icon;
            const label = tr(s.en, s.ar);
            return (
              <li key={s.en} className="flex flex-col items-start gap-4 rounded-xl border bg-card p-4 shadow-sm sm:p-6">
                <span aria-hidden className="grid size-10 place-items-center rounded-lg bg-primary/10 text-brand-ink sm:size-12">
                  <Icon className="size-5 sm:size-6" />
                </span>
                <div>
                  <p aria-hidden dir="ltr" className="font-black tabular-nums text-3xl leading-none text-navy sm:text-5xl rtl:text-end">
                    {Math.round(s.value * progress)}<span className="text-primary">{s.suffix}</span>
                  </p>
                  <p className="sr-only">{`${s.value}${s.suffix} ${label}`}</p>
                  <p aria-hidden className="mt-2 text-sm font-medium text-muted-foreground sm:text-base">{label}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
