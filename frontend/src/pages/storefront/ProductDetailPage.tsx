import { useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
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
import { VariantImageThumbnails } from "@/shared/components/product/VariantImageThumbnails";
import { PriceBlock } from "@/shared/components/product/PriceBlock";
import { StockBadge } from "@/shared/components/product/StockBadge";
import { ProductImageWithPlaceholder } from "@/shared/components/product/ProductImageWithPlaceholder";

export function ProductDetailPage() {
  const { productId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const variantFromUrl = searchParams.get("variant");
  return (
    <ProductDetailContent
      key={`${productId}:${variantFromUrl ?? ""}`}
      productId={productId}
      variantFromUrl={variantFromUrl}
    />
  );
}

function ProductDetailContent({
  productId,
  variantFromUrl,
}: {
  productId: string;
  variantFromUrl: string | null;
}) {
  const addLine = useCartStore((s) => s.addLine);
  const openCartSheet = useCartStore((s) => s.openSheet);

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

  const suggestedVariantId = useMemo(() => {
    if (!product?.variants.length) return null;
    if (
      variantFromUrl &&
      product.variants.some((v) => v.id === variantFromUrl)
    ) {
      return variantFromUrl;
    }
    return product.variants[0].id;
  }, [product, variantFromUrl]);

  const [manualVariantId, setManualVariantId] = useState<string | null>(null);

  const selectedVariantId =
    manualVariantId &&
    product?.variants.some((v) => v.id === manualVariantId)
      ? manualVariantId
      : suggestedVariantId;

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
      <p className="px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        Loading product…
      </p>
    );
  }

  if (isError || !product || !variant) {
    return (
      <p className="px-4 text-center text-sm text-muted-foreground sm:px-6 lg:px-8">
        Product not found.
      </p>
    );
  }

  const inStock = variant.stock > 0;
  const unitPrice = product.salePrice ?? product.regularPrice;

  const handleAddToCart = () => {
    addLine({
      productId: product.id,
      variantId: variant.id,
      title: product.name,
      sku: variant.sku,
      unitPrice,
      qty: 1,
      imageUrl: variant.imageUrl,
    });
  };

  const handleBuyNow = () => {
    handleAddToCart();
    openCartSheet();
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-10 xl:gap-12">
          <div className="w-full shrink-0 lg:max-w-xs xl:max-w-sm">
            <Carousel className="w-full max-w-md mx-auto lg:max-w-xs lg:mx-0 xl:max-w-sm">
              <CarouselContent>
                {carouselImages.map((src, i) => (
                  <CarouselItem key={`${i}-${src}`}>
                    <div className="aspect-3/4 overflow-hidden rounded-xl bg-muted">
                      <ProductImageWithPlaceholder
                        src={src}
                        alt=""
                        className="size-full object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>

          <div className="min-w-0 flex-1 space-y-6">
            <div className="space-y-3">
              <h1 className="text-xl font-semibold leading-snug text-foreground sm:text-2xl">
                {product.name}
              </h1>
              <PriceBlock
                regularPrice={product.regularPrice}
                salePrice={product.salePrice}
              />
              <StockBadge inStock={inStock} />
            </div>

            <Separator />

            <p className="text-sm leading-relaxed text-muted-foreground">
              {product.description || "No description yet."}
            </p>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Options
              </p>
              <VariantImageThumbnails
                variants={product.variants.map((v) => ({
                  id: v.id,
                  imageUrl: v.imageUrl,
                  sku: v.sku,
                  disabled: false,
                }))}
                selectedId={selectedVariantId}
                onSelect={setManualVariantId}
              />
              {variant.sku ? (
                <p className="text-sm text-muted-foreground">
                  SKU: {variant.sku}
                </p>
              ) : null}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:max-w-md lg:max-w-none">
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

            <Button variant="link" className="h-auto px-0 text-muted-foreground" asChild>
              <Link to={ROUTES.shop(product.categoryId)}>
                Back to category
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
