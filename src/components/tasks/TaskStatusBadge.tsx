import React from "react";
import { Badge } from "@/components/ui/badge";
import { TaskStatus, Priority } from "@/types/task.types";

interface TaskStatusBadgeProps {
  status: TaskStatus;
  className?: string;
}

interface TaskPriorityBadgeProps {
  priority: Priority;
  className?: string;
}

const statusConfig = {
  [TaskStatus.TODO]: {
    label: "To Do",
    variant: "secondary" as const,
    className: "bg-gray-100 text-gray-800 hover:bg-gray-200",
  },
  [TaskStatus.IN_PROGRESS]: {
    label: "In Progress",
    variant: "default" as const,
    className: "bg-blue-100 text-blue-800 hover:bg-blue-200",
  },
  [TaskStatus.DONE]: {
    label: "Done",
    variant: "default" as const,
    className: "bg-green-100 text-green-800 hover:bg-green-200",
  },
  [TaskStatus.CANCELLED]: {
    label: "Cancelled",
    variant: "destructive" as const,
    className: "bg-red-100 text-red-800 hover:bg-red-200",
  },
};

const priorityConfig = {
  [Priority.LOW]: {
    label: "Low",
    className: "bg-gray-100 text-gray-600 hover:bg-gray-200",
  },
  [Priority.MEDIUM]: {
    label: "Medium",
    className: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  },
  [Priority.HIGH]: {
    label: "High",
    className: "bg-orange-100 text-orange-700 hover:bg-orange-200",
  },
  [Priority.URGENT]: {
    label: "Urgent",
    className: "bg-red-100 text-red-700 hover:bg-red-200",
  },
};

export const TaskStatusBadge: React.FC<TaskStatusBadgeProps> = ({
  status,
  className = "",
}) => {
  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className}`}
    >
      {config.label}
    </Badge>
  );
};

export const TaskPriorityBadge: React.FC<TaskPriorityBadgeProps> = ({
  priority,
  className = "",
}) => {
  const config = priorityConfig[priority];

  return (
    <Badge
      variant="outline"
      className={`${config.className} ${className} border-0`}
    >
      {config.label}
    </Badge>
  );
};
