import { useEffect, useMemo, type ChangeEvent } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productFormSchema,
  type ProductFormValues,
  type ImageItem,
} from "../domain/productFormSchema";
import { emptyVariant, defaultProductFormValues } from "../domain/defaults";

export interface UseProductFormOptions {
  values?: ProductFormValues;
  onDeleteExistingImage?: (imageId: string) => Promise<void>;
  onDeleteExistingVariant?: (variantId: string) => Promise<void>;
}

export function useProductForm(options: UseProductFormOptions) {
  const {
    values: controlledValues,
    onDeleteExistingImage,
    onDeleteExistingVariant,
  } = options;

  const defaultValues = useMemo(() => defaultProductFormValues(), []);

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
  });

  useEffect(() => {
    if (controlledValues !== undefined) {
      form.reset(controlledValues);
    } else {
      form.reset(defaultProductFormValues());
    }
  }, [controlledValues, form]);

  const { control } = form;

  const { fields: variants, append, remove, update } = useFieldArray({
    control,
    name: "variants",
  });

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

    if (img && !img.file && onDeleteExistingImage) {
      try {
        await onDeleteExistingImage(imgUid);
      } catch {
        return;
      }
    }

    update(variantIndex, {
      ...currentVariant,
      images: currentVariant.images.filter((i) => i.uid !== imgUid),
    });
  };

  const removeVariant = async (index: number) => {
    const variantRow = form.getValues(`variants.${index}`);

    if (!variantRow.isNew && onDeleteExistingVariant) {
      try {
        await onDeleteExistingVariant(variantRow.id);
      } catch {
        return;
      }
    }

    remove(index);
  };

  return {
    form,
    variants,
    appendVariant: () => append(emptyVariant()),
    removeVariant,
    addImagesToVariant,
    removeVariantImage,
  };
}
