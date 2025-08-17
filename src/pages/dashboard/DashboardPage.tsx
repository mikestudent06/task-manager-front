import React from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckSquare, Clock, AlertCircle, Trophy } from "lucide-react";

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  // Placeholder stats (we'll connect to real data later)
  const stats = [
    {
      title: "Total Tasks",
      value: "12",
      icon: CheckSquare,
      description: "All your tasks",
    },
    {
      title: "In Progress",
      value: "4",
      icon: Clock,
      description: "Currently working on",
    },
    {
      title: "Due Today",
      value: "2",
      icon: AlertCircle,
      description: "Need attention",
    },
    {
      title: "Completed",
      value: "6",
      icon: Trophy,
      description: "This week",
    },
  ];

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
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent tasks section (placeholder) */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Task list will be implemented in the next phase.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
