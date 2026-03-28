import { cn } from "@/core/lib/utils";

export type VariantThumbnailItem = {
  id: string;
  imageUrl: string;
  sku: string | null;
  disabled?: boolean;
};

type Props = {
  variants: VariantThumbnailItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
};

export function VariantImageThumbnails({
  variants,
  selectedId,
  onSelect,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {variants.map((v) => {
        const selected = selectedId === v.id;
        const label = v.sku?.trim() || "Option";
        return (
          <button
            key={v.id}
            type="button"
            disabled={v.disabled}
            title={label}
            onClick={() => onSelect(v.id)}
            className={cn(
              "relative size-14 shrink-0 overflow-hidden rounded-lg border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              selected
                ? "border-primary ring-2 ring-primary/30"
                : "border-border",
              v.disabled && "cursor-not-allowed opacity-40",
            )}
            aria-label={`Select ${label}`}
            aria-pressed={selected}
          >
            <img
              src={v.imageUrl}
              alt=""
              className="size-full object-cover"
            />
          </button>
        );
      })}
    </div>
  );
}
