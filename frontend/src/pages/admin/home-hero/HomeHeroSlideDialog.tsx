import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Textarea } from "@/core/components/ui/textarea";
import type { HomeHeroSlideRecord } from "@/core/api/generated/api";
import {
  emptyHomeHeroFormValues,
  homeHeroSlideFormSchema,
  type HomeHeroSlideFormValues,
} from "./homeHeroSlideFormSchema";

function recordToFormValues(s: HomeHeroSlideRecord): HomeHeroSlideFormValues {
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

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editing: HomeHeroSlideRecord | null;
  variantOptions: { id: string; label: string }[];
  isSaving: boolean;
  onSave: (values: HomeHeroSlideFormValues) => void;
};

export function HomeHeroSlideDialog({
  open,
  onOpenChange,
  editing,
  variantOptions,
  isSaving,
  onSave,
}: Props) {
  const form = useForm<HomeHeroSlideFormValues>({
    resolver: zodResolver(homeHeroSlideFormSchema),
    defaultValues: emptyHomeHeroFormValues(),
  });

  const { control, register, handleSubmit, reset, formState } = form;

  useEffect(() => {
    if (!open) return;
    reset(editing ? recordToFormValues(editing) : emptyHomeHeroFormValues());
  }, [open, editing, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit slide" : "New slide"}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(onSave)}
          className="grid gap-4 py-2"
          noValidate
        >
          <div className="space-y-2">
            <Label htmlFor="hh-theme">Theme</Label>
            <Controller
              name="theme"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="hh-theme">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LIGHT">Light</SelectItem>
                    <SelectItem value="DARK">Dark</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="hh-active">Active</Label>
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <Switch
                  id="hh-active"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="flex items-center justify-between gap-4">
            <Label htmlFor="hh-h1">Use main page heading (H1)</Label>
            <Controller
              name="usePrimaryHeading"
              control={control}
              render={({ field }) => (
                <Switch
                  id="hh-h1"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hh-eyebrow">Eyebrow</Label>
            <Input
              id="hh-eyebrow"
              placeholder="Optional; falls back from variant"
              {...register("eyebrow")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hh-title">Title</Label>
            <Input
              id="hh-title"
              placeholder="Required if no variant"
              aria-invalid={!!formState.errors.title}
              {...register("title")}
            />
            {formState.errors.title?.message ? (
              <p className="text-xs text-destructive" role="alert">
                {formState.errors.title.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="hh-desc">Description</Label>
            <Textarea
              id="hh-desc"
              rows={3}
              placeholder="Optional"
              {...register("description")}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hh-variant">Product variant</Label>
            <Controller
              name="productVariantId"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value ? field.value : "__none__"}
                  onValueChange={(v) =>
                    field.onChange(v === "__none__" ? "" : v)
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
              )}
            />
          </div>
          <DialogFooter className="pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {editing ? "Save" : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
