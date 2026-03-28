import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { ArrowLeft } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import {
  type OrderPublic,
  getGetOrdersOrderIdQueryKey,
  getGetOrdersQueryKey,
  useGetOrdersOrderId,
  usePatchOrdersOrderId,
} from "@/core/api/generated/api";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
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
  return new Date(iso).toLocaleString("en-PK", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatMoney(n: number) {
  return `Rs. ${n.toLocaleString("en-PK")}`;
}

export function AdminOrderDetailPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const id = orderId?.trim() ?? "";
  const queryClient = useQueryClient();

  const { data, isPending, isError, refetch } = useGetOrdersOrderId(id, {
    query: { enabled: !!id, retry: false },
  });

  const order = data ? mapOrderPublicToOrder(data) : null;

  const patchStatus = usePatchOrdersOrderId({
    mutation: {
      onSuccess: (updated) => {
        queryClient.setQueryData<OrderPublic[]>(
          getGetOrdersQueryKey(ORDERS_LIST_PARAMS),
          (old) =>
            old?.map((o) => (o.id === updated.id ? updated : o)) ?? [updated],
        );
        queryClient.setQueryData(
          getGetOrdersOrderIdQueryKey(updated.id),
          updated,
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
        void queryClient.invalidateQueries({
          queryKey: getGetOrdersOrderIdQueryKey(id),
        });
      },
    },
  });

  if (!id) {
    return <Navigate to={ROUTES.admin.orders} replace />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="ghost" size="sm" className="gap-1 px-2" asChild>
          <Link to={ROUTES.admin.orders}>
            <ArrowLeft className="size-4" aria-hidden />
            All orders
          </Link>
        </Button>
      </div>

      {isPending ? (
        <p className="text-sm text-muted-foreground">Loading order…</p>
      ) : null}

      {isError ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Order not found</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p className="text-destructive">
              This order could not be loaded or no longer exists.
            </p>
            <Button type="button" variant="outline" size="sm" asChild>
              <Link to={ROUTES.admin.orders}>Back to orders</Link>
            </Button>
            <Button
              type="button"
              variant="link"
              className="h-auto p-0"
              onClick={() => void refetch()}
            >
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {order ? (
        <>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Order #{order.orderNumber}
            </h1>
            <p className="text-sm text-muted-foreground">
              Placed {formatWhen(order.placedAt)} ·{" "}
              <span className="font-mono text-xs">{order.id}</span>
            </p>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Select
                value={order.status}
                disabled={patchStatus.isPending}
                onValueChange={(v: string) =>
                  patchStatus.mutate({
                    orderId: order.id,
                    data: { status: v as OrderStatus },
                  })
                }
              >
                <SelectTrigger className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Ship to</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 text-sm">
              <p className="font-medium">{order.customerName}</p>
              <p className="text-muted-foreground">{order.phone}</p>
              <p className="pt-2">{order.shippingAddress}</p>
              <p>{order.city}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Items</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {order.lines.map((l) => (
                  <li
                    key={l.id ?? `${order.id}-${l.productName}-${l.sku}`}
                    className="flex flex-wrap justify-between gap-2 border-b border-border pb-3 last:border-0 last:pb-0"
                  >
                    <span>
                      {l.productName} · {l.type}
                      {l.sku ? ` · ${l.sku}` : ""} ×{l.qty}
                    </span>
                    <span className="tabular-nums font-medium">
                      {l.lineTotal != null ? formatMoney(l.lineTotal) : "—"}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 pt-6">
              <div className="text-sm text-muted-foreground">
                Payment:{" "}
                <span className="font-medium uppercase text-foreground">
                  {order.payment}
                </span>
              </div>
              <div className="text-lg font-semibold tabular-nums">
                Total {formatMoney(order.total)}
              </div>
            </CardContent>
          </Card>
        </>
      ) : null}
    </div>
  );
}
