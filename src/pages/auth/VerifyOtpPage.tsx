"use client";

import type React from "react";
import { useTranslation } from "react-i18next";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { OtpForm } from "@/components/forms/OtpForm";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";

export const VerifyOtpPage: React.FC = () => {
  const { t } = useTranslation();
  const { userEmail } = useAuthStore();
  const email = userEmail || "";
  const { verifyOtp, resendOtp, isVerifyOtpLoading } = useAuth();

  const handleVerifyOtp = (otp: string) => {
    verifyOtp({ otp, email });
  };

  const handleResendOtp = () => {
    resendOtp(email);
  };

  return (
    <AuthLayout
      title={t("auth.verifyOtp.title")}
      description={t("auth.verifyOtp.description")}
    >
      <OtpForm
        onSubmit={handleVerifyOtp}
        onResend={handleResendOtp}
        isLoading={isVerifyOtpLoading}
        email={email}
      />
    </AuthLayout>
  );
};
