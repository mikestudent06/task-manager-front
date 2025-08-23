"use client";

import React, { Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { PageLoading } from "@/components/common/LoadingState";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";

// Lazy load pages for better performance
const LoginPage = React.lazy(() =>
  import("@/pages/auth/LoginPage").then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = React.lazy(() =>
  import("@/pages/auth/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const VerifyOtpPage = React.lazy(() =>
  import("@/pages/auth/VerifyOtpPage").then((m) => ({
    default: m.VerifyOtpPage,
  }))
);
const ForgotPasswordPage = React.lazy(() =>
  import("@/pages/auth/ForgotPasswordPage").then((m) => ({
    default: m.ForgotPasswordPage,
  }))
);
const ResetPasswordPage = React.lazy(() =>
  import("@/pages/auth/ResetPasswordPage").then((m) => ({
    default: m.ResetPasswordPage,
  }))
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
          <Route path="/auth/register" element={<RegisterPage />} />
          <Route path="/auth/verify-otp" element={<VerifyOtpPage />} />
          <Route
            path="/auth/forgot-password"
            element={<ForgotPasswordPage />}
          />
          <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

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
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
