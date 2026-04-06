import { cn } from "@/core/lib/utils";

/** Static mesh-style background behind home content (no motion). */
export function HomePageMathBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 min-h-full w-full bg-linear-to-br from-[var(--storefront-hero-mesh-a)] to-[var(--storefront-hero-mesh-b)]",
        className,
      )}
      aria-hidden
    />
  );
}
