"use client";

import type React from "react";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { ForgotPasswordForm } from "@/components/forms/ForgotPasswordForm";
import { useAuth } from "@/hooks/useAuth";
import type { ForgotPasswordData } from "@/types/auth.types";

export const ForgotPasswordPage: React.FC = () => {
  const { t } = useTranslation();
  const { forgotPassword, isForgotPasswordLoading } = useAuth();

  const handleForgotPassword = (data: ForgotPasswordData) => {
    forgotPassword(data);
  };

  return (
    <AuthLayout
      title={t("auth.forgotPassword.title")}
      description={t("auth.forgotPassword.description")}
    >
      <ForgotPasswordForm
        onSubmit={handleForgotPassword}
        isLoading={isForgotPasswordLoading}
      />
    </AuthLayout>
  );
};
