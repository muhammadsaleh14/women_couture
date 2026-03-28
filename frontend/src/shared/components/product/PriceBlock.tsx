import { cn } from "@/core/lib/utils";

type Props = {
  regularPrice: number;
  salePrice?: number;
  className?: string;
};

export function PriceBlock({ regularPrice, salePrice, className }: Props) {
  const hasSale = salePrice != null && salePrice < regularPrice;
  return (
    <div className={cn("flex flex-wrap items-baseline gap-2", className)}>
      <span
        className={cn(
          "text-lg font-semibold tabular-nums text-foreground",
          hasSale && "text-rose-600 dark:text-rose-400",
        )}
      >
        Rs. {(hasSale ? salePrice : regularPrice).toLocaleString("en-PK")}
      </span>
      {hasSale && (
        <span className="text-sm text-muted-foreground line-through tabular-nums">
          Rs. {regularPrice.toLocaleString("en-PK")}
        </span>
      )}
    </div>
  );
}
