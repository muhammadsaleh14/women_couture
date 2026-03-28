import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Eye, Plus } from "lucide-react";
import { Button } from "@/core/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { Switch } from "@/core/components/ui/switch";
import { ROUTES } from "@/core/routes";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetProductsQueryKey,
  useGetProducts,
  usePatchProductsProductId,
  type ProductWithVariants,
} from "@/core/api/generated/api";
import { ProductDetailPreviewDialog } from "./ProductDetailPreviewDialog";

const PAGE_SIZE = 20;

export function AdminProductsPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(0);
  const [previewProduct, setPreviewProduct] = useState<ProductWithVariants | null>(
    null,
  );
  const skip = page * PAGE_SIZE;

  const { data, isLoading, error } = useGetProducts({
    skip,
    take: PAGE_SIZE,
  });

  const toggleActiveMutation = usePatchProductsProductId({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
      },
    },
  });

  const total = data?.total ?? 0;
  const rows = data?.items ?? [];

  const pageCount = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total],
  );

  const canPrev = page > 0;
  const canNext = (page + 1) * PAGE_SIZE < total;

  useEffect(() => {
    if (!isLoading && total > 0 && skip >= total) {
      setPage(Math.max(0, Math.ceil(total / PAGE_SIZE) - 1));
    }
  }, [isLoading, skip, total]);

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading products...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Failed to load products.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground">
            Toggle visibility or open an item to edit.
          </p>
        </div>
        <Button asChild>
          <Link to={ROUTES.admin.productNew} className="gap-1.5">
            <Plus className="size-4" />
            Add new suit
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16" />
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-center">Selling</TableHead>
              <TableHead className="w-36 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => {
              const totalStock =
                p.variants?.reduce((s, v) => s + (v.stockQty ?? 0), 0) ?? 0;
              const firstVariant = p.variants?.[0];
              const thumb =
                firstVariant?.images?.[0]?.url ||
                "https://placehold.co/100x100?text=No+Image";
              const price = firstVariant?.salePrice ?? 0;
              const subCategoryType = p.type;
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <img
                      src={thumb}
                      alt=""
                      className="size-12 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {subCategoryType}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    Rs. {Number(price).toLocaleString("en-PK")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {totalStock}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={p.isActive}
                      onCheckedChange={(v: boolean) => {
                        toggleActiveMutation.mutate({
                          productId: p.id,
                          data: { isActive: v },
                        });
                      }}
                      disabled={toggleActiveMutation.isPending}
                      aria-label={`Selling ${p.name}`}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap items-center justify-end gap-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        aria-label={`View details for ${p.name}`}
                        onClick={() => setPreviewProduct(p)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link to={ROUTES.admin.productEdit(p.id)}>Edit</Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {total > 0 ? (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {skip + 1}–{Math.min(skip + rows.length, total)} of {total}
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canPrev}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className="gap-1"
            >
              <ChevronLeft className="size-4" />
              Previous
            </Button>
            <span className="min-w-24 text-center text-sm tabular-nums text-muted-foreground">
              Page {page + 1} / {pageCount}
            </span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!canNext}
              onClick={() => setPage((p) => p + 1)}
              className="gap-1"
            >
              Next
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}

      <ProductDetailPreviewDialog
        product={previewProduct}
        onClose={() => setPreviewProduct(null)}
      />
    </div>
  );
}
