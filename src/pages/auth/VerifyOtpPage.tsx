"use client";

import type React from "react";
import { useSearchParams } from "react-router-dom";
import { AuthLayout } from "@/components/layout/AuthLayout";
import { OtpForm } from "@/components/forms/OtpForm";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";

export const VerifyOtpPage: React.FC = () => {
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
      title="Verify Your Account"
      description="Enter the verification code sent to your email"
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
