import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/core/components/ui/carousel";
import { Button } from "@/core/components/ui/button";
import { Separator } from "@/core/components/ui/separator";
import { useGetProductsProductId } from "@/core/api/generated/api";
import { ROUTES } from "@/core/routes";
import { mapProductWithVariantsToStorefront } from "@/modules/product/infrastructure/mapProductWithVariantsToStorefront";
import { useCartStore } from "@/modules/cart/application/cart-store";
import { ColorSwatches } from "@/shared/components/product/ColorSwatches";
import { PriceBlock } from "@/shared/components/product/PriceBlock";
import { StockBadge } from "@/shared/components/product/StockBadge";

export function ProductDetailPage() {
  const { productId = "" } = useParams();
  const navigate = useNavigate();
  const addLine = useCartStore((s) => s.addLine);

  const { data: apiProduct, isLoading, isError } = useGetProductsProductId(
    productId,
    { query: { enabled: !!productId } },
  );

  const product = useMemo(
    () =>
      apiProduct && apiProduct.isActive
        ? mapProductWithVariantsToStorefront(apiProduct)
        : undefined,
    [apiProduct],
  );

  const firstVariant = product?.variants[0];
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    firstVariant?.id ?? null,
  );

  useEffect(() => {
    if (product?.variants[0]) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product?.id, product?.variants]);

  const variant = useMemo(() => {
    if (!product || !selectedVariantId) {
      return undefined;
    }
    return product.variants.find((v) => v.id === selectedVariantId);
  }, [product, selectedVariantId]);

  const carouselImages = useMemo(() => {
    if (!product || !variant) {
      return [];
    }
    const primary = variant.imageUrl;
    const rest = product.images.filter((u) => u !== primary);
    return [primary, ...rest];
  }, [product, variant]);

  if (isLoading) {
    return (
      <p className="text-center text-sm text-stone-600">Loading product…</p>
    );
  }

  if (isError || !product || !variant) {
    return (
      <p className="text-center text-sm text-stone-600">Product not found.</p>
    );
  }

  const inStock = variant.stock > 0;
  const unitPrice = product.salePrice ?? product.regularPrice;

  const handleAddToCart = () => {
    addLine({
      productId: product.id,
      variantId: variant.id,
      title: product.name,
      colorName: variant.colorName,
      unitPrice,
      qty: 1,
      imageUrl: variant.imageUrl,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate(ROUTES.cart);
  };

  return (
    <div className="space-y-6">
      <Carousel className="w-full">
        <CarouselContent>
          {carouselImages.map((src) => (
            <CarouselItem key={src}>
              <div className="aspect-[3/4] overflow-hidden rounded-xl bg-stone-100">
                <img src={src} alt="" className="size-full object-cover" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
      </Carousel>

      <div className="space-y-3">
        <h1 className="text-xl font-semibold leading-snug text-stone-900">
          {product.name}
        </h1>
        <PriceBlock
          regularPrice={product.regularPrice}
          salePrice={product.salePrice}
        />
        <StockBadge inStock={inStock} />
      </div>

      <Separator />

      <p className="text-sm leading-relaxed text-stone-600">
        {product.description || "No description yet."}
      </p>

      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
          Color
        </p>
        <ColorSwatches
          variants={product.variants.map((v) => ({
            id: v.id,
            colorName: v.colorName,
            hex: v.hex,
            disabled: false,
          }))}
          selectedId={selectedVariantId}
          onSelect={setSelectedVariantId}
        />
        <p className="text-sm text-stone-700">{variant.colorName}</p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          size="lg"
          className="flex-1"
          disabled={!inStock}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="flex-1"
          disabled={!inStock}
          onClick={handleBuyNow}
        >
          Buy Now
        </Button>
      </div>

      <Button variant="link" className="h-auto px-0 text-stone-600" asChild>
        <Link to={ROUTES.shop(product.categoryId)}>Back to category</Link>
      </Button>
    </div>
  );
}
