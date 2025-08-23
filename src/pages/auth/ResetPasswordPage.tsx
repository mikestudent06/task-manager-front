"use client";

import type React from "react";
import { useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { useAuth } from "@/hooks/useAuth";

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  console.log("searchParams", searchParams);
  const resetToken = searchParams.get("token") || "";
  const { resetPassword, isResetPasswordLoading } = useAuth();

  const handleResetPassword = (newPassword: string) => {
    resetPassword({ resetToken, newPassword });
  };

  return (
    <AuthLayout
      title="Set New Password"
      description="Enter your new password below"
    >
      <ResetPasswordForm
        onSubmit={handleResetPassword}
        isLoading={isResetPasswordLoading}
      />
    </AuthLayout>
  );
};
