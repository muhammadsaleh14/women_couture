import { Link } from "react-router-dom";
import { Card } from "@/core/components/ui/card";
import { cn } from "@/core/lib/utils";

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
      {hasImage ? (
        <>
          <img
            src={imageUrl!}
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-black/75 via-black/35 to-black/10"
            aria-hidden
          />
        </>
      ) : null}
      <div className="relative z-10 flex h-full flex-col justify-end p-6 sm:p-10">
        <p
          className={cn(
            "text-xs font-medium uppercase tracking-[0.2em]",
            hasImage || !isLight ? "text-stone-200" : "text-stone-600",
          )}
        >
          {eyebrow}
        </p>
        <Title
          className={cn(
            "mt-1 max-w-md text-2xl font-semibold sm:text-3xl",
            hasImage || !isLight
              ? "text-white"
              : "tracking-tight text-stone-900",
          )}
        >
          {title}
        </Title>
        {description ? (
          <p
            className={cn(
              "mt-2 max-w-sm text-sm",
              hasImage || !isLight ? "text-stone-200" : "text-stone-600",
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
    !hasImage && isLight ? "relative bg-stone-200/60" : "",
    !hasImage && !isLight ? "bg-stone-800 text-stone-50" : "",
    href && "transition hover:opacity-[0.98]",
  );

  const mediaShell = (
    <div
      className={cn(
        "relative aspect-video sm:aspect-21/9 w-full",
        !hasImage &&
          isLight &&
          "bg-linear-to-br from-stone-200 via-stone-100 to-stone-200",
        !hasImage && !isLight && "bg-linear-to-br from-stone-800 to-stone-700",
      )}
    >
      {inner}
    </div>
  );

  if (href) {
    return (
      <Link
        to={href}
        className="block rounded-xl text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 focus-visible:ring-offset-2"
      >
        <Card className={cn(cardClass, "p-0")}>{mediaShell}</Card>
      </Link>
    );
  }

  return <Card className={cn(cardClass, "p-0")}>{mediaShell}</Card>;
}
