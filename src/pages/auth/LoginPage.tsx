import React from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/forms/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import type { LoginCredentials } from "@/types/auth.types";

export const LoginPage: React.FC = () => {
  const { login, isLoginLoading } = useAuth();

  const handleLogin = (data: LoginCredentials) => {
    login(data);
  };

  return (
    <AuthLayout
      title="Welcome Back"
      description="Sign in to your account to continue"
    >
      <LoginForm onSubmit={handleLogin} isLoading={isLoginLoading} />
    </AuthLayout>
  );
};
