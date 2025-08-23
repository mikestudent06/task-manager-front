import React, { useState } from "react";
import { Plus, Settings, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CategoryForm } from "@/components/forms/CategoryForm";
import { CategoryList } from "@/components/categories/CategoryList";
import { useCategories } from "@/hooks/useCategories";
import type {
  CreateCategoryData,
  UpdateCategoryData,
} from "@/types/category.types";

export const CategoriesPage: React.FC = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    categories,
    isCategoriesLoading,
    createCategory,
    updateCategory,
    deleteCategory,
    isCreatingCategory,
    isUpdatingCategory,
    isDeletingCategory,
  } = useCategories();

  const handleCreateCategory = (data: CreateCategoryData) => {
    createCategory(data);
    setShowCreateForm(false); // Hide form after successful creation
  };

  const handleUpdateCategory = (
    categoryId: string,
    data: UpdateCategoryData
  ) => {
    updateCategory(categoryId, data);
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategory(categoryId);
  };

  const toggleCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  // Loading state
  if (isCategoriesLoading) {
    return (
      <div className="space-y-6 p-6">
        <div className="space-y-2">
          <div className="h-8 bg-muted rounded animate-pulse w-48" />
          <div className="h-4 bg-muted rounded animate-pulse w-96" />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="shadow-2xl/5 border-0">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-muted rounded-full animate-pulse" />
                    <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                  </div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                    <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Tag className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Categories</h1>
          </div>
          <p className="text-muted-foreground">
            Organize your tasks by creating and managing categories. Each
            category can have its own color for easy identification.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Stats */}
          <div className="hidden sm:flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Settings className="h-4 w-4" />
              <span>{categories.length} Categories</span>
            </div>
            <Separator orientation="vertical" className="h-4" />
            <span>
              {categories.reduce((sum, cat) => sum + (cat?.taskCount || 0), 0)}{" "}
              Total Tasks
            </span>
          </div>

          {/* Create Button */}
          <Button onClick={toggleCreateForm} className="gap-2">
            <Plus className="h-4 w-4" />
            {showCreateForm ? "Cancel" : "New Category"}
          </Button>
        </div>
      </div>

      {/* Create Form (conditionally shown) */}
      {showCreateForm && (
        <CategoryForm
          onSubmit={handleCreateCategory}
          onCancel={toggleCreateForm}
          isLoading={isCreatingCategory}
          showCancel
        />
      )}

      {/* Categories List */}
      <CategoryList
        categories={categories}
        onUpdate={handleUpdateCategory}
        onDelete={handleDeleteCategory}
        isUpdating={isUpdatingCategory}
        isDeleting={isDeletingCategory}
      />

      {/* Quick Tips */}
      {categories.length > 0 && (
        <Card className="bg-muted/50 border-dashed shadow-2xl/5 border-0">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Tag className="h-4 w-4 text-blue-500" />
                  Color Coding
                </h4>
                <p className="text-sm text-muted-foreground">
                  Use different colors to quickly identify category types. For
                  example: red for urgent, blue for work, green for personal.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4 text-green-500" />
                  Best Practices
                </h4>
                <p className="text-sm text-muted-foreground">
                  Keep category names short and descriptive. Aim for 5-7
                  categories maximum for optimal organization.
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4 text-purple-500" />
                  Task Management
                </h4>
                <p className="text-sm text-muted-foreground">
                  Categories help filter tasks in your dashboard. Deleted
                  categories move their tasks to "Uncategorized".
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
