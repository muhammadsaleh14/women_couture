import { useState, useEffect, type ChangeEvent } from "react";
import { Link, useMatch, useNavigate, useParams } from "react-router-dom";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
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
  useGetAdminProductsProductId,
  type ClothingType,
} from "@/api/generated/api";
import { api } from "@/lib/api";

/* ---------- types ---------- */

type ImageItem = {
  uid: string;
  preview: string;
  file?: File;
};

type VariantRow = {
  /** Real DB id when editing, local uuid when creating */
  id: string;
  color: string;
  sku: string;
  salePrice: string;
  purchasePrice: string;
  images: ImageItem[];
};

const emptyVariant = (): VariantRow => ({
  id: crypto.randomUUID(),
  color: "",
  sku: "",
  salePrice: "0",
  purchasePrice: "",
  images: [],
});

/* ---------- component ---------- */

export function AdminProductFormPage() {
  const isNew = Boolean(useMatch("/admin/products/new"));
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<ClothingType>("UNSTITCHED");
  const [variants, setVariants] = useState<VariantRow[]>([emptyVariant()]);
  const [saving, setSaving] = useState(false);

  /* ---- fetch existing product for edit ---- */
  const { data: existing, isLoading } = useGetAdminProductsProductId(
    productId || "",
    { query: { enabled: !isNew && !!productId } },
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
            images: (v.images || []).map((img) => ({
              uid: img.id,
              preview: img.url,
            })),
          })),
        );
      }
    }
  }, [existing]);

  /* ---- variant helpers ---- */
  function updateVariant(id: string, patch: Partial<VariantRow>) {
    setVariants((rows) =>
      rows.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  }

  function addImagesToVariant(variantId: string, e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;
    const items: ImageItem[] = Array.from(files).map((f) => ({
      uid: crypto.randomUUID(),
      preview: URL.createObjectURL(f),
      file: f,
    }));
    setVariants((rows) =>
      rows.map((r) =>
        r.id === variantId ? { ...r, images: [...r.images, ...items] } : r,
      ),
    );
  }

  async function removeVariantImage(variantId: string, imgUid: string) {
    // Find the image to check if it's from the DB (no file property)
    const variant = variants.find((r) => r.id === variantId);
    const img = variant?.images.find((i) => i.uid === imgUid);

    // If it's an existing DB image, delete it from the server
    if (img && !img.file) {
      try {
        await api.delete(`/admin/variants/images/${imgUid}`);
      } catch (err) {
        console.error("Failed to delete image:", err);
        alert("Failed to delete image");
        return;
      }
    }

    setVariants((rows) =>
      rows.map((r) =>
        r.id === variantId
          ? { ...r, images: r.images.filter((i) => i.uid !== imgUid) }
          : r,
      ),
    );
  }

  /* ---- save (single multipart request) ---- */
  const save = async () => {
    setSaving(true);
    try {
      const fd = new FormData();

      if (isNew) {
        /* --- CREATE --- */
        const payload = {
          name,
          description: description || undefined,
          type,
          variants: variants.map((v) => ({
            color: v.color || "Default",
            sku: v.sku || undefined,
            salePrice: Number(v.salePrice || 0),
            purchasePrice: v.purchasePrice ? Number(v.purchasePrice) : undefined,
          })),
        };
        fd.append("data", JSON.stringify(payload));

        // Attach image files keyed by variant index
        variants.forEach((v, i) => {
          for (const img of v.images) {
            if (img.file) fd.append(`variants[${i}]`, img.file);
          }
        });

        await api.post("/admin/products", fd);
      } else if (productId) {
        /* --- EDIT --- */
        const payload = {
          name,
          description: description || undefined,
          type,
          // Pass variant IDs so the backend knows which variant to attach new files to
          variantIds: variants.map((v) => v.id),
        };
        fd.append("data", JSON.stringify(payload));

        // Attach only NEW image files
        variants.forEach((v, i) => {
          for (const img of v.images) {
            if (img.file) fd.append(`variants[${i}]`, img.file);
          }
        });

        await api.patch(`/admin/products/${productId}`, fd);
      }

      navigate(ROUTES.admin.products);
    } catch (err) {
      console.error("Failed to save product:", err);
      alert("Failed to save product");
    } finally {
      setSaving(false);
    }
  };

  /* ---- loading gate ---- */
  if (isLoading) {
    return <div className="p-8 text-stone-500">Loading product details...</div>;
  }

  /* ---- render ---- */
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

      {/* ---- basics ---- */}
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
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
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

      {/* ---- variants ---- */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Variants</CardTitle>
          {isNew && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => setVariants((prev) => [...prev, emptyVariant()])}
            >
              <Plus className="size-4" />
              Add Variant
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((row, index) => (
            <div key={row.id}>
              {index > 0 && <Separator className="my-4" />}

              {/* fields */}
              <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-5 md:items-end">
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Color / Group Name</Label>
                  <Input
                    placeholder="e.g. Navy Blue"
                    value={row.color}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateVariant(row.id, { color: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>SKU (optional)</Label>
                  <Input
                    placeholder="e.g. NVY-123"
                    value={row.sku}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateVariant(row.id, { sku: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-1.5 md:col-span-2">
                  <Label>Sale Price (PKR)</Label>
                  <Input
                    inputMode="numeric"
                    value={row.salePrice}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      updateVariant(row.id, { salePrice: e.target.value })
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
                      updateVariant(row.id, { purchasePrice: e.target.value })
                    }
                  />
                </div>
                <div className="flex justify-end pb-0.5 md:col-span-1">
                  {isNew && variants.length > 1 && (
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
                  )}
                </div>
              </div>

              {/* per-variant images */}
              <div className="mt-3">
                <div className="flex items-center gap-2 mb-2">
                  <Label className="text-xs text-stone-500">
                    Photos for "{row.color || "this variant"}"
                  </Label>
                  <label className="inline-flex cursor-pointer items-center gap-1 rounded-md border border-stone-300 bg-white px-2 py-1 text-xs text-stone-600 hover:bg-stone-50">
                    <ImagePlus className="size-3" />
                    Add
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => addImagesToVariant(row.id, e)}
                    />
                  </label>
                </div>

                {row.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {row.images.map((img) => (
                      <div
                        key={img.uid}
                        className="relative size-16 overflow-hidden rounded-md border bg-stone-100"
                      >
                        <img
                          src={img.preview}
                          alt="Variant preview"
                          className="h-full w-full object-cover"
                        />
                        <button
                          onClick={() => removeVariantImage(row.id, img.uid)}
                          className="absolute right-0.5 top-0.5 rounded-sm bg-white/80 p-0.5 text-stone-600 shadow backdrop-blur-sm hover:text-red-600"
                        >
                          <Trash2 className="size-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ---- actions ---- */}
      <div className="flex gap-2">
        <Button type="button" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save product"}
        </Button>
        <Button type="button" variant="outline" asChild disabled={saving}>
          <Link to={ROUTES.admin.products}>Cancel</Link>
        </Button>
      </div>
    </div>
  );
}
