import { z } from "zod";

function parseMoneyInput(val: string): number {
  return Number(String(val).replace(",", ".").replace(/\s/g, "").trim());
}

const nonNegativeMoneyString = z
  .string()
  .min(1, "Sale price is required")
  .refine((val) => {
    const n = parseMoneyInput(val);
    return !Number.isNaN(n) && n >= 0;
  }, "Enter a valid non-negative price");

const optionalNonNegativeMoneyString = z
  .string()
  .refine((val) => {
    const t = val.trim();
    if (t === "") return true;
    const n = parseMoneyInput(t);
    return !Number.isNaN(n) && n >= 0;
  }, "Enter a valid non-negative price or leave empty");

const ImageItemSchema = z.object({
  uid: z.string(),
  preview: z.string(),
  file: z.instanceof(File).optional(),
});

export const productVariantSchema = z.object({
  id: z.string(),
  isNew: z.boolean(),
  sku: z.string().optional(),
  salePrice: nonNegativeMoneyString,
  purchasePrice: optionalNonNegativeMoneyString.optional(),
  images: z.array(ImageItemSchema),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
  variants: z
    .array(productVariantSchema)
    .min(1, "At least one variant is required"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type VariantFormValues = z.infer<typeof productVariantSchema>;
export type ImageItem = z.infer<typeof ImageItemSchema>;

/** Passed from variant row to open the admin stock-adjust dialog. */
export type AdjustVariantStockPayload = {
  variantId: string;
  sku: string | null;
  stockQty: number;
};
