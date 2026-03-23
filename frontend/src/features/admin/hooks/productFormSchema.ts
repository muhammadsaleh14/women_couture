import { z } from "zod";

const ImageItemSchema = z.object({
  uid: z.string(),
  preview: z.string(),
  file: z.instanceof(File).optional(),
});

export const productVariantSchema = z.object({
  id: z.string(),
  isNew: z.boolean(),
  color: z.string().min(1, "Color/Group name is required"),
  sku: z.string().optional(),
  salePrice: z.string().min(1, "Sale price is required"),
  purchasePrice: z.string().optional(),
  images: z.array(ImageItemSchema),
});

export const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  type: z.enum(["UNSTITCHED", "THREE_PC", "TWO_PC", "SEPARATE"]),
  variants: z.array(productVariantSchema).min(1, "At least one variant is required"),
});

export type ProductFormValues = z.infer<typeof productFormSchema>;
export type VariantFormValues = z.infer<typeof productVariantSchema>;
export type ImageItem = z.infer<typeof ImageItemSchema>;
