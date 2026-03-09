"use client";

import type React from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ResetPasswordForm } from "@/components/forms/ResetPasswordForm";
import { useAuth } from "@/hooks/useAuth";

export const ResetPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const resetToken = searchParams.get("token") || "";
  const { resetPassword, isResetPasswordLoading } = useAuth();

  const handleResetPassword = (newPassword: string) => {
    resetPassword({ resetToken, newPassword });
  };

  return (
    <AuthLayout
      title={t("auth.resetPassword.title")}
      description={t("auth.resetPassword.description")}
    >
      <ResetPasswordForm
        onSubmit={handleResetPassword}
        isLoading={isResetPasswordLoading}
      />
    </AuthLayout>
  );
};
