import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getGetProductsProductIdQueryKey,
  getGetProductsQueryKey,
} from "@/core/api/generated/api";
import type { ProductFormValues } from "../domain/productFormSchema";
import { saveProductMultipart } from "../infrastructure/saveProductMultipart";

export function useSaveProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      productId,
      values,
    }: {
      productId?: string;
      values: ProductFormValues;
    }) => saveProductMultipart(productId, values),
    onSuccess: (_data, { productId }) => {
      void queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      if (productId) {
        void queryClient.invalidateQueries({
          queryKey: getGetProductsProductIdQueryKey(productId),
        });
      }
    },
  });
}
