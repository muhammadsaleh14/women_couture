import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/core/components/ui/button";
import { CartCheckoutPanel } from "@/modules/cart/presentation/CartCheckoutPanel";

export function CartPage() {
  const navigate = useNavigate();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:px-10">
      <div className="mb-8">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 gap-2 text-xs uppercase tracking-widest text-muted-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Button>
      </div>
      <h1 className="font-display mb-8 text-3xl font-medium tracking-tight text-foreground">
        Your bag
      </h1>
      <CartCheckoutPanel mode="page" />
    </div>
  );
}
