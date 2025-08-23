import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { PageLoading } from "@/components/common/LoadingState";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

// Lazy load pages for better performance
const LoginPage = React.lazy(() =>
  import("@/pages/auth/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const AppLayout = React.lazy(() =>
  import("@/components/layout/AppLayout").then((m) => ({
    default: m.AppLayout,
  }))
);
const DashboardPage = React.lazy(() =>
  import("@/pages/dashboard/DashboardPage").then((m) => ({
    default: m.DashboardPage,
  }))
);
const TasksPage = React.lazy(() =>
  import("@/pages/dashboard/TasksPage").then((m) => ({ default: m.TasksPage }))
);
const CategoriesPage = React.lazy(() =>
  import("@/pages/dashboard/CategoriesPage").then((m) => ({
    default: m.CategoriesPage,
  }))
);
const ProfilePage = React.lazy(() =>
  import("@/pages/dashboard/ProfilePage").then((m) => ({
    default: m.ProfilePage,
  }))
);
const SettingsPage = React.lazy(() =>
  import("@/pages/dashboard/SettingsPage").then((m) => ({
    default: m.SettingsPage,
  }))
);

function App() {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const handleAuthLogout = () => {
      queryClient.clear();
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, [queryClient]);

  return (
    <div className="min-h-screen bg-background">
      <Suspense fallback={<PageLoading message="Loading application..." />}>
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
            <Route index element={<DashboardPage />} />
            <Route path="tasks" element={<TasksPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
