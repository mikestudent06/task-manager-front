import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const TasksPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Tasks</h1>
        <p className="text-muted-foreground">Manage all your tasks here.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Task Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Task management features will be implemented in Phase F5.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
