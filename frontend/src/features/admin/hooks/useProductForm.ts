import { useState, useEffect, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ROUTES } from "@/core/routes";
import {
  useGetAdminProductsProductId,
  postAdminProducts,
  patchAdminProductsProductId,
  postAdminProductsProductIdVariants,
  patchAdminVariantsVariantId,
  deleteAdminVariantsVariantId,
  postAdminVariantsVariantIdImages,
  deleteAdminVariantsImagesImageId,
  type ClothingType,
} from "@/api/generated/api";
import { productFormSchema, type ProductFormValues, type ImageItem } from "./productFormSchema";

export const emptyVariant = () => ({
  id: crypto.randomUUID(),
  isNew: true,
  color: "",
  sku: "",
  salePrice: "",
  purchasePrice: "",
  images: [],
});

export function useProductForm(productId?: string, isNewProduct = false) {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  // 1. Initialize React Hook Form
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: "",
      description: "",
      type: "UNSTITCHED" as ClothingType,
      variants: [emptyVariant()],
    },
  });

  const { control, handleSubmit, reset } = form;

  // 2. Manage variant array
  const { fields: variants, append, remove, update } = useFieldArray({
    control,
    name: "variants",
  });

  // 3. Hydrate form if editing
  const { data: existing, isLoading } = useGetAdminProductsProductId(
    productId || "",
    { query: { enabled: !isNewProduct && !!productId } },
  );

  useEffect(() => {
    if (existing) {
      reset({
        name: existing.name,
        description: existing.description || "",
        type: existing.type,
        variants: existing.variants && existing.variants.length > 0
          ? existing.variants.map((v) => ({
              id: v.id,
              isNew: false,
              color: v.color,
              sku: v.sku || "",
              salePrice: String(v.salePrice || 0),
              purchasePrice: v.purchasePrice ? String(v.purchasePrice) : "",
              images: (v.images || []).map((img) => ({
                uid: img.id,
                preview: img.url,
              })),
            }))
          : [emptyVariant()],
      });
    }
  }, [existing, reset]);

  // 4. Image helpers (need to manually update the form array value)
  const addImagesToVariant = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const items: ImageItem[] = Array.from(files).map((f) => ({
      uid: crypto.randomUUID(),
      preview: URL.createObjectURL(f),
      file: f,
    }));

    const currentVariant = form.getValues(`variants.${index}`);
    update(index, {
      ...currentVariant,
      images: [...currentVariant.images, ...items],
    });
  };

  const removeVariantImage = async (variantIndex: number, imgUid: string) => {
    const currentVariant = form.getValues(`variants.${variantIndex}`);
    const img = currentVariant.images.find((i) => i.uid === imgUid);

    // If it's an existing DB image, delete it from the server immediately
    if (img && !img.file) {
      try {
        await deleteAdminVariantsImagesImageId(imgUid);
      } catch (err) {
        console.error("Failed to delete image:", err);
        alert("Failed to delete image");
        return;
      }
    }

    // Update local state
    update(variantIndex, {
      ...currentVariant,
      images: currentVariant.images.filter((i) => i.uid !== imgUid),
    });
  };

  const removeVariant = async (index: number) => {
    const variantRow = form.getValues(`variants.${index}`);
    
    // If it's an existing DB variant, delete from server immediately
    if (!variantRow.isNew) {
      try {
        await deleteAdminVariantsVariantId(variantRow.id);
      } catch (err) {
        console.error("Failed to delete variant:", err);
        alert("Failed to delete variant");
        return;
      }
    }

    remove(index);
  };

  // 5. Submit handler
  const onSubmit = async (values: ProductFormValues) => {
    setSaving(true);
    try {
      if (isNewProduct) {
        /* --- CREATE --- */
        const result = await postAdminProducts({
          name: values.name,
          description: values.description || undefined,
          type: values.type,
          variants: values.variants.map((v) => ({
            color: v.color,
            sku: v.sku || undefined,
            salePrice: Number(v.salePrice || 0),
            purchasePrice: v.purchasePrice ? Number(v.purchasePrice) : undefined,
          })),
        });

        // Upload images to the newly created variants
        for (let i = 0; i < values.variants.length; i++) {
          const createdVariant = result.variants[i];
          if (!createdVariant) continue;
          for (const img of values.variants[i].images) {
            if (img.file) {
              await postAdminVariantsVariantIdImages(createdVariant.id, {
                image: img.file,
              });
            }
          }
        }
      } else if (productId) {
        /* --- EDIT --- */

        // 1. Update product-level fields
        await patchAdminProductsProductId(productId, {
          name: values.name,
          description: values.description || undefined,
          type: values.type,
        });

        // 2. Handle each variant
        for (const v of values.variants) {
          if (v.isNew) {
            // Create new variant
            const created = await postAdminProductsProductIdVariants(productId, {
              color: v.color,
              sku: v.sku || undefined,
              salePrice: Number(v.salePrice || 0),
              purchasePrice: v.purchasePrice ? Number(v.purchasePrice) : undefined,
            });

            // Upload images for new variant
            const createdId = (created as unknown as { id: string }).id;
            for (const img of v.images) {
              if (img.file) {
                await postAdminVariantsVariantIdImages(createdId, {
                  image: img.file,
                });
              }
            }
          } else {
            // Update existing variant details
            await patchAdminVariantsVariantId(v.id, {
              color: v.color,
              sku: v.sku || undefined,
              salePrice: Number(v.salePrice || 0),
              purchasePrice: v.purchasePrice ? Number(v.purchasePrice) : undefined,
            });

            // Upload only NEW image files
            for (const img of v.images) {
              if (img.file) {
                await postAdminVariantsVariantIdImages(v.id, {
                  image: img.file,
                });
              }
            }
          }
        }
      }

      navigate(ROUTES.admin.products);
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  return {
    form,
    variants, // the field array fields
    appendVariant: () => append(emptyVariant()),
    removeVariant,
    addImagesToVariant,
    removeVariantImage,
    save: handleSubmit(onSubmit),
    saving,
    isLoading,
    isNewProduct,
  };
}
