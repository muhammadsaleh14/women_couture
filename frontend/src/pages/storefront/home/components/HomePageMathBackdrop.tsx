import { cn } from "@/core/lib/utils";

/** Static mesh-style background behind home content (no motion). */
export function HomePageMathBackdrop({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 -z-10 min-h-full w-full bg-linear-to-br from-[rgb(250,250,249)] to-[rgb(245,245,244)] dark:from-[rgb(28,25,23)] dark:to-[rgb(41,37,36)]",
        className,
      )}
      aria-hidden
    />
  );
}
