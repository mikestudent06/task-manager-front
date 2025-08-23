import React, { useState, useEffect, useCallback } from "react";
import { format, isAfter, isToday, isTomorrow, isPast } from "date-fns";
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Calendar,
  Flag,
  Tag,
  Clock,
  CheckCircle,
  Circle,
  AlertCircle,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { TaskStatus, Priority } from "@/types/task.types";
import type {
  Category,
  Task,
  TaskQueryParams,
  UpdateTaskData,
} from "@/types/task.types";

interface TaskListProps {
  tasks: Task[];
  categories: Category[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  onUpdate: (taskId: string, data: UpdateTaskData) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void; // New prop for editing
  onFiltersChange: (filters: TaskQueryParams) => void;
  filters: TaskQueryParams;
  isUpdating?: boolean;
  isDeleting?: boolean;
}

const PRIORITY_CONFIG = {
  [Priority.LOW]: { label: "Low", color: "bg-gray-500", icon: "🟢" },
  [Priority.MEDIUM]: { label: "Medium", color: "bg-blue-500", icon: "🔵" },
  [Priority.HIGH]: { label: "High", color: "bg-orange-500", icon: "🟡" },
  [Priority.URGENT]: { label: "Urgent", color: "bg-red-500", icon: "🔴" },
};

const STATUS_CONFIG = {
  [TaskStatus.TODO]: { label: "To Do", color: "bg-gray-500", icon: Circle },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    color: "bg-blue-500",
    icon: Clock,
  },
  [TaskStatus.DONE]: {
    label: "Done",
    color: "bg-green-500",
    icon: CheckCircle,
  },
  [TaskStatus.CANCELLED]: {
    label: "Cancelled",
    color: "bg-red-500",
    icon: AlertCircle,
  },
};

