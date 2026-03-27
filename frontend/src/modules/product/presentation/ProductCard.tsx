import { Link } from "react-router-dom";
import { Badge } from "@/core/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/core/components/ui/card";
import { cn } from "@/core/lib/utils";
import type { Product } from "@/shared/model/types";
import { ROUTES } from "@/core/routes";
import { PriceBlock } from "@/shared/components/product/PriceBlock";

type Props = {
  product: Product;
  className?: string;
};

export function ProductCard({ product, className }: Props) {
  const cover = product.variants[0]?.imageUrl ?? product.images[0];
  const anyStock = product.variants.some((v) => v.stock > 0);

  return (
    <Link to={ROUTES.product(product.id)} className={cn("block", className)}>
      <Card className="overflow-hidden border-stone-200/80 bg-white shadow-sm transition hover:shadow-md">
        <CardHeader className="relative p-0">
          <div className="aspect-[4/5] w-full overflow-hidden bg-stone-100">
            <img
              src={cover}
              alt=""
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {product.isNew && (
              <Badge className="bg-stone-900 text-white">New Arrival</Badge>
            )}
            {!anyStock && <Badge variant="destructive">Out of Stock</Badge>}
          </div>
        </CardHeader>
        <CardContent className="space-y-1 p-3">
          <p className="line-clamp-2 text-sm font-medium leading-snug text-stone-900">
            {product.name}
          </p>
          <PriceBlock
            regularPrice={product.regularPrice}
            salePrice={product.salePrice}
            className="text-base"
          />
        </CardContent>
        <CardFooter className="flex gap-1 border-t-0 p-3 pt-0">
          {product.variants.slice(0, 5).map((v) => (
            <span
              key={v.id}
              className="size-4 rounded-full border border-stone-200"
              style={{ backgroundColor: v.hex }}
              title={v.colorName}
              aria-hidden
            />
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}
