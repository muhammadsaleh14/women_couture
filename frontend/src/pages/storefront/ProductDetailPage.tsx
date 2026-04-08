import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { Check } from "lucide-react";
import { toast } from "sonner";
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
import { cn } from "@/core/lib/utils";
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
  const [bagJustAdded, setBagJustAdded] = useState(false);
  const bagConfirmTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

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
    return (
      product.variants.find((v) => v.isDefault)?.id ??
      product.variants[0].id
    );
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

  useEffect(() => {
    return () => {
      if (bagConfirmTimer.current) {
        clearTimeout(bagConfirmTimer.current);
      }
    };
  }, []);

  if (isLoading) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-20 text-center text-sm tracking-wide text-muted-foreground sm:px-6 lg:px-10">
        Loading…
      </p>
    );
  }

  if (isError || !product || !variant) {
    return (
      <p className="mx-auto max-w-3xl px-4 py-20 text-center text-sm tracking-wide text-muted-foreground sm:px-6 lg:px-10">
        This piece could not be found.
      </p>
    );
  }

  const inStock = variant.stock > 0;
  const unitPrice =
    variant.salePrice > 0 ? variant.salePrice : product.regularPrice;

  const pushToBag = () => {
    const lineId = `${product.id}:${variant.id}`;
    const hadLine = useCartStore
      .getState()
      .lines.some((l) => l.lineId === lineId);
    addLine({
      productId: product.id,
      variantId: variant.id,
      title: product.name,
      sku: variant.sku,
      unitPrice,
      qty: 1,
      imageUrl: variant.imageUrl,
    });
    return hadLine;
  };

  const handleAddToCart = () => {
    const hadLine = pushToBag();

    if (bagConfirmTimer.current) {
      clearTimeout(bagConfirmTimer.current);
    }
    setBagJustAdded(true);
    bagConfirmTimer.current = setTimeout(() => {
      setBagJustAdded(false);
      bagConfirmTimer.current = null;
    }, 2200);

    toast.success(hadLine ? "Quantity updated" : "Added to your bag", {
      description: product.name,
      duration: 4500,
      action: {
        label: "View bag",
        onClick: () => openCartSheet(),
      },
    });
  };

  const handleBuyNow = () => {
    const hadLine = pushToBag();
    openCartSheet();
    toast.success(hadLine ? "Quantity updated" : "Added to your bag", {
      description: product.name,
      duration: 3500,
    });
  };

  return (
    <div className="px-4 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-[1400px]">
        <div className="flex flex-col gap-10 pb-16 pt-6 lg:flex-row lg:items-start lg:gap-14 xl:gap-20">
          <div className="w-full shrink-0 lg:max-w-sm xl:max-w-md">
            <Carousel className="mx-auto w-full max-w-md lg:mx-0 lg:max-w-sm xl:max-w-md">
              <CarouselContent>
                {carouselImages.map((src, i) => (
                  <CarouselItem key={`${i}-${src}`}>
                    <div className="aspect-3/4 overflow-hidden rounded-sm border border-border/40 bg-muted shadow-[var(--storefront-card-shadow)]">
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

          <div className="min-w-0 flex-1 space-y-8 lg:pt-4">
            <div className="space-y-4">
              <p className="storefront-eyebrow">{product.subCategory}</p>
              <h1 className="font-display text-3xl font-medium leading-[1.15] tracking-tight text-foreground sm:text-4xl lg:text-[2.75rem]">
                {product.name}
              </h1>
              <PriceBlock price={unitPrice} variant="boutique" />
              <StockBadge inStock={inStock} />
            </div>

            <Separator className="bg-border/70" />

            <p className="max-w-xl text-sm leading-[1.75] text-muted-foreground">
              {product.description || "A timeless addition to your wardrobe."}
            </p>

            <div className="space-y-3">
              <p className="storefront-eyebrow">Options</p>
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

            <div className="flex flex-col gap-3 sm:flex-row sm:max-w-lg lg:max-w-none">
              <Button
                size="lg"
                className={cn(
                  "flex-1 rounded-sm text-xs font-medium uppercase tracking-[0.2em] transition-colors duration-300",
                  bagJustAdded &&
                    "bg-emerald-950 text-emerald-50 hover:bg-emerald-950 dark:bg-emerald-800 dark:text-emerald-50 dark:hover:bg-emerald-800",
                )}
                disabled={!inStock}
                onClick={handleAddToCart}
              >
                {bagJustAdded ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check className="size-4 shrink-0" strokeWidth={2.5} aria-hidden />
                    Added
                  </span>
                ) : (
                  "Add to bag"
                )}
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="flex-1 rounded-sm border border-border bg-transparent text-xs font-medium uppercase tracking-[0.2em] hover:bg-muted/80"
                disabled={!inStock}
                onClick={handleBuyNow}
              >
                Buy now
              </Button>
            </div>

            <Button
              variant="link"
              className="h-auto px-0 text-xs uppercase tracking-widest text-muted-foreground"
              asChild
            >
              <Link to={ROUTES.shop(product.categoryId)}>
                ← Back to collection
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
