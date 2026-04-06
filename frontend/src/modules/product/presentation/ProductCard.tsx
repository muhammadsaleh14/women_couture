import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Badge } from "@/core/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/core/components/ui/card";
import { cn } from "@/core/lib/utils";
import type { Product } from "@/shared/model/types";
import { ROUTES } from "@/core/routes";
import { PriceBlock } from "@/shared/components/product/PriceBlock";
import { ProductImageWithPlaceholder } from "@/shared/components/product/ProductImageWithPlaceholder";

type Props = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: Props) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    () => product.variants[0]?.id ?? "",
  );

  const selectedVariant = useMemo(() => {
    const v = product.variants.find((x) => x.id === selectedVariantId);
    return v ?? product.variants[0];
  }, [product.variants, selectedVariantId]);

  const cover = selectedVariant?.imageUrl ?? product.images[0] ?? "";
  const anyStock = product.variants.some((v) => v.stock > 0);
  const variants = product.variants.slice(0, 5);

  return (
    <Link to={ROUTES.product(product.id)} className={cn("block", className)}>
      <Card className="overflow-hidden border-border/80 bg-card text-card-foreground shadow-sm transition hover:shadow-md">
        <CardHeader className="relative p-0">
          <div className="aspect-[4/5] w-full overflow-hidden bg-muted">
            <ProductImageWithPlaceholder
              src={cover}
              alt=""
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.isNew && (
              <Badge className="bg-primary text-primary-foreground">
                New Arrival
              </Badge>
            )}
            {!anyStock && <Badge variant="destructive">Out of Stock</Badge>}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2 p-3 pt-3">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
            {product.name}
          </p>
          <PriceBlock
            price={
              selectedVariant?.salePrice && selectedVariant.salePrice > 0
                ? selectedVariant.salePrice
                : product.regularPrice
            }
            className="text-base"
          />
          {variants.length > 0 ? (
            <div className="flex flex-row flex-wrap items-center gap-1.5">
              {variants.map((v) => {
                const selected = v.id === selectedVariant?.id;
                const label = v.sku?.trim() || "Option";
                return (
                  <button
                    key={v.id}
                    type="button"
                    title={label}
                    aria-label={`Show ${label}`}
                    aria-pressed={selected}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedVariantId(v.id);
                    }}
                    className={cn(
                      "relative size-10 shrink-0 overflow-hidden rounded-md border-2 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      selected
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-border hover:border-muted-foreground/40",
                    )}
                  >
                    <ProductImageWithPlaceholder
                      src={v.imageUrl}
                      alt=""
                      className="size-full object-cover"
                    />
                  </button>
                );
              })}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </Link>
  );
}
