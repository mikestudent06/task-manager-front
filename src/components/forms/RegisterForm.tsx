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
import type { RegisterCredentials } from "@/types/auth.types";

interface RegisterFormProps {
  onSubmit: (data: RegisterCredentials) => void;
  isLoading?: boolean;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const { t } = useTranslation();
  const registerSchema = z.object({
    name: z.string().min(2, t("auth.errors.nameMin")),
    email: z.string().email(t("auth.errors.invalidEmail")),
    password: z.string().min(8, t("auth.errors.passwordMin")),
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">{t("auth.register.fullName")}</Label>
        <Input
          id="name"
          type="text"
          placeholder={t("auth.register.fullNamePlaceholder")}
          {...register("name")}
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">{t("auth.register.email")}</Label>
        <Input
          id="email"
          type="email"
          placeholder={t("auth.register.emailPlaceholder")}
          {...register("email")}
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">{t("auth.register.password")}</Label>
        <Input
          id="password"
          type="password"
          placeholder={t("auth.register.passwordPlaceholder")}
          {...register("password")}
          className={errors.password ? "border-destructive" : ""}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? t("auth.register.submitting") : t("auth.register.submit")}
      </Button>

      <Separator />

      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          {t("auth.register.hasAccount")}{" "}
        </span>
        <Link
          to="/auth/login"
          className="text-sm text-primary hover:underline font-medium"
        >
          {t("auth.register.signIn")}
        </Link>
      </div>
    </form>
  );
};
