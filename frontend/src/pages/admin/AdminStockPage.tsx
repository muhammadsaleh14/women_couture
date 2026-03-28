import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useGetProducts } from "@/core/api/generated/api";
import { Button } from "@/core/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { ROUTES } from "@/core/routes";
import { AdjustStockDialog, type StockAdjustRow } from "./AdjustStockDialog";

export function AdminStockPage() {
  const { data: products, isLoading, error } = useGetProducts({
    take: 100,
  });

  const rows = useMemo<StockAdjustRow[]>(() => {
    if (!products?.length) return [];
    const out: StockAdjustRow[] = [];
    for (const p of products) {
      for (const v of p.variants ?? []) {
        out.push({
          productId: p.id,
          productName: p.name,
          variantId: v.id,
          sku: v.sku,
          stockQty: v.stockQty,
        });
      }
    }
    return out;
  }, [products]);

  const [dialogRow, setDialogRow] = useState<StockAdjustRow | null>(null);

  if (isLoading) {
    return <div className="p-8 text-muted-foreground">Loading stock…</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Failed to load products.</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Stock</h1>
        <p className="text-sm text-muted-foreground">
          Adjust inventory per variant (add, remove, or set total on hand).
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right tabular-nums">On hand</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="py-10 text-center text-sm text-muted-foreground"
                >
                  No variants yet.{" "}
                  <Link
                    to={ROUTES.admin.productNew}
                    className="font-medium text-foreground underline-offset-4 hover:underline"
                  >
                    Add a product
                  </Link>
                  .
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.variantId}>
                  <TableCell className="font-medium">
                    <Link
                      to={ROUTES.admin.productEdit(row.productId)}
                      className="text-foreground underline-offset-4 hover:underline"
                    >
                      {row.productName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {row.sku || "—"}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {row.stockQty}
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setDialogRow(row)}
                    >
                      Adjust
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdjustStockDialog
        row={dialogRow}
        onClose={() => setDialogRow(null)}
      />
    </div>
  );
}
