import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { ROUTES } from "@/core/routes";
import { mockProducts } from "@/features/storefront/model/mock-products";
import type { Product } from "@/shared/model/types";

type Row = Product & { isSelling: boolean };

export function AdminProductsPage() {
  const [rows, setRows] = useState<Row[]>(() =>
    mockProducts.map((p) => ({ ...p, isSelling: true })),
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-stone-900">Products</h1>
          <p className="text-sm text-stone-600">
            Toggle visibility or open an item to edit.
          </p>
        </div>
        <Button asChild>
          <Link to={ROUTES.admin.productNew} className="gap-1.5">
            <Plus className="size-4" />
            Add new suit
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-stone-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16" />
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Stock</TableHead>
              <TableHead className="text-center">Selling</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((p) => {
              const totalStock = p.variants.reduce((s, v) => s + v.stock, 0);
              const thumb = p.variants[0]?.imageUrl ?? p.images[0];
              const price = p.salePrice ?? p.regularPrice;
              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <img
                      src={thumb}
                      alt=""
                      className="size-12 rounded-md object-cover"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{p.name}</TableCell>
                  <TableCell className="text-stone-600">{p.subCategory}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    Rs. {price.toLocaleString("en-PK")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {totalStock}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={p.isSelling}
                      onCheckedChange={(v: boolean) =>
                        setRows((prev) =>
                          prev.map((r) =>
                            r.id === p.id ? { ...r, isSelling: v } : r,
                          ),
                        )
                      }
                      aria-label={`Selling ${p.name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" asChild>
                      <Link to={ROUTES.admin.productEdit(p.id)}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
