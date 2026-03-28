import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  getGetProductsQueryKey,
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
import { toast } from "sonner";

export type StockAdjustRow = {
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

type Props = {
  row: StockAdjustRow | null;
  onClose: () => void;
};

export function AdjustStockDialog({ row, onClose }: Props) {
  const queryClient = useQueryClient();
  const [kind, setKind] = useState<AdjustKind>("IN");
  const [quantity, setQuantity] = useState("1");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!row) return;
    setKind("IN");
    setQuantity("1");
    setNotes("");
  }, [row?.variantId]);

  const stockMutation = usePostVariantsVariantIdStock({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetProductsQueryKey() });
        toast.success("Stock updated");
        onClose();
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

  const submitAdjust = () => {
    if (!row) return;
    const q = parseInt(quantity, 10);
    if (!Number.isFinite(q) || q < 1) {
      toast.error("Enter a whole number ≥ 1");
      return;
    }
    if (kind === "OUT" && q > row.stockQty) {
      toast.error("Cannot remove more than current stock");
      return;
    }
    stockMutation.mutate({
      variantId: row.variantId,
      data: { type: kind, quantity: q, notes: notes.trim() || undefined },
    });
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) onClose();
  };

  return (
    <Dialog open={row !== null} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust stock</DialogTitle>
          <DialogDescription>
            {row ? (
              <>
                <span className="font-medium text-foreground">
                  {row.productName}
                </span>
                {" · "}
                {row.color}
                <span className="mt-1 block text-muted-foreground">
                  Current on hand:{" "}
                  <span className="tabular-nums font-medium">{row.stockQty}</span>
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
          <Button type="button" variant="outline" onClick={onClose}>
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
  );
}
