"use client";

import type React from "react";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { useAuth } from "@/hooks/useAuth";
import type { ForgotPasswordData } from "@/types/auth.types";

export const ForgotPasswordPage: React.FC = () => {
  const { forgotPassword, isForgotPasswordLoading } = useAuth();

  const handleForgotPassword = (data: ForgotPasswordData) => {
    forgotPassword(data);
  };

  return (
    <AuthLayout
      title="Reset Password"
      description="We'll send you a link to reset your password"
    >
      <ForgotPasswordForm
        onSubmit={handleForgotPassword}
        isLoading={isForgotPasswordLoading}
      />
    </AuthLayout>
  );
};
