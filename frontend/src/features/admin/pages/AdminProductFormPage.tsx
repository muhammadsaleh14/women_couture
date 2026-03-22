import { useEffect, useState, type ChangeEvent } from "react";
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
import { getProductById } from "@/features/storefront/model/mock-products";
import type { CategoryId } from "@/shared/model/types";

type ColorRow = { id: string; name: string; qty: string; hex: string };

const defaultColors = (): ColorRow[] => [
  { id: crypto.randomUUID(), name: "Navy Blue", qty: "5", hex: "#1e3a5f" },
];

export function AdminProductFormPage() {
  const isNew = Boolean(useMatch("/admin/products/new"));
  const { productId } = useParams();
  const navigate = useNavigate();
  const existing = !isNew && productId ? getProductById(productId) : undefined;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [mainCategory, setMainCategory] = useState("Unstitched");
  const [subCategory, setSubCategory] = useState<"3 PC" | "2 PC" | "Separates">(
    "3 PC",
  );
  const [categoryId, setCategoryId] = useState<CategoryId>("three-piece");
  const [regular, setRegular] = useState("");
  const [sale, setSale] = useState("");
  const [images, setImages] = useState<{ id: string; preview: string }[]>([]);
  const [colorRows, setColorRows] = useState<ColorRow[]>(defaultColors);

  useEffect(() => {
    if (!existing) {
      return;
    }
    setName(existing.name);
    setDescription(existing.description);
    setMainCategory(existing.mainCategory);
    setSubCategory(existing.subCategory);
    setCategoryId(existing.categoryId);
    setRegular(String(existing.regularPrice));
    setSale(existing.salePrice != null ? String(existing.salePrice) : "");
    setColorRows(
      existing.variants.map((v) => ({
        id: v.id,
        name: v.colorName,
        qty: String(v.stock),
        hex: v.hex,
      })),
    );
  }, [existing]);

  function onPickImages(e: ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) {
      return;
    }
    const next: { id: string; preview: string }[] = [];
    Array.from(files).forEach((file) => {
      next.push({
        id: crypto.randomUUID(),
        preview: URL.createObjectURL(file),
      });
    });
    setImages((prev) => [...prev, ...next]);
  }

  const save = () => {
    navigate(ROUTES.admin.products);
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-stone-900">
          {isNew ? "Add suit" : "Edit suit"}
        </h1>
        <p className="text-sm text-stone-600">
          Prototype form — data is not persisted.
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
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setName(e.target.value)
              }
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
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label>Main category</Label>
              <Select value={mainCategory} onValueChange={setMainCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Unstitched">Unstitched</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Sub-category</Label>
              <Select
                value={subCategory}
                onValueChange={(v: string) =>
                  setSubCategory(v as "3 PC" | "2 PC" | "Separates")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3 PC">3 PC</SelectItem>
                  <SelectItem value="2 PC">2 PC</SelectItem>
                  <SelectItem value="Separates">Separates</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Storefront category slug</Label>
            <Select
              value={categoryId}
              onValueChange={(v: string) => setCategoryId(v as CategoryId)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="three-piece">3 Piece listing</SelectItem>
                <SelectItem value="two-piece">2 Piece listing</SelectItem>
                <SelectItem value="separates">Separates listing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="p-reg">Regular price (PKR)</Label>
              <Input
                id="p-reg"
                inputMode="numeric"
                value={regular}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setRegular(e.target.value)
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p-sale">Sale price (optional)</Label>
              <Input
                id="p-sale"
                inputMode="numeric"
                value={sale}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setSale(e.target.value)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Pictures</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label
            htmlFor="p-imgs"
            className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-stone-300 bg-stone-50/50 px-6 py-10 text-center text-sm text-stone-600"
          >
            <span className="font-medium text-stone-800">
              Drag & drop or click to upload
            </span>
            <span className="mt-1 text-xs">Prototype — previews only</span>
            <input
              id="p-imgs"
              type="file"
              accept="image/*"
              multiple
              className="sr-only"
              onChange={onPickImages}
            />
          </Label>
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {images.map((img) => (
                <img
                  key={img.id}
                  src={img.preview}
                  alt=""
                  className="size-20 rounded-md object-cover"
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">Colors & stock</CardTitle>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() =>
              setColorRows((r) => [
                ...r,
                {
                  id: crypto.randomUUID(),
                  name: "",
                  qty: "0",
                  hex: "#888888",
                },
              ])
            }
          >
            <Plus className="size-4" />
            Add row
          </Button>
        </CardHeader>
        <CardContent className="space-y-3">
          {colorRows.map((row, index) => (
            <div key={row.id}>
              {index > 0 && <Separator className="my-3" />}
              <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto] sm:items-end">
                <div className="space-y-1.5">
                  <Label>Color name</Label>
                  <Input
                    value={row.name}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setColorRows((rows) =>
                        rows.map((x) =>
                          x.id === row.id ? { ...x, name: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Qty</Label>
                  <Input
                    inputMode="numeric"
                    value={row.qty}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setColorRows((rows) =>
                        rows.map((x) =>
                          x.id === row.id ? { ...x, qty: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Swatch</Label>
                  <Input
                    type="color"
                    className="h-10 w-full cursor-pointer p-1"
                    value={row.hex}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setColorRows((rows) =>
                        rows.map((x) =>
                          x.id === row.id ? { ...x, hex: e.target.value } : x,
                        ),
                      )
                    }
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-stone-500"
                  onClick={() =>
                    setColorRows((rows) => rows.filter((x) => x.id !== row.id))
                  }
                  aria-label="Remove row"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex gap-2">
        <Button type="button" onClick={save}>
          Save product
        </Button>
        <Button type="button" variant="outline" asChild>
          <Link to={ROUTES.admin.products}>Cancel</Link>
        </Button>
      </div>
    </div>
  );
}
