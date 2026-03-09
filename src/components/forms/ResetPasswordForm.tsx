"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface ResetPasswordFormProps {
  onSubmit: (password: string) => void;
  isLoading?: boolean;
}

export const ResetPasswordForm: React.FC<ResetPasswordFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const resetPasswordSchema = z
    .object({
      newPassword: z.string().min(8, t("auth.errors.passwordMin")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("auth.errors.passwordsDontMatch"),
      path: ["confirmPassword"],
    });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ newPassword: string; confirmPassword: string }>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const handleFormSubmit = (data: {
    newPassword: string;
    confirmPassword: string;
  }) => {
    onSubmit(data.newPassword);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          {t("auth.resetPassword.instructions")}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">{t("auth.resetPassword.newPassword")}</Label>
        <Input
          id="newPassword"
          type="password"
          placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
          {...register("newPassword")}
          className={errors.newPassword ? "border-destructive" : ""}
        />
        {errors.newPassword && (
          <p className="text-sm text-destructive">
            {errors.newPassword.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t("auth.resetPassword.confirmPassword")}</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={t("auth.resetPassword.confirmPlaceholder")}
          {...register("confirmPassword")}
          className={errors.confirmPassword ? "border-destructive" : ""}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("auth.resetPassword.submitting") : t("auth.resetPassword.submit")}
      </Button>
    </form>
  );
};
