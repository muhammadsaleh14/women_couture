import { ImagePlus, Trash2 } from "lucide-react";
import { Label } from "@/core/components/ui/label";
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
    <div>
      <div className="mb-2 flex items-center gap-2">
        <Label className="text-xs text-stone-500">
          Photos — {sectionTitle}
        </Label>
        <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-stone-300 bg-white px-2 py-1 text-xs text-stone-600 transition-colors hover:bg-stone-50">
          <ImagePlus className="size-3" />
          Add
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={onAddImages}
          />
        </label>
      </div>

      {images && images.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {images.map((img) => (
            <div
              key={img.uid}
              className="group relative size-16 overflow-hidden rounded-md border bg-stone-100"
            >
              <img
                src={img.preview}
                alt="Variant preview"
                className="h-full w-full object-cover transition-transform group-hover:scale-105"
              />
              <button
                type="button"
                onClick={() => onRemoveImage(img.uid)}
                className="absolute right-0.5 top-0.5 rounded-sm bg-white/80 p-0.5 text-stone-600 shadow backdrop-blur-sm transition-colors hover:bg-white hover:text-red-500"
                aria-label="Remove image"
              >
                <Trash2 className="size-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
