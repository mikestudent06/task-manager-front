"use client";

import type React from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { RegisterForm } from "@/components/forms/RegisterForm";
import { useAuth } from "@/hooks/useAuth";
import type { RegisterCredentials } from "@/types/auth.types";
import { useAuthStore } from "@/stores/authStore";

export const RegisterPage: React.FC = () => {
  const { register, isRegisterLoading } = useAuth();
  const { setUserEmail } = useAuthStore();

  const handleRegister = (data: RegisterCredentials) => {
    register(data);
    setUserEmail(data.email);
  };

  return (
    <AuthLayout
      title="Create Account"
      description="Sign up to start organizing your tasks"
    >
      <RegisterForm onSubmit={handleRegister} isLoading={isRegisterLoading} />
    </AuthLayout>
  );
};
