import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  TaskStatus,
  Priority,
  type Task,
  type Category,
} from "@/types/task.types";
import type { CreateTaskData, UpdateTaskData } from "@/types/task.types";

const taskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters")
    .trim(),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  priority: z.nativeEnum(Priority),
  status: z.nativeEnum(TaskStatus).optional(),
  dueDate: z.date().optional(),
  categoryId: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  task?: Task; // If provided, we're editing
  categories: Category[];
  onSubmit: (data: CreateTaskData | UpdateTaskData) => void;
  onCancel?: () => void;
  isLoading?: boolean;
  showCancel?: boolean;
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

const STATUS_CONFIG = {
  [TaskStatus.TODO]: {
    label: "To Do",
    color: "bg-gray-500",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    color: "bg-blue-500",
  },
  [TaskStatus.DONE]: {
    label: "Done",
    color: "bg-green-500",
  },
  [TaskStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-red-500",
  },
};

export const TaskForm: React.FC<TaskFormProps> = ({
  task,
  categories,
  onSubmit,
  onCancel,
  isLoading = false,
  showCancel = false,
}) => {
  const isEditing = !!task;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
    watch,
    reset,
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? Priority.MEDIUM,
      status: task?.status ?? TaskStatus.TODO,
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      categoryId: task?.category?.id ?? "",
    },
  });

  const watchedPriority = watch("priority");
  const watchedStatus = watch("status");
  const watchedCategoryId = watch("categoryId");

  const selectedCategory = categories.find(
    (cat) => cat.id === watchedCategoryId
  );

  const handleFormSubmit = (data: TaskFormData) => {
    const submitData = {
      ...data,
      dueDate: data.dueDate ? data.dueDate.toISOString() : undefined,
      description: data.description || undefined,
      categoryId: data.categoryId || undefined,
    };

    // Remove status from create data (backend sets it to TODO by default)
    if (!isEditing) {
      const { status, ...createData } = submitData;
      onSubmit(createData);
    } else {
      onSubmit(submitData);
    }

    // Reset form after successful creation
    if (!isEditing) {
      reset({
        title: "",
        description: "",
        priority: Priority.MEDIUM,
        status: TaskStatus.TODO,
        dueDate: undefined,
        categoryId: "",
      });
    }
  };

  const handleReset = () => {
    reset({
      title: task?.title ?? "",
      description: task?.description ?? "",
      priority: task?.priority ?? Priority.MEDIUM,
      status: task?.status ?? TaskStatus.TODO,
      dueDate: task?.dueDate ? new Date(task.dueDate) : undefined,
      categoryId: task?.category?.id ?? "",
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          {isEditing ? "Edit Task" : "Create New Task"}
        </CardTitle>
        {showCancel && onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Complete project proposal"
              {...register("title")}
              className={errors.title ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add more details about this task..."
              rows={3}
              {...register("description")}
              className={errors.description ? "border-destructive" : ""}
              disabled={isLoading}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Priority and Status Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Priority */}
            <div className="space-y-2">
              <Label>Priority</Label>
              <Controller
                name="priority"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <span>{PRIORITY_CONFIG[watchedPriority].icon}</span>
                          <span>{PRIORITY_CONFIG[watchedPriority].label}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(PRIORITY_CONFIG).map(
                        ([value, config]) => (
                          <SelectItem key={value} value={value}>
                            <div className="flex items-center gap-2">
                              <span>{config.icon}</span>
                              <span>{config.label}</span>
                            </div>
                          </SelectItem>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Status (only for editing) */}
            {isEditing && (
              <div className="space-y-2">
                <Label>Status</Label>
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isLoading}
                    >
                      <SelectTrigger>
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            <div
                              className={cn(
                                "w-2 h-2 rounded-full",
                                STATUS_CONFIG[watchedStatus!].color
                              )}
                            />
                            <span>{STATUS_CONFIG[watchedStatus!].label}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(STATUS_CONFIG).map(
                          ([value, config]) => (
                            <SelectItem key={value} value={value}>
                              <div className="flex items-center gap-2">
                                <div
                                  className={cn(
                                    "w-2 h-2 rounded-full",
                                    config.color
                                  )}
                                />
                                <span>{config.label}</span>
                              </div>
                            </SelectItem>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>
            )}
          </div>

          {/* Due Date and Category Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button" // This is the fix - explicitly set type to button
                        variant="outline"
                        className={cn(
                          "justify-start text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                        disabled={isLoading}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label>Category</Label>
              <Controller
                name="categoryId"
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={isLoading}
                  >
                    <SelectTrigger>
                      <SelectValue>
                        {selectedCategory ? (
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full border"
                              style={{
                                backgroundColor: selectedCategory.color,
                              }}
                            />
                            <span>{selectedCategory.name}</span>
                          </div>
                        ) : (
                          <span className="text-muted-foreground">
                            Select category
                          </span>
                        )}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">
                        <div className="flex items-center gap-2">
                          <Tag className="h-3 w-3 text-muted-foreground" />
                          <span>No category</span>
                        </div>
                      </SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full border"
                              style={{ backgroundColor: category.color }}
                            />
                            <span>{category.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3 pt-4 border-t">
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
                ? "Update Task"
                : "Create Task"}
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
        </form>
      </CardContent>
    </Card>
  );
};
