import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/core/components/ui/carousel";
import { useGetProducts } from "@/core/api/generated/api";
import { mapProductWithVariantsToStorefront } from "@/modules/product/infrastructure/mapProductWithVariantsToStorefront";
import { ProductCard } from "@/modules/product/presentation/ProductCard";
import { ButtonLink } from "./ButtonLink";
import { CategoryFilterBar } from "./CategoryFilterBar";
import { HomeCategoryBrowse } from "./HomeCategoryBrowse";
import { HomeHeroCarousel } from "./HomeHeroCarousel";
import { HomePageMathBackdrop } from "./HomePageMathBackdrop";
import { isCategoryId } from "./homeCategory";

export function HomePage() {
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get("category");
  const categoryFilter =
    categoryParam && isCategoryId(categoryParam) ? categoryParam : null;
  const invalidCategory = Boolean(categoryParam && !categoryFilter);

  const { data: apiProducts = [], isLoading, isError } = useGetProducts({
    isActive: "true",
    take: 100,
  });

  const allProducts = useMemo(
    () =>
      apiProducts
        .filter((p) => p.isActive)
        .map(mapProductWithVariantsToStorefront),
    [apiProducts],
  );

  if (invalidCategory) {
    return (
      <div className="flex flex-1 flex-col space-y-4 text-center">
        <p className="text-sm text-muted-foreground">Category not found.</p>
        <ButtonLink />
      </div>
    );
  }

  if (categoryFilter) {
    if (isLoading) {
      return (
        <p className="flex flex-1 justify-center pt-8 text-center text-sm text-muted-foreground">
          Loading…
        </p>
      );
    }
    if (isError) {
      return (
        <p className="flex flex-1 justify-center pt-8 text-center text-sm text-destructive">
          Could not load products.
        </p>
      );
    }

    return (
      <HomeCategoryBrowse
        key={categoryFilter}
        categoryFilter={categoryFilter}
        allProducts={allProducts}
      />
    );
  }

  return (
    <div className="relative isolate flex w-full min-h-0 flex-1 flex-col">
      <HomePageMathBackdrop />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col space-y-10">
      <HomeHeroCarousel />

      <section className="space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          Shop by category
        </h2>
        <CategoryFilterBar activeId={null} />
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Products</h2>
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading products…</p>
        )}
        {isError && (
          <p className="text-sm text-destructive">
            Could not load products. Check that the API is running.
          </p>
        )}
        {!isLoading && !isError && allProducts.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No active products yet.
          </p>
        )}
        {!isLoading && !isError && allProducts.length > 0 && (
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-2">
              {allProducts.map((p) => (
                <CarouselItem
                  key={p.id}
                  className="basis-[70%] pl-2 sm:basis-[45%] md:basis-[33%]"
                >
                  <ProductCard product={p} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        )}
      </section>
      </div>
    </div>
  );
}
