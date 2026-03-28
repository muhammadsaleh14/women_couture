import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/core/components/ui/carousel";
import { useGetProducts } from "@/core/api/generated/api";
import { mapProductWithVariantsToStorefront } from "@/modules/product/infrastructure/mapProductWithVariantsToStorefront";
import { ProductCard } from "@/modules/product/presentation/ProductCard";
import { HomeHeroCard } from "@/pages/storefront/components/HomeHeroCard";

export function HomePage() {
  const { data: apiProducts = [], isLoading, isError } = useGetProducts({
    isActive: "true",
    take: 100,
  });

  const products = apiProducts
    .filter((p) => p.isActive)
    .map(mapProductWithVariantsToStorefront);

  return (
    <div className="space-y-10">
      <section>
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <HomeHeroCard
                variant="light"
                titleAs="h1"
                eyebrow="New Arrivals"
                title="Summer lawn & chiffon — fresh drops weekly"
                description="Browse our unstitched and ready-to-wear pieces below."
              />
            </CarouselItem>
            <CarouselItem>
              <HomeHeroCard
                variant="dark"
                eyebrow="2 Piece & separates"
                title="Easy summer kurta sets"
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-2 hidden sm:flex" />
          <CarouselNext className="right-2 hidden sm:flex" />
        </Carousel>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-stone-900">Products</h2>
        {isLoading && (
          <p className="text-sm text-stone-500">Loading products…</p>
        )}
        {isError && (
          <p className="text-sm text-destructive">
            Could not load products. Check that the API is running.
          </p>
        )}
        {!isLoading && !isError && products.length === 0 && (
          <p className="text-sm text-stone-600">No active products yet.</p>
        )}
        {!isLoading && !isError && products.length > 0 && (
          <Carousel opts={{ align: "start", dragFree: true }} className="w-full">
            <CarouselContent className="-ml-2">
              {products.map((p) => (
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
  );
}
