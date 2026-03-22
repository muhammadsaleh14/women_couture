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
import { useGetAdminProducts } from "@/api/generated/api";

export function AdminProductsPage() {
  const { data: products, isLoading, error } = useGetAdminProducts();

  if (isLoading) {
    return <div className="p-8 text-stone-500">Loading products...</div>;
  }

  if (error) {
    return <div className="p-8 text-red-500">Failed to load products.</div>;
  }

  const rows = products || [];

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
              const totalStock = p.variants?.reduce((s, v) => s + (v.stockQty ?? 0), 0) ?? 0;
              const firstVariant = p.variants?.[0];
              const thumb = firstVariant?.images?.[0]?.url || "https://placehold.co/100x100?text=No+Image";
              const price = firstVariant?.salePrice ?? 0;
              const subCategoryType = p.type;
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
                  <TableCell className="text-stone-600">
                    {subCategoryType}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    Rs. {Number(price).toLocaleString("en-PK")}
                  </TableCell>
                  <TableCell className="text-right tabular-nums">
                    {totalStock}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={p.isActive}
                      onCheckedChange={() =>
                        console.log("Toggle API call not implemented for checking:", p.name)
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
