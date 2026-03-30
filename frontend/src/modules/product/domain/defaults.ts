import { generateUuid } from "@/core/lib/randomUuid";
import type { ImageItem, ProductFormValues } from "./productFormSchema";

export function emptyVariant() {
  return {
    id: generateUuid(),
    isNew: true,
    sku: "",
    salePrice: "",
    purchasePrice: "",
    images: [] as ImageItem[],
  };
}

export function defaultProductFormValues(): ProductFormValues {
  return {
    name: "",
    description: "",
    type: "UNSTITCHED",
    variants: [emptyVariant()],
  };
}
