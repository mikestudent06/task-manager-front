"use client";

import type React from "react";
import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface OtpFormProps {
  onSubmit: (otp: string) => void;
  onResend: () => void;
  isLoading?: boolean;
  email: string;
}

export const OtpForm: React.FC<OtpFormProps> = ({
  onSubmit,
  onResend,
  isLoading = false,
  email,
}) => {
  const { t } = useTranslation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length === 6) {
      onSubmit(otpString);
    }
  };

  const handleResend = () => {
    onResend();
    setResendTimer(60);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          {t("auth.verifyOtp.sentTo")}
        </p>
        <p className="font-medium">{email}</p>
      </div>

      <div className="space-y-2">
        <Label>{t("auth.verifyOtp.enterCode")}</Label>
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el: HTMLInputElement | null): void => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-12 text-center text-lg font-semibold"
            />
          ))}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || otp.join("").length !== 6}
      >
        {isLoading ? t("auth.verifyOtp.verifying") : t("auth.verifyOtp.verify")}
      </Button>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-2">
          {t("auth.verifyOtp.noCode")}
        </p>
        <Button
          type="button"
          variant="ghost"
          onClick={handleResend}
          disabled={resendTimer > 0}
          className="text-primary"
        >
          {resendTimer > 0
            ? t("auth.verifyOtp.resendIn", { count: resendTimer })
            : t("auth.verifyOtp.resend")}
        </Button>
      </div>
    </form>
  );
};
