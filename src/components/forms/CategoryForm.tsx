import type {
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category.types";
import type { Category } from "@/types/task.types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

// Predefined color palette for consistency
const CATEGORY_COLORS = [
  "#ef4444", // red-500
  "#f97316", // orange-500
  "#eab308", // yellow-500
  "#22c55e", // green-500
  "#06b6d4", // cyan-500
  "#3b82f6", // blue-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#6b7280", // gray-500
  "#84cc16", // lime-500
];

const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Category name is required")
    .min(2, "Name must be at least 2 characters")
    .max(30, "Name must be less than 30 characters")
    .trim(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Invalid color format"),
});

type CategoryFormData = CreateCategoryData & { color: string };

interface CategoryFormProps {
  category?: Category; // If provided, we're editing
  onSubmit: (data: CreateCategoryData | UpdateCategoryData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  showCancel?: boolean;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
  isLoading = false,
  showCancel = false,
}) => {
  const isEditing = !!category;

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: category?.name ?? "",
      color: category?.color ?? CATEGORY_COLORS[0],
    },
  });
  const watchedColor = watch("color");
  console.log("watchedColor", watchedColor);

  const handleFormSubmit = (data: CategoryFormData) => {
    onSubmit(data);
    // Reset form after successful creation (not editing)
    if (!isEditing) {
      reset({
        name: "",
        color: CATEGORY_COLORS[0],
      });
    }
  };

  const handleColorSelect = (color: string) => {
    setValue("color", color, { shouldDirty: true });
  };

  const handleReset = () => {
    reset({
      name: category?.name ?? "",
      color: category?.color ?? CATEGORY_COLORS[0],
    });
  };

  return (
    <Card className="shadow-2xl/5 border-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle>
          {isEditing ? "Edit Category" : "Create New Category"}
        </CardTitle>
        {showCancel && onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Category Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="e.g., Work, Personal, Urgent"
              {...register("name")}
              className={errors.name ? "border-destructive bg-red-50" : ""}
              disabled={isLoading}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}

            {/* Color Picker */}
            <div className="space-y-2">
              <Label>Category Color</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORY_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleColorSelect(color)}
                    className={`w-8 h-8 rounded-full border-2 transition-all hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                      watchedColor === color
                        ? "border-foreground shadow-md"
                        : "border-muted-foreground/20"
                    }`}
                    style={{ backgroundColor: color }}
                    aria-label={`Select ${color} color`}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Color Preview */}
              <div className="flex items-center gap-2 mt-2">
                <div
                  className="w-4 h-4 rounded border"
                  style={{ backgroundColor: watchedColor }}
                />
                <span className="text-sm text-muted-foreground">
                  Preview: {watchedColor}
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-2">
              <Button
                type="submit"
                disabled={(!isDirty && isEditing) || isLoading}
                className="flex-1"
              >
                {isLoading
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Category"
                  : "Create Category"}
              </Button>

              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleReset}
                  disabled={!isDirty || isLoading}
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
