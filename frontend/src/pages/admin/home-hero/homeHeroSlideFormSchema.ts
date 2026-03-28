import { z } from "zod";

export const homeHeroSlideFormSchema = z
  .object({
    theme: z.enum(["LIGHT", "DARK"]),
    usePrimaryHeading: z.boolean(),
    isActive: z.boolean(),
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    productVariantId: z.string(),
  })
  .superRefine((data, ctx) => {
    const hasVariant = data.productVariantId.trim().length > 0;
    const hasTitle = data.title.trim().length > 0;
    if (!hasVariant && !hasTitle) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a title or choose a product variant",
        path: ["title"],
      });
    }
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
  };
}
