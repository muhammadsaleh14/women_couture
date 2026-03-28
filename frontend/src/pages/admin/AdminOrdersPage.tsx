import { useMemo, useState, type MouseEvent } from "react";
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
import { mockOrders } from "@/modules/order/domain/mock-orders";
import type { Order, OrderStatus } from "@/shared/model/types";

function formatWhen(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(() =>
    [...mockOrders].sort(
      (a, b) => new Date(b.placedAt).getTime() - new Date(a.placedAt).getTime(),
    ),
  );
  const [openId, setOpenId] = useState<string | null>(null);
  const selected = useMemo(
    () => orders.find((o) => o.id === openId) ?? null,
    [orders, openId],
  );

  const setStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">Newest first — prototype data.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>When</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
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
                <TableCell className="whitespace-nowrap text-sm">
                  {formatWhen(o.placedAt)}
                </TableCell>
                <TableCell>
                  <div className="font-medium">{o.customerName}</div>
                  <div className="text-xs text-muted-foreground">{o.phone}</div>
                </TableCell>
                <TableCell className="max-w-[200px] text-sm text-muted-foreground">
                  {o.lines.map((l) => (
                    <div key={`${o.id}-${l.productName}-${l.color}`}>
                      {l.productName} · {l.type} · {l.color} ×{l.qty}
                    </div>
                  ))}
                </TableCell>
                <TableCell className="uppercase">{o.payment}</TableCell>
                <TableCell onClick={(e: MouseEvent) => e.stopPropagation()}>
                  <Select
                    value={o.status}
                    onValueChange={(v: string) =>
                      setStatus(o.id, v as OrderStatus)
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
            <DialogTitle>Order {selected?.id}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3 text-sm">
              <div>
                <Label className="text-muted-foreground">Ship to</Label>
                <p className="mt-1 font-medium">{selected.customerName}</p>
                <p className="text-muted-foreground">{selected.phone}</p>
                <p className="mt-2 text-foreground">
                  {selected.shippingAddress}
                </p>
                <p className="text-foreground">{selected.city}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
