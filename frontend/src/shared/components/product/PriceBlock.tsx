import { cn } from "@/lib/utils";

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
          "text-lg font-semibold tabular-nums",
          hasSale && "text-rose-700",
        )}
      >
        Rs. {(hasSale ? salePrice : regularPrice).toLocaleString("en-PK")}
      </span>
      {hasSale && (
        <span className="text-sm text-stone-500 line-through tabular-nums">
          Rs. {regularPrice.toLocaleString("en-PK")}
        </span>
      )}
    </div>
  );
}
