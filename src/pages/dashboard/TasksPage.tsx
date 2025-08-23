import React, { useState } from "react";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Filter,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { TaskForm } from "@/components/forms/TaskForm";
import { TaskList } from "@/components/tasks/TaskList";
import { useTasks } from "@/hooks/useTasks";
import { useCategories } from "@/hooks/useCategories";
import {
  TaskStatus,
  Priority,
  type Task,
  type TaskQueryParams,
  type CreateTaskData,
  type UpdateTaskData,
} from "@/types/task.types";

export const TasksPage: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [filters, setFilters] = useState<TaskQueryParams>({
    page: 1,
    limit: 10,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const {
    tasks,
    pagination,
    taskStats,
    isTasksLoading,
    isStatsLoading,
    createTask,
    updateTask,
    deleteTask,
    isCreatingTask,
    isUpdatingTask,
    isDeletingTask,
  } = useTasks(filters);

  const { categories, isCategoriesLoading } = useCategories();

  const handleCreateTask = (data: CreateTaskData) => {
    createTask(data);
    setShowCreateDialog(false);
  };

  const handleUpdateTask = (taskId: string, data: UpdateTaskData) => {
    updateTask(taskId, data);
    setShowEditDialog(false);
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowEditDialog(true);
  };

  const handleFiltersChange = (newFilters: TaskQueryParams) => {
    setFilters(newFilters);
  };

  const handleCloseCreateDialog = () => {
    setShowCreateDialog(false);
  };

  const handleCloseEditDialog = () => {
    setShowEditDialog(false);
    setEditingTask(null);
  };

  // Quick filter functions
  const applyQuickFilter = (filterType: string) => {
    const baseFilters = {
      page: 1,
      limit: 10,
      sortBy: "createdAt",
      sortOrder: "desc" as const,
    };

    switch (filterType) {
      case "todo":
        setFilters({ ...baseFilters, status: TaskStatus.TODO });
        break;
      case "in-progress":
        setFilters({ ...baseFilters, status: TaskStatus.IN_PROGRESS });
        break;
      case "completed":
        setFilters({ ...baseFilters, status: TaskStatus.DONE });
        break;
      case "high-priority":
        setFilters({ ...baseFilters, priority: Priority.HIGH });
        break;
      case "urgent":
        setFilters({ ...baseFilters, priority: Priority.URGENT });
        break;
      default:
        setFilters(baseFilters);
    }
  };

  // Loading states
  if (isTasksLoading && !tasks.length) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-8 bg-muted rounded animate-pulse w-32" />
            <div className="h-4 bg-muted rounded animate-pulse w-64" />
          </div>
          <div className="h-10 bg-muted rounded animate-pulse w-32" />
        </div>

        {/* Stats Loading */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card className="shadow-2xl/5 border-0" key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded animate-pulse w-20" />
                <div className="h-4 w-4 bg-muted rounded animate-pulse" />
              </CardHeader>
              <CardContent>
                <div className="h-6 bg-muted rounded animate-pulse w-16 mb-2" />
                <div className="h-3 bg-muted rounded animate-pulse w-24" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Task List Loading */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="w-4 h-4 bg-muted rounded-full animate-pulse" />
                  <div className="flex-1">
                    <div className="h-4 bg-muted rounded animate-pulse w-2/3 mb-2" />
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
            <CheckCircle className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Tasks</h1>
          </div>
          <p className="text-muted-foreground">
            Manage and organize all your tasks in one place.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Create Task Dialog */}
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Task
              </Button>
            </DialogTrigger>
            {!isCategoriesLoading && (
              <TaskForm
                categories={categories}
                onSubmit={handleCreateTask}
                onCancel={handleCloseCreateDialog}
                isLoading={isCreatingTask}
              />
            )}
          </Dialog>
        </div>
      </div>

      {/* Task Statistics */}
      {!isStatsLoading && taskStats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="shadow-2xl/5 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{taskStats.totalTasks}</div>
              <p className="text-xs text-muted-foreground">
                All time tasks created
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-2xl/5 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {taskStats.completedTasks}
              </div>
              <p className="text-xs text-muted-foreground">
                {taskStats.completionRate}% completion rate
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-2xl/5 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Progress</CardTitle>
              <Clock className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {taskStats.statusBreakdown[TaskStatus.IN_PROGRESS] || 0}
              </div>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </CardContent>
          </Card>

          <Card className="shadow-2xl/5 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">To Do</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {taskStats.statusBreakdown[TaskStatus.TODO] || 0}
              </div>
              <p className="text-xs text-muted-foreground">Pending tasks</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Quick Actions */}
      <Card className="shadow-2xl/5 border-0">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Quick Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter("all")}
              className="gap-2"
            >
              <BarChart3 className="h-3 w-3" />
              All Tasks
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter("todo")}
              className="gap-2"
            >
              <AlertCircle className="h-3 w-3" />
              To Do
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter("in-progress")}
              className="gap-2"
            >
              <Clock className="h-3 w-3" />
              In Progress
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter("completed")}
              className="gap-2"
            >
              <CheckCircle className="h-3 w-3" />
              Completed
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter("urgent")}
              className="gap-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              🔴 Urgent
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => applyQuickFilter("high-priority")}
              className="gap-2 text-orange-600 border-orange-200 hover:bg-orange-50"
            >
              🟡 High Priority
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <TaskList
        tasks={tasks}
        categories={categories}
        pagination={pagination}
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onEdit={handleEditTask}
        onFiltersChange={handleFiltersChange}
        filters={filters}
        isUpdating={isUpdatingTask}
        isDeleting={isDeletingTask}
      />

      {/* Edit Task Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        {!isCategoriesLoading && editingTask && (
          <TaskForm
            task={editingTask}
            categories={categories}
            onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
            onCancel={handleCloseEditDialog}
            isLoading={isUpdatingTask}
          />
        )}
      </Dialog>

      {/* Productivity Tips */}
      {taskStats && taskStats.totalTasks > 0 && (
        <Card className="bg-muted/30 border-dashed">
          <CardContent className="pt-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  Productivity Insight
                </h4>
                <p className="text-sm text-muted-foreground">
                  You have a {taskStats.completionRate}% completion rate.
                  {taskStats.completionRate > 80
                    ? " Excellent work! You're highly productive."
                    : taskStats.completionRate > 60
                    ? " Good progress! Try to focus on fewer tasks at once."
                    : " Consider breaking large tasks into smaller, manageable pieces."}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Priority Focus
                </h4>
                <p className="text-sm text-muted-foreground">
                  You have{" "}
                  {(taskStats.priorityBreakdown[Priority.URGENT] || 0) +
                    (taskStats.priorityBreakdown[Priority.HIGH] || 0)}{" "}
                  high-priority tasks.
                  {(taskStats.priorityBreakdown[Priority.URGENT] || 0) > 0
                    ? " Focus on urgent tasks first to avoid stress."
                    : " Good balance! Keep prioritizing effectively."}
                </p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-purple-500" />
                  Organization Tip
                </h4>
                <p className="text-sm text-muted-foreground">
                  {taskStats.statusBreakdown[TaskStatus.IN_PROGRESS] > 5
                    ? "You have many tasks in progress. Consider finishing some before starting new ones."
                    : "Great organization! Use categories and due dates to stay on track."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
