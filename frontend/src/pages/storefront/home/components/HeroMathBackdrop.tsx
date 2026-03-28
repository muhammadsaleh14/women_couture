import { cn } from "@/core/lib/utils";

type Props = {
  variant: "light" | "dark";
  className?: string;
};

/** Static gradient mesh behind hero cards when no image is set. */
export function HeroMathBackdrop({ variant, className }: Props) {
  const background =
    variant === "light"
      ? "linear-gradient(135deg, rgb(250, 250, 249), rgb(231, 229, 228), rgb(214, 211, 209))"
      : "linear-gradient(135deg, rgb(41, 37, 36), rgb(68, 64, 60), rgb(28, 25, 23))";

  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
        className,
      )}
      style={{ background }}
      aria-hidden
    />
  );
}
