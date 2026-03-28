import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/core/components/ui/carousel";
import { HomeHeroCard } from "./HomeHeroCard";

export function HomeHeroCarousel() {
  return (
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
  );
}
