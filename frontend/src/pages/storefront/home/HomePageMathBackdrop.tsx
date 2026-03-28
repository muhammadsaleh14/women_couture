import { useEffect, useRef } from "react";
import { cn } from "@/core/lib/utils";

/**
 * Soft full-page mesh motion behind home content (slower, lower contrast than hero).
 */
export function HomePageMathBackdrop({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      el.style.background =
        "linear-gradient(165deg, rgb(250, 250, 249), rgb(245, 245, 244))";
      return;
    }

    let raf = 0;
    const tick = (now: number) => {
      const t = now * 0.00012;
      const s = Math.sin;
      const c = Math.cos;

      const x1 = 15 + 18 * s(t * 0.9);
      const y1 = 20 + 22 * c(t * 0.7);
      const x2 = 85 + 15 * s(t * 0.65 + 2);
      const y2 = 75 + 20 * c(t * 0.55 + 1);
      const x3 = 50 + 25 * s(t * 0.5 + 0.5);
      const y3 = 50 + 18 * c(t * 0.8 + 2.5);

      el.style.background = `
        radial-gradient(ellipse 55% 45% at ${x1}% ${y1}%, rgba(231, 229, 228, 0.45), transparent 70%),
        radial-gradient(ellipse 50% 40% at ${x2}% ${y2}%, rgba(245, 245, 244, 0.35), transparent 68%),
        radial-gradient(ellipse 45% 50% at ${x3}% ${y3}%, rgba(214, 211, 209, 0.28), transparent 72%),
        linear-gradient(165deg, rgb(250, 250, 249), rgb(245, 245, 244))
      `;

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 min-h-full",
        className,
      )}
      aria-hidden
    />
  );
}
