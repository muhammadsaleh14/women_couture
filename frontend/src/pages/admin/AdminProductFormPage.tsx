import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  useGetProductsProductId,
  postProducts,
  patchProductsProductId,
  postProductsProductIdVariants,
  patchVariantsVariantId,
  deleteVariantsVariantId,
  postVariantsVariantIdImages,
  deleteVariantsImagesImageId,
} from "@/core/api/generated/api";
import { ROUTES } from "@/core/routes";
import { mapAdminProductDetailToFormValues } from "@/modules/product/infrastructure/mapAdminProductDetailToFormValues";
import { ProductFormUI } from "@/modules/product/presentation/ProductFormUI";
import type { ProductFormValues } from "@/modules/product/domain/productFormSchema";

export function AdminProductFormPage() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const isNewProduct = !productId;
  const [saving, setSaving] = useState(false);

  const { data: existing, isLoading } = useGetProductsProductId(
    productId || "",
    { query: { enabled: !isNewProduct && !!productId } },
  );

  const formValues = useMemo(
    () => (existing ? mapAdminProductDetailToFormValues(existing) : undefined),
    [existing],
  );

  const handleSubmit = async (values: ProductFormValues) => {
    setSaving(true);
    try {
      if (isNewProduct) {
        const result = await postProducts({
          name: values.name,
          description: values.description || undefined,
          type: values.type,
          variants: values.variants.map((v) => ({
            color: v.color,
            sku: v.sku || undefined,
            salePrice: Number(v.salePrice || 0),
            purchasePrice: v.purchasePrice
              ? Number(v.purchasePrice)
              : undefined,
          })),
        });

        for (let i = 0; i < values.variants.length; i++) {
          const createdVariant = result.variants[i];
          if (!createdVariant) continue;
          for (const img of values.variants[i].images) {
            if (img.file) {
              await postVariantsVariantIdImages(createdVariant.id, {
                image: img.file,
              });
            }
          }
        }
      } else if (productId) {
        await patchProductsProductId(productId, {
          name: values.name,
          description: values.description || undefined,
          type: values.type,
        });

        for (const v of values.variants) {
          if (v.isNew) {
            const created = await postProductsProductIdVariants(productId, {
              color: v.color,
              sku: v.sku || undefined,
              salePrice: Number(v.salePrice || 0),
              purchasePrice: v.purchasePrice
                ? Number(v.purchasePrice)
                : undefined,
            });

            const createdId = (created as unknown as { id: string }).id;
            for (const img of v.images) {
              if (img.file) {
                await postVariantsVariantIdImages(createdId, {
                  image: img.file,
                });
              }
            }
          } else {
            await patchVariantsVariantId(v.id, {
              color: v.color,
              sku: v.sku || undefined,
              salePrice: Number(v.salePrice || 0),
              purchasePrice: v.purchasePrice
                ? Number(v.purchasePrice)
                : undefined,
            });

            for (const img of v.images) {
              if (img.file) {
                await postVariantsVariantIdImages(v.id, {
                  image: img.file,
                });
              }
            }
          }
        }
      }

      toast.success("Product saved successfully");
      navigate(ROUTES.admin.products);
    } catch (err) {
      console.error("Failed to save product:", err);
      toast.error("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteExistingImage = async (imageId: string) => {
    try {
      await deleteVariantsImagesImageId(imageId);
    } catch (err) {
      console.error("Failed to delete image:", err);
      toast.error("Failed to delete image");
      throw err;
    }
  };

  const handleDeleteExistingVariant = async (variantId: string) => {
    try {
      await deleteVariantsVariantId(variantId);
    } catch (err) {
      console.error("Failed to delete variant:", err);
      toast.error("Failed to delete variant");
      throw err;
    }
  };

  if (!isNewProduct && isLoading) {
    return (
      <div className="p-8 text-stone-500">Loading product details...</div>
    );
  }

  if (!isNewProduct && !existing) {
    return (
      <div className="p-8 text-stone-600">
        Product not found or could not be loaded.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-stone-900">
          {isNewProduct ? "Add Product" : "Edit Product"}
        </h1>
        <p className="text-sm text-stone-600">
          Fill in the product details and its variants.
        </p>
      </div>

      <ProductFormUI
        key={productId ?? "new"}
        values={isNewProduct ? undefined : formValues}
        onSubmit={(vals) => void handleSubmit(vals)}
        isSaving={saving}
        onCancel={() => navigate(ROUTES.admin.products)}
        onDeleteExistingImage={handleDeleteExistingImage}
        onDeleteExistingVariant={handleDeleteExistingVariant}
      />
    </div>
  );
}
