import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/core/components/ui/button";
import { CartCheckoutPanel } from "@/modules/cart/presentation/CartCheckoutPanel";

export function CartPage() {
  const navigate = useNavigate();

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="mb-4">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="-ml-2 gap-1.5 text-muted-foreground"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="size-4" aria-hidden />
          Back
        </Button>
      </div>
      <CartCheckoutPanel mode="page" />
    </div>
  );
}
