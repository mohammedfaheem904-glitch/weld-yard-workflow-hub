import { useEffect, type RefObject } from "react";

/**
 * Lightweight scroll parallax: writes a translate3d directly to `target` (no React re-renders).
 * Only listens while `container` is in the viewport, batches updates via requestAnimationFrame,
 * and is disabled below `minWidth` and when the user prefers reduced motion.
 * `compute` receives the container rect + viewport height and returns a Y offset in px.
 */
export function useParallax(
  container: RefObject<HTMLElement | null>,
  target: RefObject<HTMLElement | null>,
  compute: (rect: DOMRect, vh: number) => number,
  minWidth = 768,
) {
  useEffect(() => {
    const el = container.current;
    const img = target.current;
    if (!el || !img) return;
    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqWidth = window.matchMedia(`(min-width: ${minWidth}px)`);
    let frame = 0;
    let visible = false;
    let listening = false;

    const enabled = () => !mqMotion.matches && mqWidth.matches;
    const apply = () => {
      frame = 0;
      const y = enabled() ? compute(el.getBoundingClientRect(), window.innerHeight) : 0;
      img.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
    };
    const onScroll = () => { if (!frame) frame = requestAnimationFrame(apply); };
    const sync = () => {
      const want = visible && enabled();
      if (want && !listening) {
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll, { passive: true });
        listening = true;
      } else if (!want && listening) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        listening = false;
      }
      onScroll();
    };

    img.style.willChange = "transform";
    const io = new IntersectionObserver(([e]) => { visible = !!e?.isIntersecting; sync(); });
    io.observe(el);
    mqMotion.addEventListener("change", sync);
    mqWidth.addEventListener("change", sync);
    return () => {
      io.disconnect();
      mqMotion.removeEventListener("change", sync);
      mqWidth.removeEventListener("change", sync);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      img.style.transform = "";
      img.style.willChange = "";
    };
    // compute is a stable module-level function at call sites
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [container, target, minWidth]);
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Hero: image drifts down at 15% of scroll speed; capped at 15% of hero height (matches bleed). */
export const heroParallax = (rect: DOMRect) => clamp(-rect.top * 0.15, 0, rect.height * 0.15);

/** Section image: offset from viewport centre at 8%; capped at ±7% of height (bleed is 8%). */
export const sectionParallax = (rect: DOMRect, vh: number) => {
  const delta = vh / 2 - (rect.top + rect.height / 2);
  return clamp(delta * 0.08, -rect.height * 0.07, rect.height * 0.07);
};