// Custom hook for debounced value
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  categories,
  pagination,
  onUpdate,
  onDelete,
  onEdit,
  onFiltersChange,
  filters,
  isUpdating = false,
  isDeleting = false,
}) => {
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [searchTerm, setSearchTerm] = useState(filters.search || "");
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search term with 400ms delay
  const debouncedSearchTerm = useDebounce(searchTerm, 400);

  // Effect to trigger search when debounced value changes
  useEffect(() => {
    if (debouncedSearchTerm !== (filters.search || "")) {
      setIsSearching(true);
      onFiltersChange({
        ...filters,
        search: debouncedSearchTerm || undefined,
        page: 1,
      });
    }
  }, [debouncedSearchTerm]);

  // Reset searching state when new data arrives
  useEffect(() => {
    setIsSearching(false);
  }, [tasks]);

  const handleStatusChange = (task: Task, newStatus: TaskStatus) => {
    onUpdate(task.id, { status: newStatus });
  };

  const handleDeleteClick = (task: Task) => {
    setDeletingTask(task);
  };

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      onDelete(deletingTask.id);
      setDeletingTask(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeletingTask(null);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value === "") {
      // Clear search immediately when input is cleared
      onFiltersChange({ ...filters, search: undefined, page: 1 });
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    onFiltersChange({ ...filters, search: undefined, page: 1 });
  };

  const handleFilterChange = (key: keyof TaskQueryParams, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value === "all" ? undefined : value,
      page: 1,
    });
  };

  const handleSortChange = (sortBy: string) => {
    const newSortOrder =
      filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc";
    onFiltersChange({ ...filters, sortBy, sortOrder: newSortOrder, page: 1 });
  };

  const getTaskStatusIcon = (task: Task) => {
    const IconComponent = STATUS_CONFIG[task.status].icon;
    return (
      <IconComponent
        className={cn(
          "h-4 w-4 transition-colors",
          task.status === TaskStatus.DONE && "text-green-600",
          task.status === TaskStatus.IN_PROGRESS && "text-blue-600",
          task.status === TaskStatus.CANCELLED && "text-red-600",
          task.status === TaskStatus.TODO && "text-gray-400"
        )}
      />
    );
  };

  const getDueDateInfo = (dueDate: Date | null) => {
    if (!dueDate) return null;

    const date = new Date(dueDate);
    const isOverdue = isPast(date) && !isToday(date);
    const isDueToday = isToday(date);
    const isDueTomorrow = isTomorrow(date);

    let variant: "default" | "secondary" | "destructive" | "outline" =
      "outline";
    let text = format(date, "MMM d");

    if (isOverdue) {
      variant = "destructive";
      text = `Overdue (${format(date, "MMM d")})`;
    } else if (isDueToday) {
      variant = "default";
      text = "Due Today";
    } else if (isDueTomorrow) {
      variant = "secondary";
      text = "Due Tomorrow";
    }

    return { variant, text, isOverdue, isDueToday };
  };

  const activeFiltersCount = [
    filters.status,
    filters.priority,
    filters.categoryId,
    filters.search,
  ].filter(Boolean).length;

  return (
    <>
      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
                </div>
              )}
            </div>

            {/* Search indicator */}
            {searchTerm && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {isSearching
                    ? "Searching..."
                    : `Found ${
                        pagination?.total || tasks.length
                      } results for "${searchTerm}"`}
                </span>
                {!isSearching && (
                  <Button variant="ghost" size="sm" onClick={clearSearch}>
                    Clear search
                  </Button>
                )}
              </div>
            )}

            {/* Filters Row */}
            <div className="flex flex-wrap gap-4 items-center">
              {/* Status Filter */}
              <Select
                value={filters.status || "all"}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  {Object.entries(STATUS_CONFIG).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center gap-2">
                        <div
                          className={cn("w-2 h-2 rounded-full", config.color)}
                        />
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Priority Filter */}
              <Select
                value={filters.priority || "all"}
                onValueChange={(value) => handleFilterChange("priority", value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priorities</SelectItem>
                  {Object.entries(PRIORITY_CONFIG).map(([priority, config]) => (
                    <SelectItem key={priority} value={priority}>
                      <div className="flex items-center gap-2">
                        <span>{config.icon}</span>
                        {config.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select
                value={filters.categoryId || "all"}
                onValueChange={(value) =>
                  handleFilterChange("categoryId", value)
                }
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="none">No Category</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full border"
                          style={{ backgroundColor: category.color }}
                        />
                        {category.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Sort Options */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    {filters.sortOrder === "desc" ? (
                      <SortDesc className="h-4 w-4" />
                    ) : (
                      <SortAsc className="h-4 w-4" />
                    )}
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => handleSortChange("createdAt")}
                  >
                    Date Created
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("dueDate")}>
                    Due Date
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleSortChange("priority")}
                  >
                    Priority
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSortChange("title")}>
                    Title
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Active filters indicator */}
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Filter className="h-3 w-3" />
                  {activeFiltersCount} filter{activeFiltersCount > 1 ? "s" : ""}{" "}
                  active
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Clock className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {activeFiltersCount > 0 || searchTerm
                ? "No tasks match your criteria"
                : "No tasks yet"}
            </h3>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              {activeFiltersCount > 0 || searchTerm
                ? "Try adjusting your search or filters to find tasks."
                : "Create your first task to start organizing your work."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => {
            const dueDateInfo = getDueDateInfo(task.dueDate);
            const isCompleted = task.status === TaskStatus.DONE;

            return (
              <Card
                key={task.id}
                className={cn(
                  "group hover:shadow-md transition-all duration-200",
                  isCompleted && "opacity-75"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    {/* Status Toggle */}
                    <button
                      onClick={() =>
                        handleStatusChange(
                          task,
                          task.status === TaskStatus.DONE
                            ? TaskStatus.TODO
                            : TaskStatus.DONE
                        )
                      }
                      className="flex-shrink-0 hover:bg-muted rounded p-1 transition-colors"
                      disabled={isUpdating}
                    >
                      {getTaskStatusIcon(task)}
                    </button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3
                          className={cn(
                            "font-medium truncate",
                            isCompleted && "line-through text-muted-foreground"
                          )}
                        >
                          {task.title}
                        </h3>

                        {/* Actions */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                              disabled={isUpdating || isDeleting}
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => onEdit(task)}
                              disabled={isUpdating || isDeleting}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>Quick Status</DropdownMenuLabel>
                            {Object.entries(STATUS_CONFIG).map(
                              ([status, config]) => (
                                <DropdownMenuItem
                                  key={status}
                                  onClick={() =>
                                    handleStatusChange(
                                      task,
                                      status as TaskStatus
                                    )
                                  }
                                  disabled={task.status === status}
                                >
                                  <config.icon className="mr-2 h-4 w-4" />
                                  {config.label}
                                </DropdownMenuItem>
                              )
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(task)}
                              className="text-destructive"
                              disabled={isUpdating || isDeleting}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Description */}
                      {task.description && (
                        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Meta Information */}
                      <div className="flex items-center gap-3 flex-wrap">
                        {/* Priority */}
                        <Badge variant="outline" className="text-xs">
                          <span className="mr-1">
                            {PRIORITY_CONFIG[task.priority].icon}
                          </span>
                          {PRIORITY_CONFIG[task.priority].label}
                        </Badge>

                        {/* Category */}
                        {task.category && (
                          <Badge variant="outline" className="text-xs">
                            <div
                              className="mr-1 w-2 h-2 rounded-full border"
                              style={{ backgroundColor: task.category.color }}
                            />
                            {task.category.name}
                          </Badge>
                        )}

                        {/* Due Date */}
                        {dueDateInfo && (
                          <Badge
                            variant={dueDateInfo.variant}
                            className="text-xs"
                          >
                            <Calendar className="mr-1 h-3 w-3" />
                            {dueDateInfo.text}
                          </Badge>
                        )}

                        {/* Created Date */}
                        <span className="text-xs text-muted-foreground">
                          Created{" "}
                          {format(new Date(task.createdAt), "MMM d, yyyy")}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} tasks
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onFiltersChange({ ...filters, page: (filters.page || 1) - 1 })
              }
              disabled={pagination.page <= 1}
            >
              Previous
            </Button>
            <span className="text-sm px-3 py-1 bg-muted rounded">
              {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                onFiltersChange({ ...filters, page: (filters.page || 1) + 1 })
              }
              disabled={pagination.page >= pagination.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingTask} onOpenChange={handleDeleteCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the task "
              <span className="font-medium">{deletingTask?.title}</span>"? This
              action cannot be undone.
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
              Delete Task
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
