import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";
import {
  useGetVariantsVariantIdStockMoves,
  type StockMoveRecordType,
} from "@/core/api/generated/api";
import { Button } from "@/core/components/ui/button";
import { ROUTES } from "@/core/routes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { AdjustStockDialog, type StockAdjustRow } from "./AdjustStockDialog";

const MOVE_LABELS: Record<StockMoveRecordType, string> = {
  IN: "Stock in",
  OUT: "Stock out",
  ADJUSTMENT: "Adjustment",
};

function formatWhen(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

export function AdminVariantStockMovesPage() {
  const { variantId = "" } = useParams<{ variantId: string }>();
  const [adjustRow, setAdjustRow] = useState<StockAdjustRow | null>(null);

  const { data, isLoading, error } = useGetVariantsVariantIdStockMoves(variantId, {
    query: { enabled: !!variantId },
  });

  const dialogRow = useMemo((): StockAdjustRow | null => {
    if (!data) return null;
    return {
      productId: data.productId,
      productName: data.productName,
      variantId: data.variantId,
      sku: data.sku,
      stockQty: data.stockQty,
    };
  }, [data]);

  if (!variantId) {
    return (
      <div className="p-8 text-muted-foreground">Missing variant.</div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-8 text-muted-foreground">Loading stock history…</div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4 p-8">
        <p className="text-destructive">Could not load this variant.</p>
        <Button variant="outline" size="sm" asChild>
          <Link to={ROUTES.admin.products} className="gap-1.5">
            <ArrowLeft className="size-4" />
            Back to products
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-1">
          <Button variant="ghost" size="sm" className="-ml-2 gap-1.5" asChild>
            <Link to={ROUTES.admin.products}>
              <ArrowLeft className="size-4" />
              Products
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold text-foreground">
            Stock moves
          </h1>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">
              {data.productName}
            </span>
            {data.sku ? (
              <>
                {" "}
                · SKU <span className="tabular-nums">{data.sku}</span>
              </>
            ) : null}
          </p>
          <p className="text-sm text-muted-foreground">
            Variant ID:{" "}
            <span className="font-mono text-xs text-foreground">
              {data.variantId}
            </span>
          </p>
          <p className="text-sm">
            <span className="text-muted-foreground">On hand:</span>{" "}
            <span className="font-semibold tabular-nums text-foreground">
              {data.stockQty}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => setAdjustRow(dialogRow)}
            disabled={!dialogRow}
          >
            <Package className="size-4" />
            Adjust stock
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link to={ROUTES.admin.productEdit(data.productId)}>
              Edit product
            </Link>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right tabular-nums">Quantity</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="hidden font-mono text-xs lg:table-cell">
                Move ID
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.moves.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-10 text-center text-muted-foreground"
                >
                  No stock movements yet. Use Adjust stock to record changes.
                </TableCell>
              </TableRow>
            ) : (
              data.moves.map((m) => (
                <TableRow key={m.id}>
                  <TableCell className="whitespace-nowrap text-sm">
                    {formatWhen(m.createdAt)}
                  </TableCell>
                  <TableCell className="text-sm">
                    {MOVE_LABELS[m.type]}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-sm">
                    {m.quantity}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-sm text-muted-foreground">
                    {m.notes?.trim() ? m.notes : "—"}
                  </TableCell>
                  <TableCell className="hidden font-mono text-xs text-muted-foreground lg:table-cell">
                    {m.id}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <AdjustStockDialog
        row={adjustRow}
        onClose={() => setAdjustRow(null)}
        invalidateProductDetailId={data.productId}
        invalidateVariantStockMovesId={data.variantId}
      />
    </div>
  );
}
