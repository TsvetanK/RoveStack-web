"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useAuth } from "@/lib/auth";
import { RoveApiError } from "@/lib/api";
import { SocialButtons } from "./SocialButtons";

const schema = z.object({
  email:    z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

interface Props { onSuccess?: () => void; }

export function LoginForm({ onSuccess }: Props) {
  const t = useTranslations("auth");
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      await login(data.email, data.password);
      onSuccess?.();
    } catch (err) {
      if (err instanceof RoveApiError) {
        if (err.isValidation) {
          const emailErr = err.fieldError("email");
          const passErr  = err.fieldError("password");
          if (emailErr) setError("email",    { message: emailErr });
          if (passErr)  setError("password", { message: passErr });
        } else {
          setServerError(err.body.message);
        }
      }
    }
  }

  return (
    <div className="auth-form-wrap">
      <SocialButtons />
      <div className="auth-divider"><span>{t("orWith")}</span></div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="auth-field">
          <input
            {...register("email")}
            type="email"
            placeholder={t("email")}
            autoComplete="email"
            className={`auth-input${errors.email ? " error" : ""}`}
          />
          {errors.email && <p className="auth-field-error">{errors.email.message}</p>}
        </div>

        <div className="auth-field">
          <input
            {...register("password")}
            type="password"
            placeholder={t("password")}
            autoComplete="current-password"
            className={`auth-input${errors.password ? " error" : ""}`}
          />
          {errors.password && <p className="auth-field-error">{errors.password.message}</p>}
        </div>

        <div className="auth-row">
          <label className="auth-remember">
            <input type="checkbox" className="auth-checkbox" />
            <span>{t("rememberMe")}</span>
          </label>
          <Link href="/auth/forgot-password" className="auth-link">
            {t("forgotPassword")}
          </Link>
        </div>

        {serverError && <p className="auth-server-error">{serverError}</p>}

        <button type="submit" className="btn-orange btn-lg w-full" disabled={isSubmitting}>
          {isSubmitting ? t("signingIn") : t("signIn")}
        </button>
      </form>
    </div>
  );
}
