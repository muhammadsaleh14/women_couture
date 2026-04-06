import { cn } from "@/core/lib/utils";

type Props = {
  price: number;
  className?: string;
};

export function PriceBlock({ price, className }: Props) {
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span className="text-lg font-semibold tabular-nums text-foreground">
        Rs. {price.toLocaleString("en-PK")}
      </span>
    </div>
  );
}
