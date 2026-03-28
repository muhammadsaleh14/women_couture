import { Link } from "react-router-dom";
import { History } from "lucide-react";
import type { ProductWithVariants } from "@/core/api/generated/api";
import { Button } from "@/core/components/ui/button";
import { ROUTES } from "@/core/routes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";

function formatMoney(n: number | null | undefined) {
  const v = Number(n ?? 0);
  return `Rs. ${v.toLocaleString("en-PK")}`;
}

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleString("en-PK", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

type Props = {
  product: ProductWithVariants | null;
  onClose: () => void;
};

export function ProductDetailPreviewDialog({ product, onClose }: Props) {
  const open = product !== null;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) onClose();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
        {product ? (
          <>
            <DialogHeader>
              <DialogTitle>{product.name}</DialogTitle>
              <DialogDescription className="text-left">
                Product ID: <span className="font-mono text-xs">{product.id}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4">
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="text-muted-foreground">Type</dt>
                  <dd className="font-medium">{product.type}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Selling</dt>
                  <dd className="font-medium">
                    {product.isActive ? "Active" : "Inactive"}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-muted-foreground">Description</dt>
                  <dd className="mt-1 whitespace-pre-wrap text-foreground">
                    {product.description?.trim()
                      ? product.description
                      : "No description."}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Created</dt>
                  <dd>{formatDate(product.createdAt)}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Updated</dt>
                  <dd>{formatDate(product.updatedAt)}</dd>
                </div>
              </dl>

              <div>
                <h3 className="text-sm font-medium text-foreground">
                  Variants ({product.variants?.length ?? 0})
                </h3>
                <ul className="mt-3 space-y-4">
                  {[...(product.variants ?? [])]
                    .sort(
                      (a, b) =>
                        (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
                        new Date(a.createdAt).getTime() -
                          new Date(b.createdAt).getTime(),
                    )
                    .map((v, idx) => (
                    <li
                      key={v.id}
                      className="rounded-lg border border-border bg-muted/30 p-3"
                    >
                      <p className="text-xs font-medium text-muted-foreground">
                        Variant {idx + 1} of {product.variants?.length ?? 0}
                      </p>
                      <dl className="mt-2 grid gap-2 text-sm sm:grid-cols-2">
                        <div className="sm:col-span-2">
                          <dt className="text-muted-foreground">Variant ID</dt>
                          <dd className="font-mono text-xs">{v.id}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">SKU</dt>
                          <dd>{v.sku?.trim() ? v.sku : "—"}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Stock</dt>
                          <dd className="tabular-nums">{v.stockQty}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Sale price</dt>
                          <dd className="tabular-nums">
                            {formatMoney(v.salePrice)}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">
                            Purchase price
                          </dt>
                          <dd className="tabular-nums">
                            {v.purchasePrice != null
                              ? formatMoney(v.purchasePrice)
                              : "—"}
                          </dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Created</dt>
                          <dd>{formatDate(v.createdAt)}</dd>
                        </div>
                        <div>
                          <dt className="text-muted-foreground">Updated</dt>
                          <dd>{formatDate(v.updatedAt)}</dd>
                        </div>
                      </dl>
                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="gap-1.5" asChild>
                          <Link to={ROUTES.admin.variantStockMoves(v.id)}>
                            <History className="size-4" />
                            Stock moves
                          </Link>
                        </Button>
                      </div>
                      {(v.images?.length ?? 0) > 0 ? (
                        <div className="mt-3">
                          <p className="text-xs text-muted-foreground">
                            Images
                          </p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(v.images ?? []).map((img) => (
                              <a
                                key={img.id}
                                href={img.url}
                                target="_blank"
                                rel="noreferrer"
                                className="block shrink-0"
                              >
                                <img
                                  src={img.url}
                                  alt=""
                                  className="size-16 rounded-md border border-border object-cover"
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <DialogFooter className="border-0 bg-transparent p-0 sm:justify-end">
              <Button type="button" variant="outline" onClick={onClose}>
                Close
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
