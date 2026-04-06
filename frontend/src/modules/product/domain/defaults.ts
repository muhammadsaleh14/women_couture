import { generateUuid } from "@/core/lib/randomUuid";
import type { ImageItem, ProductFormValues } from "./productFormSchema";

export function emptyVariant(): ProductFormValues["variants"][number] {
  return {
    id: generateUuid(),
    isNew: true,
    isDefault: false,
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
    variants: [{ ...emptyVariant(), isDefault: true }],
  };
}
