import { Card } from "@/core/components/ui/card";
import { cn } from "@/core/lib/utils";

export type HomeHeroCardProps = {
  variant: "light" | "dark";
  eyebrow: string;
  title: string;
  description?: string;
  titleAs?: "h1" | "h2";
};

export function HomeHeroCard({
  variant,
  eyebrow,
  title,
  description,
  titleAs = "h2",
}: HomeHeroCardProps) {
  const isLight = variant === "light";
  const Title = titleAs;

  return (
    <Card
      className={cn(
        "overflow-hidden border-0 shadow-none",
        isLight ? "relative bg-stone-200/60" : "bg-stone-800 text-stone-50",
      )}
    >
      <div
        className={cn(
          "aspect-video sm:aspect-21/9",
          isLight
            ? "w-full bg-linear-to-br from-stone-200 via-stone-100 to-stone-200"
            : "bg-linear-to-br from-stone-800 to-stone-700",
        )}
      >
        <div className="flex h-full flex-col justify-end p-6 sm:p-10">
          <p
            className={cn(
              "text-xs font-medium uppercase tracking-[0.2em]",
              isLight ? "text-stone-600" : "text-stone-400",
            )}
          >
            {eyebrow}
          </p>
          <Title
            className={cn(
              "mt-1 max-w-md text-2xl font-semibold sm:text-3xl",
              isLight ? "tracking-tight text-stone-900" : "text-stone-50",
            )}
          >
            {title}
          </Title>
          {description ? (
            <p
              className={cn(
                "mt-2 max-w-sm text-sm",
                isLight ? "text-stone-600" : "text-stone-400",
              )}
            >
              {description}
            </p>
          ) : null}
        </div>
      </div>
    </Card>
  );
}
