import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Props = {
  inStock: boolean;
  className?: string;
};

export function StockBadge({ inStock, className }: Props) {
  return (
    <Badge
      variant="secondary"
      className={cn(
        "font-medium",
        inStock
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-800",
        className,
      )}
    >
      {inStock ? "In Stock" : "Out of Stock"}
    </Badge>
  );
}
