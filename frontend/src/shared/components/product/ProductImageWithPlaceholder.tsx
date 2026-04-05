import { cn } from "@/core/lib/utils";
import { isProductImagePlaceholderUrl } from "./productImagePlaceholderUrl";

type Props = {
  src: string;
  alt?: string;
  className?: string;
  loading?: "lazy" | "eager";
};

/**
 * Long kurti + dupatta silhouette; uses `currentColor` so light/dark theme applies automatically.
 */
export function ProductImagePlaceholder({
  className,
}: {
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-hidden
      className={cn(
        "flex items-center justify-center bg-muted text-muted-foreground/40",
        className,
      )}
    >
      <svg
        viewBox="0 0 80 100"
        className="h-[78%] w-[62%] shrink-0"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Dupatta / scarf drape */}
        <path
          d="M8 28c4-8 14-12 22-10 6 2 10 8 12 16l-2 42c-8 4-16 2-22-4L8 28Z"
          fill="currentColor"
          opacity={0.35}
        />
        {/* Kurta body */}
        <path
          d="M40 10c-7 0-12 5-13 11l-1 6h-4l-5 62h46l-5-62h-4l-1-6c-1-6-6-11-13-11Z"
          fill="currentColor"
          opacity={0.5}
        />
        {/* Neckline hint */}
        <path
          d="M32 18c2-3 6-5 8-5s6 2 8 5"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          opacity={0.55}
        />
        {/* Hem / flare */}
        <path
          d="M18 78c8 6 18 10 22 10s14-4 22-10"
          stroke="currentColor"
          strokeWidth={1.25}
          strokeLinecap="round"
          opacity={0.4}
        />
      </svg>
    </div>
  );
}

export function ProductImageWithPlaceholder({
  src,
  alt = "",
  className,
  loading = "lazy",
}: Props) {
  if (isProductImagePlaceholderUrl(src)) {
    return <ProductImagePlaceholder className={className} />;
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading={loading}
    />
  );
}
