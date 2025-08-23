import React, { useState } from "react";
import { MoreHorizontal, Edit, Trash2, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types/task.types";
import type { UpdateCategoryData } from "@/types/category.types";
import { CategoryForm } from "@/components/forms/CategoryForm";

interface CategoryListProps {
  categories: Category[];
  onUpdate: (categoryId: string, data: UpdateCategoryData) => void;
  onDelete: (categoryId: string) => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({
  categories,
  onUpdate,
  onDelete,
  isUpdating = false,
  isDeleting = false,
}) => {
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(
    null
  );

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCancelEdit = () => {
    setEditingCategory(null);
  };

  const handleUpdate = (data: UpdateCategoryData) => {
    if (editingCategory) {
      onUpdate(editingCategory.id, data);
      setEditingCategory(null);
    }
  };

  const handleDeleteClick = (category: Category) => {
    setDeletingCategory(category);
  };

  const handleDeleteConfirm = () => {
    if (deletingCategory) {
      onDelete(deletingCategory.id);
      setDeletingCategory(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingCategory(null);
  };

  if (categories.length === 0) {
    return (
      <Card className="shadow-2xl/5 border-0">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Tag className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No categories yet</h3>
          <p className="text-sm text-muted-foreground text-center max-w-sm">
            Create your first category to organize your tasks better. Categories
            help you filter and group related tasks.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="shadow-2xl/5 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Categories ({categories.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div key={category.id}>
                {/* Show edit form if this category is being edited */}
                {editingCategory?.id === category.id ? (
                  <CategoryForm
                    category={category}
                    onSubmit={handleUpdate}
                    onCancel={handleCancelEdit}
                    isLoading={isUpdating}
                    showCancel
                  />
                ) : (
                  /* Normal category display */
                  <div className="group relative rounded-lg border p-4 hover:bg-muted/50 transition-colors">
                    {/* Category Header */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full border border-border"
                          style={{ backgroundColor: category.color }}
                        />
                        <h3 className="font-medium truncate">
                          {category.name}
                        </h3>
                      </div>

                      {/* Actions Menu */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(category)}
                            disabled={isUpdating || isDeleting}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(category)}
                            className="text-destructive"
                            disabled={isUpdating || isDeleting}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    {/* Category Stats */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tasks</span>
                        <Badge variant="secondary">
                          {category?.taskCount || 0}
                        </Badge>
                      </div>

                      {category.createdAt && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Created</span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(category.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingCategory} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the category "
              <span className="font-medium">{deletingCategory?.name}</span>"?
              {deletingCategory && deletingCategory?.taskCount > 0 && (
                <>
                  <br />
                  <br />
                  <span className="text-destructive font-medium">
                    Warning: This category has {deletingCategory?.taskCount}{" "}
                    task(s). These tasks will be moved to "Uncategorized".
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDeleteCancel}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Category
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
