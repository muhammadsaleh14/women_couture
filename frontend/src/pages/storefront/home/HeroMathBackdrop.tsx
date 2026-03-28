import { useEffect, useRef } from "react";
import { cn } from "@/core/lib/utils";

type Props = {
  variant: "light" | "dark";
  /** Offset so multiple heroes don’t move in perfect sync */
  phase?: number;
  className?: string;
};

/**
 * Animated mesh background: blob positions and gradient angle from sin/cos of time.
 */
export function HeroMathBackdrop({ variant, phase = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      el.style.background =
        variant === "light"
          ? "linear-gradient(135deg, rgb(250, 250, 249), rgb(231, 229, 228), rgb(214, 211, 209))"
          : "linear-gradient(135deg, rgb(41, 37, 36), rgb(68, 64, 60), rgb(28, 25, 23))";
      return;
    }

    let raf = 0;
    const tick = (now: number) => {
      const t = now * 0.00038 + phase;
      const s = Math.sin;
      const c = Math.cos;

      const x1 = 50 + 24 * s(t);
      const y1 = 42 + 20 * c(t * 0.71 + phase * 0.3);
      const x2 = 68 + 22 * s(t * 1.19 + 0.9);
      const y2 = 58 + 26 * c(t * 0.88 + 1.1);
      const x3 = 32 + 18 * s(t * 1.37 + 1.7);
      const y3 = 72 + 16 * c(t * 0.63 + 2.2);

      const angle = 118 + s(t * 0.42) * 14 + c(t * 0.31) * 6;

      if (variant === "light") {
        el.style.background = `
          radial-gradient(ellipse 90% 72% at ${x1}% ${y1}%, rgba(214, 211, 209, 0.58), transparent 64%),
          radial-gradient(ellipse 78% 58% at ${x2}% ${y2}%, rgba(231, 229, 228, 0.52), transparent 60%),
          radial-gradient(ellipse 62% 48% at ${x3}% ${y3}%, rgba(250, 250, 249, 0.72), transparent 56%),
          linear-gradient(${angle.toFixed(2)}deg, rgb(250, 250, 249), rgb(231, 229, 228), rgb(214, 211, 209))
        `;
      } else {
        el.style.background = `
          radial-gradient(ellipse 88% 68% at ${x1}% ${y1}%, rgba(87, 83, 78, 0.5), transparent 62%),
          radial-gradient(ellipse 72% 54% at ${x2}% ${y2}%, rgba(68, 64, 60, 0.42), transparent 58%),
          radial-gradient(ellipse 58% 42% at ${x3}% ${y3}%, rgba(120, 113, 108, 0.38), transparent 54%),
          linear-gradient(${angle.toFixed(2)}deg, rgb(41, 37, 36), rgb(68, 64, 60), rgb(28, 25, 23))
        `;
      }

      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [variant, phase]);

  return (
    <div
      ref={ref}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
      aria-hidden
    />
  );
}
