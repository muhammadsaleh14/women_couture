import { cn } from "@/core/lib/utils";

type Props = {
  price: number;
  className?: string;
  /** Refined typography for storefront cards and PDP. */
  variant?: "default" | "boutique";
};

export function PriceBlock({ price, className, variant = "default" }: Props) {
  const formatted = price.toLocaleString("en-PK");
  if (variant === "boutique") {
    return (
      <div className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0", className)}>
        <span className="text-[0.65rem] font-medium uppercase tracking-[0.22em] text-muted-foreground">
          Rs.
        </span>
        <span className="font-display text-xl font-medium tabular-nums tracking-tight text-foreground sm:text-2xl">
          {formatted}
        </span>
      </div>
    );
  }
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className="text-lg font-semibold tabular-nums text-foreground">
        Rs. {formatted}
      </span>
    </div>
  );
}
