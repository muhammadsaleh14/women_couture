import { useState, type ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/core/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/core/components/ui/radio-group";
import { Separator } from "@/core/components/ui/separator";
import { ROUTES } from "@/core/routes";
import { useCartStore } from "@/modules/cart/application/cart-store";
import type { PaymentMethod } from "@/shared/model/types";
import { PriceBlock } from "@/shared/components/product/PriceBlock";

export function CartPage() {
  const { lines, setQty, removeLine, clear } = useCartStore();
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
    toast.success("Order placed (prototype — no payment charged).");
    clear();
  };

  return (
    <div className="space-y-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-xl font-semibold text-stone-900">Cart & Checkout</h1>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
          Items
        </h2>
        {lines.length === 0 ? (
          <p className="text-sm text-stone-600">
            Your cart is empty.{" "}
            <Link to={ROUTES.home} className="font-medium underline">
              Continue shopping
            </Link>
          </p>
        ) : (
          <ul className="space-y-3">
            {lines.map((line) => (
              <li key={line.lineId}>
                <Card className="border-stone-200/80">
                  <CardContent className="flex gap-3 p-3">
                    <img
                      src={line.imageUrl}
                      alt=""
                      className="size-20 rounded-md object-cover"
                    />
                    <div className="min-w-0 flex-1 space-y-1">
                      <p className="font-medium leading-snug text-stone-900">
                        {line.title}
                      </p>
                      <p className="text-xs text-stone-600">{line.colorName}</p>
                      <PriceBlock
                        regularPrice={line.unitPrice}
                        className="text-sm"
                      />
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <Label
                          htmlFor={`qty-${line.lineId}`}
                          className="text-xs"
                        >
                          Qty
                        </Label>
                        <Input
                          id={`qty-${line.lineId}`}
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
                          className="text-rose-700"
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
        <h2 className="text-sm font-semibold uppercase tracking-wider text-stone-500">
          Shipping
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="ship-name">Full name</Label>
            <Input
              id="ship-name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
              autoComplete="name"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ship-phone">Phone</Label>
            <Input
              id="ship-phone"
              value={phone}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPhone(e.target.value)
              }
              inputMode="tel"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="ship-city">City</Label>
            <Input
              id="ship-city"
              value={city}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setCity(e.target.value)
              }
            />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="ship-address">Address</Label>
            <Input
              id="ship-address"
              value={address}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAddress(e.target.value)
              }
            />
          </div>
        </div>
      </section>

      <Card className="border-stone-200/80">
        <CardHeader>
          <CardTitle className="text-base">Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <RadioGroup
            value={payment}
            onValueChange={(v: string) => setPayment(v as PaymentMethod)}
            className="grid gap-2"
          >
            <div className="flex items-start gap-3 rounded-lg border border-stone-200 p-3">
              <RadioGroupItem value="cod" id="pay-cod" className="mt-0.5" />
              <div className="space-y-1">
                <Label htmlFor="pay-cod" className="font-medium">
                  Cash on Delivery (COD)
                </Label>
                <p className="text-xs text-stone-600">
                  Pay the exact amount to the rider when your parcel arrives.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-stone-200 p-3">
              <RadioGroupItem
                value="online"
                id="pay-online"
                className="mt-0.5"
              />
              <div className="space-y-1">
                <Label htmlFor="pay-online" className="font-medium">
                  Online payment
                </Label>
                <p className="text-xs text-stone-600">
                  Card / debit / JazzCash (prototype — not connected).
                </p>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-stone-600">Subtotal</span>
          <span className="font-semibold tabular-nums text-stone-900">
            Rs. {subtotal.toLocaleString("en-PK")}
          </span>
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <span className="font-medium text-stone-900">Total</span>
          <span className="text-lg font-semibold tabular-nums text-stone-900">
            Rs. {subtotal.toLocaleString("en-PK")}
          </span>
        </div>
        <Button size="lg" className="w-full" onClick={placeOrder}>
          Place order
        </Button>
      </div>
    </div>
  );
}
