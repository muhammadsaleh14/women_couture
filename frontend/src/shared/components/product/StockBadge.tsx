import { Badge } from "@/core/components/ui/badge";
import { cn } from "@/core/lib/utils";

type Props = {
  inStock: boolean;
  className?: string;
};

export function StockBadge({ inStock, className }: Props) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "border font-medium uppercase tracking-wider",
        inStock
          ? "border-emerald-900/15 bg-emerald-950/[0.06] text-emerald-900 dark:border-emerald-100/20 dark:bg-emerald-400/10 dark:text-emerald-100"
          : "border-border bg-muted/80 text-muted-foreground",
        className,
      )}
    >
      {inStock ? "In Stock" : "Out of Stock"}
    </Badge>
  );
}
