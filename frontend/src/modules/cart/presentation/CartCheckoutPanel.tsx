import { isAxiosError } from "axios";
import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/core/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/core/components/ui/radio-group";
import { Separator } from "@/core/components/ui/separator";
import { ROUTES } from "@/core/routes";
import { usePostOrders } from "@/core/api/generated/api";
import { useCartStore } from "@/modules/cart/application/cart-store";
import type { PaymentMethod } from "@/shared/model/types";
import { PriceBlock } from "@/shared/components/product/PriceBlock";

type Props = {
  /** `sheet`: opened from header/drawer; `page`: full /cart route */
  mode: "sheet" | "page";
  /** Close drawer (sheet mode) — e.g. after checkout or “Continue shopping” */
  onDismiss?: () => void;
};

export function CartCheckoutPanel({ mode, onDismiss }: Props) {
  const { lines, setQty, removeLine, clear } = useCartStore();
  const placeOrderMutation = usePostOrders({
    mutation: {
      onSuccess: (order) => {
        toast.success(`Order #${order.orderNumber} placed.`);
        clear();
        onDismiss?.();
      },
      onError: (err: unknown) => {
        const msg =
          isAxiosError(err) &&
          err.response?.data &&
          typeof err.response.data === "object" &&
          "message" in err.response.data
            ? String((err.response.data as { message: unknown }).message)
            : "Could not place order. Try again.";
        toast.error(msg);
      },
    },
  });
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const subtotal = lines.reduce((s, l) => s + l.unitPrice * l.qty, 0);

  const placeOrder = () => {
    if (!lines.length) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!name.trim() || !phone.trim() || !city.trim() || !address.trim()) {
      toast.error("Please fill in all shipping fields.");
      return;
    }
    placeOrderMutation.mutate({
      data: {
        customerName: name.trim(),
        phone: phone.trim(),
        shippingAddress: address.trim(),
        city: city.trim(),
        payment,
        items: lines.map((l) => ({ variantId: l.variantId, qty: l.qty })),
      },
    });
  };

  const continueShopping =
    mode === "sheet" ? (
      <Button type="button" variant="link" className="h-auto p-0" onClick={onDismiss}>
        Continue shopping
      </Button>
    ) : (
      <Link to={ROUTES.home} className="text-sm font-medium text-primary underline-offset-4 hover:underline">
        Continue shopping
      </Link>
    );

  return (
    <div className="space-y-6">
      {mode === "page" ? (
        <h1 className="text-xl font-semibold text-foreground">Cart & Checkout</h1>
      ) : null}

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Items
        </h2>
        {lines.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Your cart is empty. {continueShopping}
          </p>
        ) : (
          <ul className="space-y-3">
            {lines.map((line) => (
              <li key={line.lineId}>
                <Card>
                  <CardContent className="flex gap-3 p-3">
                    <img
                      src={line.imageUrl}
                      alt=""
                      className="size-20 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-medium leading-snug text-foreground">
                        {line.title}
                      </p>
                      {line.sku ? (
                        <p className="text-xs text-muted-foreground">
                          SKU: {line.sku}
                        </p>
                      ) : null}
                      <PriceBlock
                        regularPrice={line.unitPrice}
                        className="text-sm"
                      />
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Label
                          htmlFor={`qty-${mode}-${line.lineId}`}
                          className="text-xs"
                        >
                          Qty
                        </Label>
                        <Input
                          id={`qty-${mode}-${line.lineId}`}
                          type="number"
                          min={1}
                          className="h-8 w-16"
                          value={line.qty}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const n = Number(e.target.value);
                            if (!Number.isFinite(n)) {
                              return;
                            }
                            setQty(line.lineId, n);
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive"
                          onClick={() => removeLine(line.lineId)}
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </section>

      <Separator />

      <section className="space-y-4">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Shipping
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor={`ship-name-${mode}`}>Full name</Label>
            <Input
              id={`ship-name-${mode}`}
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              autoComplete="name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`ship-phone-${mode}`}>Phone</Label>
            <Input
              id={`ship-phone-${mode}`}
              value={phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
              inputMode="tel"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`ship-city-${mode}`}>City</Label>
            <Input
              id={`ship-city-${mode}`}
              value={city}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCity(e.target.value)
              }
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor={`ship-address-${mode}`}>Address</Label>
            <Input
              id={`ship-address-${mode}`}
              value={address}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAddress(e.target.value)
              }
            />
          </div>
        </div>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup
            value={payment}
            onValueChange={(v: string) => setPayment(v as PaymentMethod)}
            className="grid gap-2"
          >
            <div className="flex items-start gap-3 rounded-lg border border-border p-3">
              <RadioGroupItem value="cod" id={`pay-cod-${mode}`} className="mt-0.5" />
              <div className="space-y-1">
                <Label htmlFor={`pay-cod-${mode}`} className="font-medium">
                  Cash on Delivery (COD)
                </Label>
                <p className="text-xs text-muted-foreground">
                  Pay the exact amount to the rider when your parcel arrives.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-border p-3">
              <RadioGroupItem
                value="online"
                id={`pay-online-${mode}`}
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label htmlFor={`pay-online-${mode}`} className="font-medium">
                  Online payment
                </Label>
                <p className="text-xs text-muted-foreground">
                  Card / debit / JazzCash (prototype — not connected).
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span className="font-semibold tabular-nums text-foreground">
            Rs. {subtotal.toLocaleString("en-PK")}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="font-medium text-foreground">Total</span>
          <span className="text-lg font-semibold tabular-nums text-foreground">
            Rs. {subtotal.toLocaleString("en-PK")}
          </span>
        </div>
        <Button
          size="lg"
          className="w-full"
          onClick={placeOrder}
          disabled={placeOrderMutation.isPending}
        >
          {placeOrderMutation.isPending ? "Placing order…" : "Place order"}
        </Button>
      </div>

      {mode === "sheet" && onDismiss ? (
        <p className="text-center text-xs text-muted-foreground">
          <Link
            to={ROUTES.cart}
            className="underline-offset-4 hover:underline"
            onClick={() => onDismiss()}
          >
            Open full checkout page
          </Link>
        </p>
      ) : null}
    </div>
  );
}
