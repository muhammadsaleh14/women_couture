import { z } from "zod";

export const homeHeroSlideFormSchema = z.object({
  theme: z.enum(["LIGHT", "DARK"]),
  usePrimaryHeading: z.boolean(),
  isActive: z.boolean(),
  eyebrow: z.string(),
  title: z.string(),
  description: z.string(),
  productVariantId: z
    .string()
    .min(1, "Choose a product variant that has at least one image"),
  productImageId: z.string().min(1, "Choose which image appears in this slide"),
});

export type HomeHeroSlideFormValues = z.infer<typeof homeHeroSlideFormSchema>;

export function emptyHomeHeroFormValues(): HomeHeroSlideFormValues {
  return {
    theme: "LIGHT",
    usePrimaryHeading: false,
    isActive: true,
    eyebrow: "",
    title: "",
    description: "",
    productVariantId: "",
    productImageId: "",
  };
}
