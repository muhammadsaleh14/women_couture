import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useMemo, useState, type MouseEvent } from "react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Label } from "@/core/components/ui/label";
import {
  fetchOrders,
  patchOrderStatus,
} from "@/modules/order/infrastructure/orders.api";
import type { Order, OrderStatus } from "@/shared/model/types";

const ORDERS_QUERY_KEY = ["admin-orders"] as const;

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatMoney(n: number) {
  return `Rs. ${n.toLocaleString("en-PK")}`;
}

export function AdminOrdersPage() {
  const queryClient = useQueryClient();
  const { data: orders = [], isPending, isError, refetch } = useQuery({
    queryKey: ORDERS_QUERY_KEY,
    queryFn: () => fetchOrders({ take: 100 }),
  });

  const patchStatus = useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: string;
      status: OrderStatus;
    }) => patchOrderStatus(id, status),
    onSuccess: (updated) => {
      queryClient.setQueryData<Order[]>(ORDERS_QUERY_KEY, (old) =>
        old?.map((o) => (o.id === updated.id ? updated : o)) ?? [updated],
      );
    },
    onError: (err: unknown) => {
      const msg =
        isAxiosError(err) &&
        err.response?.data &&
        typeof err.response.data === "object" &&
        "message" in err.response.data
          ? String((err.response.data as { message: unknown }).message)
          : "Could not update status.";
      toast.error(msg);
      void queryClient.invalidateQueries({ queryKey: ORDERS_QUERY_KEY });
    },
  });

  const [openId, setOpenId] = useState<string | null>(null);
  const selected = useMemo(
    () => orders.find((o) => o.id === openId) ?? null,
    [orders, openId],
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Newest first — loaded from the server.
        </p>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading orders…</p>
      ) : null}
      {isError ? (
        <p className="text-sm text-destructive">
          Could not load orders.{" "}
          <button
            type="button"
            className="underline"
            onClick={() => void refetch()}
          >
            Retry
          </button>
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">#</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="w-40">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((o) => (
              <TableRow
                key={o.id}
                className="cursor-pointer"
                onClick={() => setOpenId(o.id)}
              >
                <TableCell className="font-mono text-sm tabular-nums">
                  {o.orderNumber}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm">
                  {formatWhen(o.placedAt)}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{o.customerName}</div>
                  <div className="text-xs text-muted-foreground">{o.phone}</div>
                </TableCell>
                <TableCell className="max-w-[200px] text-sm text-muted-foreground">
                  {o.lines.map((l) => (
                    <div key={l.id ?? `${o.id}-${l.productName}-${l.sku ?? "x"}`}>
                      {l.productName} · {l.type}
                      {l.sku ? ` · ${l.sku}` : ""} ×{l.qty}
                    </div>
                  ))}
                </TableCell>
                <TableCell className="whitespace-nowrap text-sm font-medium tabular-nums">
                  {formatMoney(o.total)}
                </TableCell>
                <TableCell className="uppercase">{o.payment}</TableCell>
                <TableCell onClick={(e: MouseEvent) => e.stopPropagation()}>
                  <Select
                    value={o.status}
                    disabled={
                      patchStatus.isPending &&
                      patchStatus.variables?.id === o.id
                    }
                    onValueChange={(v: string) =>
                      patchStatus.mutate({
                        id: o.id,
                        status: v as OrderStatus,
                      })
                    }
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                    </SelectContent>
                  </Select>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog
        open={!!selected}
        onOpenChange={(open: boolean) => !open && setOpenId(null)}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              Order #{selected?.orderNumber}{" "}
              <span className="font-normal text-muted-foreground">
                ({selected?.id})
              </span>
            </DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <div>
                <Label className="text-muted-foreground">Ship to</Label>
                <p className="mt-1 font-medium">{selected.customerName}</p>
                <p className="text-muted-foreground">{selected.phone}</p>
                <p className="mt-2 text-foreground">
                  {selected.shippingAddress}
                </p>
                <p className="text-foreground">{selected.city}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Items</Label>
                <ul className="mt-2 space-y-2">
                  {selected.lines.map((l) => (
                    <li
                      key={l.id ?? `${selected.id}-${l.productName}-${l.sku}`}
                      className="flex justify-between gap-2 border-b border-border pb-2 last:border-0"
                    >
                      <span>
                        {l.productName} · {l.type}
                        {l.sku ? ` · ${l.sku}` : ""} ×{l.qty}
                      </span>
                      <span className="shrink-0 tabular-nums">
                        {l.lineTotal != null
                          ? formatMoney(l.lineTotal)
                          : "—"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span>Total</span>
                <span className="tabular-nums">{formatMoney(selected.total)}</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-muted-foreground">
                <span>
                  Payment:{" "}
                  <span className="text-foreground uppercase">
                    {selected.payment}
                  </span>
                </span>
                <span>
                  Status:{" "}
                  <span className="capitalize text-foreground">
                    {selected.status}
                  </span>
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
