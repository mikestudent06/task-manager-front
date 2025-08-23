import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  type Task,
  type CreateTaskData,
  type UpdateTaskData,
  Priority,
} from "@/types/task.types";
import { DatePicker } from "../common/DatePicker";

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  priority: z.nativeEnum(Priority),
  dueDate: z.string().optional(),
  categoryId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task; // If provided, it's edit mode
  categories: any[]; // Add categories as a required prop
  onSubmit: (data: CreateTaskData | UpdateTaskData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const PRIORITY_CONFIG = {
  [Priority.LOW]: {
    label: "Low",
    color: "bg-gray-500",
    icon: "🟢",
  },
  [Priority.MEDIUM]: {
    label: "Medium",
    color: "bg-blue-500",
    icon: "🔵",
  },
  [Priority.HIGH]: {
    label: "High",
    color: "bg-orange-500",
    icon: "🟡",
  },
  [Priority.URGENT]: {
    label: "Urgent",
    color: "bg-red-500",
    icon: "🔴",
  },
};

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
}) => {
  const isEditMode = !!task;
  console.log("task", task);
  console.log("isEditMode", isEditMode);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? Priority.MEDIUM,
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      categoryId: task?.category?.id ?? undefined,
    },
  });

  const watchedPriority = watch("priority");
  const watchedCategoryId = watch("categoryId");

  const selectedCategory = categories.find(
    (cat) => cat.id === watchedCategoryId
  );

  const handleFormSubmit = (data: TaskFormData) => {
    const submitData: CreateTaskData | UpdateTaskData = {
      title: data.title.trim(),
      description: data.description?.trim() || undefined,
      priority: data.priority,
      dueDate: data.dueDate || undefined,
      // Convert "no-category" back to undefined
      categoryId:
        data.categoryId === "no-category" ? undefined : data.categoryId,
    };

    onSubmit(submitData);
    reset({
      title: "",
      description: "",
      priority: "MEDIUM" as Priority,
      dueDate: undefined,
      categoryId: undefined,
    });
  };

  const handleReset = () => {
    reset({
      title: task?.title || "",
      description: task?.description || "",
      priority: (task?.priority || "MEDIUM") as Priority,
      dueDate: task?.dueDate
        ? new Date(task.dueDate).toISOString().split("T")[0]
        : "",
      categoryId: task?.category?.id || "no-category",
    });
  };

  return (
    <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle className="text-lg font-semibold">
          {isEditMode ? "Edit Task" : "Create New Task"}
        </DialogTitle>
      </DialogHeader>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title" className="text-sm font-medium">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="title"
            placeholder="Enter task title..."
            {...register("title")}
            className={
              errors.title ? "border-destructive focus:border-destructive" : ""
            }
            disabled={isLoading}
            autoFocus
          />
          {errors.title && (
            <p className="text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            placeholder="Add more details about this task..."
            rows={3}
            {...register("description")}
            className={
              errors.description
                ? "border-destructive focus:border-destructive"
                : ""
            }
            disabled={isLoading}
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Priority</Label>
          <Select
            value={watchedPriority}
            onValueChange={(value) =>
              setValue("priority", value as Priority, { shouldDirty: true })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue>
                {watchedPriority && (
                  <div className="flex items-center gap-2">
                    <span>{PRIORITY_CONFIG[watchedPriority].icon}</span>
                    <span>{PRIORITY_CONFIG[watchedPriority].label}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PRIORITY_CONFIG).map(([value, config]) => (
                <SelectItem key={value} value={value}>
                  <div className="flex items-center gap-2">
                    <span>{config.icon}</span>
                    <span>{config.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Category</Label>
          <Select
            value={watchedCategoryId}
            onValueChange={(value) =>
              setValue("categoryId", value, { shouldDirty: true })
            }
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue>
                {selectedCategory ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: selectedCategory.color }}
                    />
                    <span>{selectedCategory.name}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">
                    Select category (optional)
                  </span>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="no-category">
                <span className="text-muted-foreground">No Category</span>
              </SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full border"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {category.taskCount || 0}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Due Date */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Due Date</Label>
          <DatePicker
            value={watch("dueDate")}
            onChange={(date) =>
              setValue("dueDate", date, { shouldDirty: true })
            }
            placeholder="Set a deadline for this task"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Optional: Choose when this task should be completed
          </p>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>

          <div className="flex gap-2">
            {isEditMode && (
              <Button
                type="button"
                variant="ghost"
                onClick={handleReset}
                disabled={!isDirty || isLoading}
                size="sm"
              >
                Reset
              </Button>
            )}

            <Button
              type="submit"
              disabled={isLoading || (!isDirty && isEditMode)}
              className="min-w-[100px]"
            >
              {isLoading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                ? "Update Task"
                : "Create Task"}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
