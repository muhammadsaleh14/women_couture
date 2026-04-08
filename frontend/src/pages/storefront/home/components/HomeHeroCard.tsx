import { Link } from "react-router-dom";
import { Card } from "@/core/components/ui/card";
import { cn } from "@/core/lib/utils";
import { HeroMathBackdrop } from "./HeroMathBackdrop";

export type HomeHeroCardProps = {
  variant: "light" | "dark";
  eyebrow: string;
  title: string;
  description?: string | null;
  titleAs?: "h1" | "h2";
  /** Hero background from linked variant (optional). */
  imageUrl?: string | null;
  /** When set, the whole card is a link (e.g. product detail). */
  href?: string;
};

export function HomeHeroCard({
  variant,
  eyebrow,
  title,
  description,
  titleAs = "h2",
  imageUrl,
  href,
}: HomeHeroCardProps) {
  const isLight = variant === "light";
  const Title = titleAs;
  const hasImage = Boolean(imageUrl);

  const inner = (
    <>
      {!hasImage ? (
        <HeroMathBackdrop variant={isLight ? "light" : "dark"} />
      ) : null}
      {hasImage ? (
        <>
          <img
            src={imageUrl!}
            alt=""
            className="absolute inset-0 z-1 size-full object-cover"
          />
          <div
            className="absolute inset-0 z-2 bg-linear-to-t from-black/75 via-black/35 to-black/10"
            aria-hidden
          />
        </>
      ) : null}
      <div className="relative z-3 flex h-full flex-col justify-end p-6 sm:p-10">
        <p
          className={cn(
            "text-[0.65rem] font-medium uppercase tracking-[0.28em]",
            hasImage || !isLight
              ? "text-stone-300"
              : "text-muted-foreground",
          )}
        >
          {eyebrow}
        </p>
        <Title
          className={cn(
            "font-display mt-2 max-w-lg text-3xl font-medium leading-tight sm:text-4xl lg:text-5xl",
            hasImage || !isLight
              ? "text-stone-200"
              : "tracking-tight text-foreground",
          )}
        >
          {title}
        </Title>
        {description ? (
          <p
            className={cn(
              "mt-2 max-w-sm text-sm",
              hasImage || !isLight
                ? "text-stone-300"
                : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        ) : null}
      </div>
    </>
  );

  const cardClass = cn(
    "overflow-hidden border-0 shadow-none",
    !hasImage && isLight ? "bg-muted/50" : "",
    !hasImage && !isLight
      ? "bg-stone-900 text-stone-200 dark:bg-stone-950 dark:text-stone-300"
      : "",
    href && "transition hover:opacity-[0.98]",
  );

  const mediaShell = (
    <div className="relative aspect-video w-full overflow-hidden rounded-[inherit] sm:aspect-21/9">
      {inner}
    </div>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="block rounded-sm text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Card className={cn(cardClass, "p-0")}>{mediaShell}</Card>
      </Link>
    );
  }

  return <Card className={cn(cardClass, "p-0")}>{mediaShell}</Card>;
}
