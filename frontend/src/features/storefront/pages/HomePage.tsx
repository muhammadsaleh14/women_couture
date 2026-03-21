import { Link } from "react-router-dom";
import { Shirt } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/core/routes";
import { mockProducts } from "@/features/storefront/model/mock-products";
import { ProductCard } from "@/shared/components/product/ProductCard";

const categories = [
  {
    id: "three-piece" as const,
    label: "3 Piece",
    sub: "Unstitched",
  },
  {
    id: "two-piece" as const,
    label: "2 Piece",
    sub: "Co-ords",
  },
  {
    id: "separates" as const,
    label: "Separates",
    sub: "Dupatta & more",
  },
];

const trending = [...mockProducts]
  .sort((a, b) => Number(b.isNew) - Number(a.isNew))
  .slice(0, 6);

export function HomePage() {
  return (
    <div className="space-y-10">
      <section>
        <Carousel className="w-full">
          <CarouselContent>
            <CarouselItem>
              <Link to={ROUTES.shop("three-piece")} className="block">
                <Card className="relative overflow-hidden border-0 bg-stone-200/60 shadow-none">
                  <div className="aspect-[16/9] w-full bg-gradient-to-br from-stone-200 via-stone-100 to-stone-200 sm:aspect-[21/9]">
                    <div className="flex h-full flex-col justify-end p-6 sm:p-10">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-600">
                        New Arrivals
                      </p>
                      <h1 className="mt-1 max-w-md text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">
                        Summer lawn & chiffon — fresh drops weekly
                      </h1>
                      <p className="mt-2 max-w-sm text-sm text-stone-600">
                        Tap to explore unstitched 3PC collections.
                      </p>
                    </div>
                  </div>
                </Card>
              </Link>
            </CarouselItem>
            <CarouselItem>
              <Link to={ROUTES.shop("two-piece")} className="block">
                <Card className="overflow-hidden border-0 bg-stone-800 text-stone-50">
                  <div className="aspect-[16/9] bg-gradient-to-br from-stone-800 to-stone-700 sm:aspect-[21/9]">
                    <div className="flex h-full flex-col justify-end p-6 sm:p-10">
                      <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-400">
                        2 Piece
                      </p>
                      <h2 className="mt-1 text-2xl font-semibold sm:text-3xl">
                        Easy summer kurta sets
                      </h2>
                    </div>
                  </div>
                </Card>
              </Link>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className="left-2 hidden sm:flex" />
          <CarouselNext className="right-2 hidden sm:flex" />
        </Carousel>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
          Shop by look
        </h2>
        <div className="grid grid-cols-3 gap-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              to={ROUTES.shop(c.id)}
              className="group flex flex-col items-center rounded-xl border border-stone-200/80 bg-white p-4 text-center shadow-sm transition hover:border-stone-300 hover:shadow"
            >
              <span className="mb-2 flex size-12 items-center justify-center rounded-full bg-stone-100 text-stone-700 transition group-hover:bg-stone-900 group-hover:text-white">
                <Shirt className="size-6" aria-hidden />
              </span>
              <span className="text-sm font-semibold text-stone-900">{c.label}</span>
              <span className="text-xs text-stone-500">{c.sub}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-lg font-semibold text-stone-900">Trending now</h2>
          <Link
            to={ROUTES.shop("three-piece")}
            className="text-xs font-medium text-stone-600 underline-offset-4 hover:underline"
          >
            View all
          </Link>
        </div>
        <Carousel
          opts={{ align: "start", dragFree: true }}
          className="w-full"
        >
          <CarouselContent className="-ml-2">
            {trending.map((p) => (
              <CarouselItem
                key={p.id}
                className="basis-[70%] pl-2 sm:basis-[45%] md:basis-[33%]"
              >
                <ProductCard product={p} />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </section>
    </div>
  );
}
