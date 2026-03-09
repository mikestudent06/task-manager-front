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
import type { LoginCredentials } from "@/types/auth.types";

interface LoginFormProps {
  onSubmit: (data: LoginCredentials) => void;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const loginSchema = z.object({
    email: z.string().email(t("auth.errors.invalidEmail")),
    password: z.string().min(1, t("auth.errors.passwordRequired")),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginCredentials>({
    resolver: zodResolver(loginSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">{t("auth.login.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("auth.login.emailPlaceholder")}
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("auth.login.password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder={t("auth.login.passwordPlaceholder")}
          {...register("password")}
          className={errors.password ? "border-destructive" : ""}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("auth.login.submitting") : t("auth.login.submit")}
      </Button>

      <Separator />

      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          {t("auth.login.noAccount")}{" "}
        </span>
        <Link
          to="/auth/register"
          className="text-sm text-primary hover:underline font-medium"
        >
          {t("auth.login.signUp")}
        </Link>
      </div>
    </form>
  );
};
