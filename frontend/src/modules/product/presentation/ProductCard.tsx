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
    () =>
      product.variants.find((v) => v.isDefault)?.id ??
      product.variants[0]?.id ??
      "",
  );

  const selectedVariant = useMemo(() => {
    const v = product.variants.find((x) => x.id === selectedVariantId);
    return v ?? product.variants[0];
  }, [product.variants, selectedVariantId]);

  const cover = selectedVariant?.imageUrl ?? product.images[0] ?? "";
  const anyStock = product.variants.some((v) => v.stock > 0);
  const variants = product.variants.slice(0, 5);

  return (
    <Link to={ROUTES.product(product.id)} className={cn("group block", className)}>
      <Card className="overflow-hidden border border-border/50 bg-card text-card-foreground shadow-[var(--storefront-card-shadow)] transition-[box-shadow,transform] duration-500 ease-out hover:-translate-y-0.5 hover:shadow-[var(--storefront-card-shadow-hover)]">
        <CardHeader className="relative p-0">
          <div className="aspect-4/5 w-full overflow-hidden bg-muted">
            <ProductImageWithPlaceholder
              src={cover}
              alt=""
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-x-0 bottom-0 z-[1] h-20 bg-linear-to-t from-background/90 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" aria-hidden />
          <div className="absolute left-2.5 top-2.5 flex flex-wrap gap-1.5">
            {product.isNew && (
              <Badge
                variant="secondary"
                className="border border-primary/20 bg-background/85 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.2em] text-primary shadow-sm backdrop-blur-sm"
              >
                New
              </Badge>
            )}
            {!anyStock && (
              <Badge
                variant="secondary"
                className="border border-border bg-background/90 text-[10px] font-medium uppercase tracking-wider text-muted-foreground backdrop-blur-sm"
              >
                Sold out
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2.5 px-4 pb-4 pt-4">
          <p className="line-clamp-2 font-display text-lg font-medium leading-snug tracking-tight text-foreground sm:text-xl">
            {product.name}
          </p>
          <PriceBlock
            price={
              selectedVariant?.salePrice && selectedVariant.salePrice > 0
                ? selectedVariant.salePrice
                : product.regularPrice
            }
            className="text-base"
            variant="boutique"
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
                      "relative size-10 shrink-0 overflow-hidden rounded-sm border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                      selected
                        ? "border-primary ring-1 ring-primary/40"
                        : "border-border/80 hover:border-primary/35",
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
