import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/core/components/ui/button";
import { Switch } from "@/core/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { ROUTES } from "@/core/routes";
import {
  getGetHomeHeroSlidesManageQueryKey,
  getGetHomeHeroSlidesQueryKey,
  useDeleteHomeHeroSlidesSlideId,
  useGetHomeHeroSlidesManage,
  useGetProducts,
  usePatchHomeHeroSlidesReorder,
  usePatchHomeHeroSlidesSlideId,
} from "@/core/api/generated/api";

export function AdminHomeHeroPage() {
  const queryClient = useQueryClient();
  const { data: slides = [], isLoading, error } = useGetHomeHeroSlidesManage();
  const { data } = useGetProducts();
  const products = data?.items ?? [];

  const variantLabelById = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of products) {
      for (const v of p.variants ?? []) {
        m.set(v.id, v.sku ? `${p.name} · ${v.sku}` : p.name);
      }
    }
    return m;
  }, [products]);

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: getGetHomeHeroSlidesManageQueryKey(),
    });
    queryClient.invalidateQueries({ queryKey: getGetHomeHeroSlidesQueryKey() });
  };

  const patchMutation = usePatchHomeHeroSlidesSlideId({
    mutation: { onSuccess: () => invalidate() },
  });
  const deleteMutation = useDeleteHomeHeroSlidesSlideId({
    mutation: { onSuccess: () => invalidate() },
  });
  const reorderMutation = usePatchHomeHeroSlidesReorder({
    mutation: { onSuccess: () => invalidate() },
  });

  const move = (index: number, dir: -1 | 1) => {
    const next = index + dir;
    if (next < 0 || next >= slides.length) return;
    const ids = slides.map((s) => s.id);
    const t = ids[index];
    ids[index] = ids[next]!;
    ids[next] = t!;
    reorderMutation.mutate({ data: { orderedIds: ids } });
  };

  if (isLoading) {
    return <div className="text-muted-foreground">Loading hero slides…</div>;
  }

  if (error) {
    return <div className="text-destructive">Failed to load hero slides.</div>;
  }

  const busy =
    patchMutation.isPending ||
    deleteMutation.isPending ||
    reorderMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Home hero</h1>
          <p className="text-sm text-muted-foreground">
            Carousel on the storefront home page. Each slide uses a specific
            product image; the same variant can appear on multiple slides with
            different photos.
          </p>
        </div>
        <Button asChild className="gap-1.5">
          <Link to={ROUTES.admin.homeHeroNew}>
            <Plus className="size-4" />
            Add slide
          </Link>
        </Button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">Order</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Theme</TableHead>
              <TableHead className="text-center">Active</TableHead>
              <TableHead>Variant</TableHead>
              <TableHead className="w-48 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slides.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-8 text-center text-muted-foreground"
                >
                  No slides yet. Add one to show the hero carousel.
                </TableCell>
              </TableRow>
            ) : (
              slides.map((s, i) => (
                <TableRow key={s.id}>
                  <TableCell className="tabular-nums text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        disabled={busy || i === 0}
                        onClick={() => move(i, -1)}
                        aria-label="Move up"
                      >
                        <ChevronUp className="size-4" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-8"
                        disabled={busy || i === slides.length - 1}
                        onClick={() => move(i, 1)}
                        aria-label="Move down"
                      >
                        <ChevronDown className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">
                    {s.title || "—"}
                    {s.usePrimaryHeading ? (
                      <span className="ml-2 text-xs font-normal text-muted-foreground">
                        (H1)
                      </span>
                    ) : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.theme}</TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={s.isActive}
                      disabled={busy}
                      onCheckedChange={(v) => {
                        patchMutation.mutate({
                          slideId: s.id,
                          data: { isActive: v },
                        });
                      }}
                      aria-label={`Active ${s.id}`}
                    />
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate text-xs text-muted-foreground">
                    {s.productVariantId
                      ? (variantLabelById.get(s.productVariantId) ??
                        s.productVariantId)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link to={ROUTES.admin.homeHeroEdit(s.id)}>Edit</Link>
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-destructive"
                        disabled={busy}
                        onClick={() => {
                          if (confirm("Delete this slide?")) {
                            deleteMutation.mutate({ slideId: s.id });
                          }
                        }}
                        aria-label="Delete"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
