import { useMemo, useState } from "react";
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/core/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/core/components/ui/dialog";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Switch } from "@/core/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/core/components/ui/table";
import { Textarea } from "@/core/components/ui/textarea";
import {
  getGetHomeHeroSlidesManageQueryKey,
  getGetHomeHeroSlidesQueryKey,
  useDeleteHomeHeroSlidesSlideId,
  useGetHomeHeroSlidesManage,
  useGetProducts,
  usePatchHomeHeroSlidesReorder,
  usePatchHomeHeroSlidesSlideId,
  usePostHomeHeroSlides,
  type HomeHeroSlideRecord,
  type CreateHomeHeroSlideBody,
} from "@/core/api/generated/api";

type FormState = {
  theme: CreateHomeHeroSlideBody["theme"];
  usePrimaryHeading: boolean;
  isActive: boolean;
  eyebrow: string;
  title: string;
  description: string;
  productVariantId: string;
};

function emptyForm(): FormState {
  return {
    theme: "LIGHT",
    usePrimaryHeading: false,
    isActive: true,
    eyebrow: "",
    title: "",
    description: "",
    productVariantId: "",
  };
}

function recordToForm(s: HomeHeroSlideRecord): FormState {
  return {
    theme: s.theme,
    usePrimaryHeading: s.usePrimaryHeading,
    isActive: s.isActive,
    eyebrow: s.eyebrow ?? "",
    title: s.title ?? "",
    description: s.description ?? "",
    productVariantId: s.productVariantId ?? "",
  };
}

export function AdminHomeHeroPage() {
  const queryClient = useQueryClient();
  const { data: slides = [], isLoading, error } = useGetHomeHeroSlidesManage();
  const { data: products = [] } = useGetProducts();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<HomeHeroSlideRecord | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);

  const variantOptions = useMemo(() => {
    return products.flatMap((p) =>
      (p.variants ?? []).map((v) => ({
        id: v.id,
        label: `${p.name} · ${v.color}`,
      })),
    );
  }, [products]);

  const invalidate = () => {
    queryClient.invalidateQueries({
      queryKey: getGetHomeHeroSlidesManageQueryKey(),
    });
    queryClient.invalidateQueries({ queryKey: getGetHomeHeroSlidesQueryKey() });
  };

  const postMutation = usePostHomeHeroSlides({
    mutation: {
      onSuccess: () => {
        invalidate();
        setDialogOpen(false);
      },
    },
  });
  const patchMutation = usePatchHomeHeroSlidesSlideId({
    mutation: {
      onSuccess: () => {
        invalidate();
        setDialogOpen(false);
      },
    },
  });
  const deleteMutation = useDeleteHomeHeroSlidesSlideId({
    mutation: { onSuccess: () => invalidate() },
  });
  const reorderMutation = usePatchHomeHeroSlidesReorder({
    mutation: { onSuccess: () => invalidate() },
  });

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setDialogOpen(true);
  };

  const openEdit = (s: HomeHeroSlideRecord) => {
    setEditing(s);
    setForm(recordToForm(s));
    setDialogOpen(true);
  };

  const submitForm = () => {
    const variantId = form.productVariantId.trim() || null;
    const titleTrim = form.title.trim();

    if (editing) {
      patchMutation.mutate({
        slideId: editing.id,
        data: {
          theme: form.theme,
          usePrimaryHeading: form.usePrimaryHeading,
          isActive: form.isActive,
          eyebrow: form.eyebrow.trim() || null,
          title: titleTrim || null,
          description: form.description.trim() || null,
          productVariantId: variantId,
        },
      });
      return;
    }

    const data: CreateHomeHeroSlideBody = {
      theme: form.theme,
      isActive: form.isActive,
      usePrimaryHeading: form.usePrimaryHeading,
      eyebrow: form.eyebrow.trim() || null,
      description: form.description.trim() || null,
      productVariantId: variantId,
    };
    if (titleTrim) data.title = titleTrim;
    if (!variantId) data.title = titleTrim;

    postMutation.mutate({ data });
  };

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
    postMutation.isPending ||
    patchMutation.isPending ||
    deleteMutation.isPending ||
    reorderMutation.isPending;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Home hero</h1>
          <p className="text-sm text-muted-foreground">
            Carousel on the storefront home page. Optional product variant for
            image and link.
          </p>
        </div>
        <Button type="button" onClick={openCreate} className="gap-1.5">
          <Plus className="size-4" />
          Add slide
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
                      ? variantOptions.find((o) => o.id === s.productVariantId)
                          ?.label ?? s.productVariantId
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => openEdit(s)}
                        disabled={busy}
                      >
                        Edit
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editing ? "Edit slide" : "New slide"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="hh-theme">Theme</Label>
              <Select
                value={form.theme}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    theme: v as FormState["theme"],
                  }))
                }
              >
                <SelectTrigger id="hh-theme">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="LIGHT">Light</SelectItem>
                  <SelectItem value="DARK">Dark</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="hh-active">Active</Label>
              <Switch
                id="hh-active"
                checked={form.isActive}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, isActive: v }))
                }
              />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label htmlFor="hh-h1">Use main page heading (H1)</Label>
              <Switch
                id="hh-h1"
                checked={form.usePrimaryHeading}
                onCheckedChange={(v) =>
                  setForm((f) => ({ ...f, usePrimaryHeading: v }))
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hh-eyebrow">Eyebrow</Label>
              <Input
                id="hh-eyebrow"
                value={form.eyebrow}
                onChange={(e) =>
                  setForm((f) => ({ ...f, eyebrow: e.target.value }))
                }
                placeholder="Optional; falls back from variant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hh-title">Title</Label>
              <Input
                id="hh-title"
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
                placeholder="Required if no variant"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hh-desc">Description</Label>
              <Textarea
                id="hh-desc"
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                rows={3}
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hh-variant">Product variant</Label>
              <Select
                value={form.productVariantId || "__none__"}
                onValueChange={(v) =>
                  setForm((f) => ({
                    ...f,
                    productVariantId: v === "__none__" ? "" : v,
                  }))
                }
              >
                <SelectTrigger id="hh-variant">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {variantOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitForm}
              disabled={
                busy ||
                (!form.productVariantId.trim() && !form.title.trim())
              }
            >
              {editing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
