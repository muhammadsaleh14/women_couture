import { useState, useEffect, type ChangeEvent } from "react";
import { Link, useMatch, useNavigate, useParams } from "react-router-dom";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { ROUTES } from "@/core/routes";
import { 
  usePostAdminProducts, 
  useGetAdminProductsProductId, 
  type ClothingType 
} from "@/api/generated/api";

type VariantRow = {
  id: string;
  color: string;
  sku: string;
  salePrice: string;
  purchasePrice: string;
};

const defaultVariant = (): VariantRow[] => [
  { id: crypto.randomUUID(), color: "Navy Blue", sku: "", salePrice: "0", purchasePrice: "" },
];

export function AdminProductFormPage() {
  const isNew = Boolean(useMatch("/admin/products/new"));
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ClothingType>("UNSTITCHED");
  const [variants, setVariants] = useState<VariantRow[]>(defaultVariant);

  const { data: existing, isLoading } = useGetAdminProductsProductId(
    productId || "",
    {
      query: {
        enabled: !isNew && !!productId,
      },
    }
  );

  useEffect(() => {
    if (existing) {
      setName(existing.name);
      setDescription(existing.description || "");
      setType(existing.type);
      if (existing.variants && existing.variants.length > 0) {
        setVariants(
          existing.variants.map((v) => ({
            id: v.id,
            color: v.color,
            sku: v.sku || "",
            salePrice: String(v.salePrice),
            purchasePrice: v.purchasePrice ? String(v.purchasePrice) : "",
          }))
        );
      }
    }
  }, [existing]);

  const createProductReq = usePostAdminProducts();

  const save = async () => {
    if (!isNew) {
      alert("Editing existing products via API is not yet available. Creating new ones works.");
      return;
    }

    try {
      await createProductReq.mutateAsync({
        data: {
          name,
          description: description || undefined,
          type,
          variants: variants.map((v) => ({
            color: v.color || "Default",
            sku: v.sku || undefined,
            salePrice: Number(v.salePrice || 0),
            purchasePrice: v.purchasePrice ? Number(v.purchasePrice) : undefined,
          })),
        },
      });

      navigate(ROUTES.admin.products);
    } catch (err) {
      console.error(err);
      alert("Failed to create product");
    }
  };

  if (isLoading) {
    return <div className="p-8 text-stone-500">Loading product details...</div>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">
          {isNew ? "Add Product" : "Edit Product"}
        </h1>
        <p className="text-sm text-stone-600">
          Fill in the product details and its initial variants.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Basics</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="p-name">Name</Label>
            <Input
              id="p-name"
              value={name}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="p-desc">Description</Label>
            <Textarea
              id="p-desc"
              rows={4}
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label>Product Type</Label>
            <Select value={type} onValueChange={(v) => setType(v as ClothingType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UNSTITCHED">Unstitched</SelectItem>
                <SelectItem value="THREE_PC">3 Piece</SelectItem>
                <SelectItem value="TWO_PC">2 Piece</SelectItem>
                <SelectItem value="SEPARATE">Separate</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Variants</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() =>
              setVariants((prev) => [
                ...prev,
                {
                  id: crypto.randomUUID(),
                  color: "",
                  sku: "",
                  salePrice: "0",
                  purchasePrice: "",
                },
              ])
            }
          >
            <Plus className="size-4" />
            Add Variant
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {variants.map((row, index) => (
            <div key={row.id}>
              {index > 0 && <Separator className="my-3" />}
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5 md:items-end">
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Color / Group Name</Label>
                  <Input
                    placeholder="e.g. Navy Blue"
                    value={row.color}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setVariants((rows) =>
                        rows.map((x) =>
                          x.id === row.id ? { ...x, color: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>SKU (optional)</Label>
                  <Input
                    placeholder="e.g. NVY-123"
                    value={row.sku}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setVariants((rows) =>
                        rows.map((x) =>
                          x.id === row.id ? { ...x, sku: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Sale Price (PKR)</Label>
                  <Input
                    inputMode="numeric"
                    value={row.salePrice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setVariants((rows) =>
                        rows.map((x) =>
                          x.id === row.id ? { ...x, salePrice: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Cost Price (optional)</Label>
                  <Input
                    inputMode="numeric"
                    placeholder="e.g. 500"
                    value={row.purchasePrice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setVariants((rows) =>
                        rows.map((x) =>
                          x.id === row.id ? { ...x, purchasePrice: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </div>
                <div className="flex justify-end pb-0.5 md:col-span-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-stone-500"
                    onClick={() =>
                      setVariants((rows) => rows.filter((x) => x.id !== row.id))
                    }
                    aria-label="Remove variant"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={save}
          disabled={createProductReq.isPending}
        >
          {createProductReq.isPending ? "Saving..." : "Save product"}
        </Button>
        <Button
          type="button"
          variant="outline"
          asChild
          disabled={createProductReq.isPending}
        >
          <Link to={ROUTES.admin.products}>Cancel</Link>
        </Button>
      </div>
    </div>
  );
}
