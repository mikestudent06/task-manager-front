"use client";

import type React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { ForgotPasswordData } from "@/types/auth.types";

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordData) => void;
  isLoading?: boolean;
}

export const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const forgotPasswordSchema = z.object({
    email: z.string().email(t("auth.errors.invalidEmail")),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="text-center mb-4">
        <p className="text-sm text-muted-foreground">
          {t("auth.forgotPassword.instructions")}
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("auth.forgotPassword.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("auth.forgotPassword.emailPlaceholder")}
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("auth.forgotPassword.submitting") : t("auth.forgotPassword.submit")}
      </Button>

      <Separator />

      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          {t("auth.forgotPassword.rememberPassword")}{" "}
        </span>
        <Link
          to="/auth/login"
          className="text-sm text-primary hover:underline font-medium"
        >
          {t("auth.forgotPassword.signIn")}
        </Link>
      </div>
    </form>
  );
};
