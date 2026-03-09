import React from "react";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { LoginForm } from "@/components/forms/LoginForm";
import { useAuth } from "@/hooks/useAuth";
import type { LoginCredentials } from "@/types/auth.types";

export const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { login, isLoginLoading } = useAuth();

  const handleLogin = (data: LoginCredentials) => {
    login(data);
  };

  return (
    <AuthLayout
      title={t("auth.login.title")}
      description={t("auth.login.description")}
    >
      <LoginForm onSubmit={handleLogin} isLoading={isLoginLoading} />
    </AuthLayout>
  );
};
