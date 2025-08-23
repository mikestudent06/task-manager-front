"use client";

import type React from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTasks } from "@/hooks/useTasks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TaskStatus, Priority } from "@/types/task.types";
import {
  CheckSquare,
  Clock,
  AlertCircle,
  Trophy,
  TrendingUp,
} from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { tasks, taskStats, isTasksLoading, isStatsLoading } = useTasks({
    limit: 4, // Get recent 4 tasks for the recent tasks section
    sortBy: "updatedAt",
    sortOrder: "desc",
  });

  if (!user) return null;

  // Show loading skeleton if data is still loading
  if (isStatsLoading || isTasksLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
          <p className="text-muted-foreground">Loading your task overview...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="shadow-lg border-0">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-24 animate-pulse"></div>
                <div className="h-5 w-5 bg-muted rounded animate-pulse"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-12 mb-2 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-20 mb-1 animate-pulse"></div>
                <div className="h-3 bg-muted rounded w-24 animate-pulse"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Dynamic stats based on real data
  const stats = [
    {
      title: "Total Tasks",
      value: taskStats?.totalTasks?.toString() || "0",
      icon: CheckSquare,
      description: "All your tasks",
      trend: `${taskStats?.totalTasks || 0} tasks total`,
      color: "text-blue-600",
    },
    {
      title: "In Progress",
      value:
        taskStats?.statusBreakdown?.[TaskStatus.IN_PROGRESS]?.toString() || "0",
      icon: Clock,
      description: "Currently working on",
      trend: `${
        taskStats?.statusBreakdown?.[TaskStatus.IN_PROGRESS] || 0
      } active tasks`,
      color: "text-orange-600",
    },
    {
      title: "Todo",
      value: taskStats?.statusBreakdown?.[TaskStatus.TODO]?.toString() || "0",
      icon: AlertCircle,
      description: "Ready to start",
      trend: `${taskStats?.statusBreakdown?.[TaskStatus.TODO] || 0} pending`,
      color: "text-red-600",
    },
    {
      title: "Completed",
      value: taskStats?.completedTasks?.toString() || "0",
      icon: Trophy,
      description: "Finished tasks",
      trend: `${Math.round(taskStats?.completionRate || 0)}% completion rate`,
      color: "text-green-600",
    },
  ];

  // Calculate completion percentage
  const completionPercentage = Math.round(taskStats?.completionRate || 0);

  // Get priority color and background
  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return "bg-purple-100 text-purple-800";
      case Priority.HIGH:
        return "bg-red-100 text-red-800";
      case Priority.MEDIUM:
        return "bg-yellow-100 text-yellow-800";
      case Priority.LOW:
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get status style
  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.DONE:
        return "bg-green-100 text-green-800";
      case TaskStatus.IN_PROGRESS:
        return "bg-blue-100 text-blue-800";
      case TaskStatus.TODO:
        return "bg-gray-100 text-gray-800";
      case TaskStatus.CANCELLED:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format status for display
  const formatStatus = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.IN_PROGRESS:
        return "In Progress";
      case TaskStatus.TODO:
        return "Todo";
      case TaskStatus.DONE:
        return "Done";
      case TaskStatus.CANCELLED:
        return "Cancelled";
      default:
        return status;
    }
  };

  // Format priority for display
  const formatPriority = (priority: Priority) => {
    switch (priority) {
      case Priority.LOW:
        return "Low";
      case Priority.MEDIUM:
        return "Medium";
      case Priority.HIGH:
        return "High";
      case Priority.URGENT:
        return "Urgent";
      default:
        return priority;
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Welcome section */}
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.name}!</h1>
        <p className="text-muted-foreground">
          Here's what's happening with your tasks today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="shadow-2xl/5 border-0">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mb-1">
                {stat.description}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className="h-3 w-3 mr-1" />
                {stat.trend}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent tasks and productivity overview */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-2xl/5 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Recent Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks && tasks.length > 0 ? (
                tasks.slice(0, 4).map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{task.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span
                          className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityStyle(
                            task.priority
                          )}`}
                        >
                          {formatPriority(task.priority)}
                        </span>
                        {task.category && (
                          <span className="text-xs">
                            • {task.category.name}
                          </span>
                        )}
                        {task.dueDate && (
                          <span className="text-xs">
                            • Due: {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${getStatusStyle(
                        task.status
                      )}`}
                    >
                      {formatStatus(task.status)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No tasks yet. Create your first task to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-2xl/5 border-0">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Productivity Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Overall Progress</span>
                  <span>{completionPercentage}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Tasks Completed</span>
                  <span>
                    {taskStats?.completedTasks || 0}/
                    {taskStats?.totalTasks || 0}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${completionPercentage}%` }}
                  ></div>
                </div>
              </div>

              {/* Task breakdown by status */}
              <div className="pt-2 border-t">
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-medium text-gray-600">
                      {taskStats?.statusBreakdown?.[TaskStatus.TODO] || 0}
                    </div>
                    <div className="text-muted-foreground">Todo</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-blue-600">
                      {taskStats?.statusBreakdown?.[TaskStatus.IN_PROGRESS] ||
                        0}
                    </div>
                    <div className="text-muted-foreground">Active</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-green-600">
                      {taskStats?.statusBreakdown?.[TaskStatus.DONE] || 0}
                    </div>
                    <div className="text-muted-foreground">Done</div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-red-600">
                      {taskStats?.statusBreakdown?.[TaskStatus.CANCELLED] || 0}
                    </div>
                    <div className="text-muted-foreground">Cancelled</div>
                  </div>
                </div>
              </div>

              {/* Priority breakdown */}
              <div className="pt-2 border-t">
                <div className="text-xs text-muted-foreground mb-2">
                  Priority Distribution:
                </div>
                <div className="grid grid-cols-4 gap-1 text-xs">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                    <span>
                      {taskStats?.priorityBreakdown?.[Priority.URGENT] || 0}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                    <span>
                      {taskStats?.priorityBreakdown?.[Priority.HIGH] || 0}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                    <span>
                      {taskStats?.priorityBreakdown?.[Priority.MEDIUM] || 0}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                    <span>
                      {taskStats?.priorityBreakdown?.[Priority.LOW] || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  {completionPercentage >= 80
                    ? "Excellent work! You're crushing your tasks! 🎉"
                    : completionPercentage >= 50
                    ? "Great progress! Keep up the momentum! 💪"
                    : taskStats?.totalTasks === 0
                    ? "Ready to start? Create your first task!"
                    : "You've got this! Stay focused on your goals! 🚀"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick actions will be implemented in future version */}
      {/* <Card className="shadow-2xl/5 border-0">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 cursor-pointer hover:bg-primary/10 transition-colors">
              <CheckSquare className="h-8 w-8 text-primary mb-2" />
              <h3 className="font-medium mb-1">Create Task</h3>
              <p className="text-sm text-muted-foreground">
                Add a new task to your list
              </p>
            </div>

            <div className="p-4 rounded-lg bg-blue-50 border border-blue-200 cursor-pointer hover:bg-blue-100 transition-colors">
              <Tag className="h-8 w-8 text-blue-600 mb-2" />
              <h3 className="font-medium mb-1">Manage Categories</h3>
              <p className="text-sm text-muted-foreground">
                Organize your tasks better
              </p>
            </div>

            <div className="p-4 rounded-lg bg-green-50 border border-green-200 cursor-pointer hover:bg-green-100 transition-colors">
              <Trophy className="h-8 w-8 text-green-600 mb-2" />
              <h3 className="font-medium mb-1">View All Tasks</h3>
              <p className="text-sm text-muted-foreground">
                See all your tasks and progress
              </p>
            </div>
          </div>
        </CardContent>
      </Card> */}
    </div>
  );
};
