import { ImagePlus, Trash2 } from "lucide-react";
import { type ImageItem } from "../domain/productFormSchema";

interface VariantImageGridProps {
  sectionTitle: string;
  images: ImageItem[];
  onAddImages: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: (uid: string) => void;
}

export function VariantImageGrid({
  sectionTitle,
  images,
  onAddImages,
  onRemoveImage,
}: VariantImageGridProps) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          <span className="sr-only">Variant: </span>
          {sectionTitle}
        </p>
        <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-input bg-background px-2.5 py-1.5 text-xs font-medium text-foreground shadow-sm transition-colors hover:bg-muted/60">
          <ImagePlus className="size-3.5" />
          Add photos
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={onAddImages}
          />
        </label>
      </div>

      {images && images.length > 0 ? (
        <div className="flex flex-wrap gap-2 rounded-lg border border-dashed border-border/80 bg-muted/20 p-3">
          {images.map((img) => (
            <div
              key={img.uid}
              className="group relative size-20 overflow-hidden rounded-md border border-border bg-muted"
            >
              <img
                src={img.preview}
                alt="Variant preview"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(img.uid)}
                className="absolute right-0.5 top-0.5 rounded-sm bg-background/90 p-0.5 text-muted-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-background hover:text-destructive"
                aria-label="Remove image"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="rounded-lg border border-dashed border-border/60 bg-muted/15 px-3 py-6 text-center text-xs text-muted-foreground">
          No photos yet — use Add photos to upload.
        </p>
      )}
    </div>
  );
}
