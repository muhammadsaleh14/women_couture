import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/core/components/ui/carousel";
import { ROUTES } from "@/core/routes";
import { useGetHomeHeroSlides } from "@/core/api/generated/api";
import { HomeHeroCard } from "./HomeHeroCard";

function themeToVariant(theme: "LIGHT" | "DARK"): "light" | "dark" {
  return theme === "LIGHT" ? "light" : "dark";
}

export function HomeHeroCarousel() {
  const { data: slides = [], isLoading, isError } = useGetHomeHeroSlides();

  if (isLoading) {
    return (
      <section aria-busy="true">
        <div className="aspect-video animate-pulse rounded-lg bg-muted sm:aspect-21/9" />
      </section>
    );
  }

  if (isError || slides.length === 0) {
    return null;
  }

  return (
    <section>
      <Carousel className="w-full">
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id}>
              <HomeHeroCard
                variant={themeToVariant(slide.theme)}
                titleAs={slide.usePrimaryHeading ? "h1" : "h2"}
                eyebrow={slide.eyebrow}
                title={slide.title}
                description={slide.description}
                imageUrl={slide.imageUrl}
                motionPhase={index * 2.399 + (slide.id.charCodeAt(0) % 7) * 0.17}
                href={
                  slide.productId
                    ? ROUTES.productDetail(slide.productId, slide.variantId)
                    : undefined
                }
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {slides.length > 1 ? (
          <>
            <CarouselPrevious className="left-2 hidden sm:flex" />
            <CarouselNext className="right-2 hidden sm:flex" />
          </>
        ) : null}
      </Carousel>
    </section>
  );
}
