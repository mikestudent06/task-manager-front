import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { LoginPage } from "@/pages/auth/LoginPage";
import { AppLayout } from "@/components/layout/AppLayout";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { TasksPage } from "@/pages/dashboard/TasksPage";
import { CategoriesPage } from "@/pages/dashboard/CategoriesPage";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

function App() {
  const queryClient = useQueryClient();

  // Handle auth logout events from axios interceptor
  React.useEffect(() => {
    const handleAuthLogout = () => {
      queryClient.clear();
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Public Auth Routes */}
        <Route path="/auth/login" element={<LoginPage />} />

        {/* Protected App Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Nested dashboard routes */}
          <Route index element={<DashboardPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="categories" element={<CategoriesPage />} />
        </Route>

        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </div>
  );
}

export default App;
