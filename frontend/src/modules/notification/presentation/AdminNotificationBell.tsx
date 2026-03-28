import { useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getGetNotificationsQueryKey,
  useGetNotifications,
  usePatchNotificationsNotificationIdRead,
} from "@/core/api/generated/api";
import { Badge } from "@/core/components/ui/badge";
import { Button } from "@/core/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/core/components/ui/sheet";
import { ROUTES } from "@/core/routes";
import { cn } from "@/core/lib/utils";

const NOTIFICATION_LIST_PARAMS = { take: 50 } as const;

function formatWhen(iso: string) {
  return new Date(iso).toLocaleString("en-PK", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function AdminNotificationBell() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: items = [] } = useGetNotifications(NOTIFICATION_LIST_PARAMS, {
    query: {
      refetchInterval: 45_000,
      refetchOnWindowFocus: true,
    },
  });

  const unread = items.filter((n) => !n.read).length;

  const markRead = usePatchNotificationsNotificationIdRead({
    mutation: {
      onSuccess: () => {
        void queryClient.invalidateQueries({
          queryKey: getGetNotificationsQueryKey(NOTIFICATION_LIST_PARAMS),
        });
      },
    },
  });

  async function onSelectNotification(n: (typeof items)[number]) {
    try {
      if (!n.read) {
        await markRead.mutateAsync({ notificationId: n.id });
      }
    } finally {
      setSheetOpen(false);
      if (n.orderId) {
        navigate(ROUTES.admin.ordersOpen(n.orderId));
      }
    }
  }

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="relative shrink-0"
          aria-label={`Notifications${unread ? `, ${unread} unread` : ""}`}
        >
          <Bell className="size-5" aria-hidden />
          {unread > 0 ? (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unread > 9 ? "9+" : unread}
            </Badge>
          ) : null}
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        <div className="flex min-h-0 flex-1 flex-col gap-1 overflow-y-auto px-4 pb-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">No notifications yet.</p>
          ) : (
            items.map((n) => (
              <button
                key={n.id}
                type="button"
                onClick={() => void onSelectNotification(n)}
                disabled={markRead.isPending}
                className={cn(
                  "w-full rounded-lg border border-border p-3 text-left transition-colors hover:bg-accent",
                  !n.read && "border-primary/40 bg-primary/5",
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-medium text-foreground">{n.title}</span>
                  {!n.read ? (
                    <span className="size-2 shrink-0 rounded-full bg-primary" />
                  ) : null}
                </div>
                {n.body ? (
                  <p className="mt-1 text-xs text-muted-foreground">{n.body}</p>
                ) : null}
                <p className="mt-2 text-xs text-muted-foreground">
                  {formatWhen(n.createdAt)}
                </p>
              </button>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
