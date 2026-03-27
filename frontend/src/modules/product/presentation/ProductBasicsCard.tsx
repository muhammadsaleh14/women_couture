import { Controller, type UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/core/components/ui/card";
import { Input } from "@/core/components/ui/input";
import { Label } from "@/core/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/core/components/ui/select";
import { Textarea } from "@/core/components/ui/textarea";

import { type ProductFormValues } from "../domain/productFormSchema";

interface ProductBasicsCardProps {
  form: UseFormReturn<ProductFormValues>;
}

export function ProductBasicsCard({ form }: ProductBasicsCardProps) {
  const {
    register,
    control,
    formState: { errors },
  } = form;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Basics</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="p-name">Name</Label>
          <Input id="p-name" {...register("name")} />
          {errors.name && (
            <p className="text-destructive text-sm">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="p-desc">Description</Label>
          <Textarea id="p-desc" rows={4} {...register("description")} />
        </div>

        <div className="space-y-1.5">
          <Label>Product Type</Label>

          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
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
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
