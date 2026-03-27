import { cn } from "@/core/lib/utils";

type Swatch = {
  id: string;
  colorName: string;
  hex: string;
  disabled?: boolean;
};

type Props = {
  variants: Swatch[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  className?: string;
};

export function ColorSwatches({
  variants,
  selectedId,
  onSelect,
  className,
}: Props) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {variants.map((v) => {
        const selected = selectedId === v.id;
        return (
          <button
            key={v.id}
            type="button"
            disabled={v.disabled}
            title={v.colorName}
            onClick={() => onSelect(v.id)}
            className={cn(
              "size-8 rounded-full border-2 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-400",
              selected
                ? "border-stone-900 ring-2 ring-stone-300"
                : "border-stone-200",
              v.disabled && "cursor-not-allowed opacity-40",
            )}
            style={{ backgroundColor: v.hex }}
            aria-label={v.colorName}
          />
        );
      })}
    </div>
  );
}
