import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/core/components/ui/sheet";
import { CartCheckoutPanel } from "@/modules/cart/presentation/CartCheckoutPanel";
import { useCartStore } from "@/modules/cart/application/cart-store";

export function StorefrontCartSheet() {
  const sheetOpen = useCartStore((s) => s.sheetOpen);
  const setSheetOpen = useCartStore((s) => s.setSheetOpen);
  const closeSheet = useCartStore((s) => s.closeSheet);

  return (
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-md"
      >
        <SheetHeader className="border-b border-border px-4 py-4 text-left">
          <SheetTitle>Cart & checkout</SheetTitle>
          <SheetDescription className="sr-only">
            Review items and shipping. Close to return to the page you were on.
          </SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 py-4">
          <CartCheckoutPanel mode="sheet" onDismiss={closeSheet} />
        </div>
      </SheetContent>
    </Sheet>
  );
}
