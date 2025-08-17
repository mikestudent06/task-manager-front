import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const CategoriesPage: React.FC = () => {
  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Categories</h1>
        <p className="text-muted-foreground">
          Organize your tasks with categories.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Category Management</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Category management features will be implemented in Phase F4.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
