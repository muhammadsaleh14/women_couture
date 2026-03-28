import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useMemo, type MouseEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  type OrderPublic,
  getGetOrdersQueryKey,
  useGetOrders,
  usePatchOrdersOrderId,
} from "@/core/api/generated/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { ROUTES } from "@/core/routes";
import { mapOrderPublicToOrder } from "@/modules/order/infrastructure/order.mapper";
import type { OrderStatus } from "@/shared/model/types";

const ORDERS_LIST_PARAMS = { take: 100 } as const;

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
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: orderRows,
    isPending,
    isError,
    refetch,
  } = useGetOrders(ORDERS_LIST_PARAMS);

  const orders = useMemo(
    () => (orderRows ?? []).map(mapOrderPublicToOrder),
    [orderRows],
  );

  const patchStatus = usePatchOrdersOrderId({
    mutation: {
      onSuccess: (updated) => {
        queryClient.setQueryData<OrderPublic[]>(
          getGetOrdersQueryKey(ORDERS_LIST_PARAMS),
          (old) =>
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
        void queryClient.invalidateQueries({
          queryKey: getGetOrdersQueryKey(ORDERS_LIST_PARAMS),
        });
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Orders</h1>
        <p className="text-sm text-muted-foreground">
          Newest first — click a row to open the full order page.
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
                onClick={() => navigate(ROUTES.admin.order(o.id))}
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
                      patchStatus.variables?.orderId === o.id
                    }
                    onValueChange={(v: string) =>
                      patchStatus.mutate({
                        orderId: o.id,
                        data: { status: v as OrderStatus },
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
    </div>
  );
}
