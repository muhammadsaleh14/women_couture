import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetProductsQueryKey,
  useGetProducts,
  usePostVariantsVariantIdStock,
  type PostVariantsVariantIdStockBodyType,
} from "@/core/api/generated/api";
import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { ROUTES } from "@/core/routes";
import { toast } from "sonner";

type StockRow = {
  productId: string;
  productName: string;
  variantId: string;
  color: string;
  sku: string | null;
  stockQty: number;
};

type AdjustKind = PostVariantsVariantIdStockBodyType;

const ADJUST_LABELS: Record<AdjustKind, string> = {
  IN: "Add to stock",
  OUT: "Remove from stock",
  ADJUSTMENT: "Set total to",
};

export function AdminStockPage() {
  const queryClient = useQueryClient();
  const { data: products, isLoading, error } = useGetProducts({
    take: 100,
  });

  const rows = useMemo<StockRow[]>(() => {
    if (!products?.length) return [];
    const out: StockRow[] = [];
    for (const p of products) {
      for (const v of p.variants ?? []) {
        out.push({
          productId: p.id,
          productName: p.name,
          variantId: v.id,
          color: v.color,
          sku: v.sku,
          stockQty: v.stockQty,
        });
      }
    }
    return out;
  }, [products]);

  const [dialogRow, setDialogRow] = useState<StockRow | null>(null);
  const [kind, setKind] = useState<AdjustKind>("IN");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");

  const stockMutation = usePostVariantsVariantIdStock({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
        toast.success("Stock updated");
        setDialogRow(null);
      },
      onError: (err: unknown) => {
        const msg =
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "data" in err.response &&
          err.response.data &&
          typeof err.response.data === "object" &&
          "message" in err.response.data
            ? String((err.response.data as { message: unknown }).message)
            : "Could not update stock";
        toast.error(msg);
      },
    },
  });

  const openDialog = (row: StockRow) => {
    setDialogRow(row);
    setKind("IN");
    setQuantity("1");
    setNotes("");
  };

  const submitAdjust = () => {
    if (!dialogRow) return;
    const q = parseInt(quantity, 10);
    if (!Number.isFinite(q) || q < 1) {
      toast.error("Enter a whole number ≥ 1");
      return;
    }
    if (kind === "OUT" && q > dialogRow.stockQty) {
      toast.error("Cannot remove more than current stock");
      return;
    }
    stockMutation.mutate({
      variantId: dialogRow.variantId,
      data: { type: kind, quantity: q, notes: notes.trim() || undefined },
    });
  };

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
              <TableHead>Color</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead className="text-right tabular-nums">On hand</TableHead>
              <TableHead className="w-32" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
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
                  <TableCell className="text-muted-foreground">{row.color}</TableCell>
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
                      onClick={() => openDialog(row)}
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

      <Dialog
        open={dialogRow !== null}
        onOpenChange={(open) => !open && setDialogRow(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adjust stock</DialogTitle>
            <DialogDescription>
              {dialogRow ? (
                <>
                  <span className="font-medium text-foreground">
                    {dialogRow.productName}
                  </span>
                  {" · "}
                  {dialogRow.color}
                  <span className="mt-1 block text-muted-foreground">
                    Current on hand:{" "}
                    <span className="tabular-nums font-medium">
                      {dialogRow.stockQty}
                    </span>
                  </span>
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="stock-kind">Movement</Label>
              <Select
                value={kind}
                onValueChange={(v) => setKind(v as AdjustKind)}
              >
                <SelectTrigger id="stock-kind">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(ADJUST_LABELS) as AdjustKind[]).map((k) => (
                    <SelectItem key={k} value={k}>
                      {ADJUST_LABELS[k]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {kind === "IN" && "Units received into inventory."}
                {kind === "OUT" && "Units sold or written off."}
                {kind === "ADJUSTMENT" &&
                  "New total quantity on hand (API requires a positive number; use Remove to reach zero)."}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock-qty">Quantity</Label>
              <Input
                id="stock-qty"
                type="number"
                min={1}
                step={1}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock-notes">Notes (optional)</Label>
              <Input
                id="stock-notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. supplier delivery #12"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogRow(null)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void submitAdjust()}
              disabled={stockMutation.isPending}
            >
              {stockMutation.isPending ? "Saving…" : "Apply"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
