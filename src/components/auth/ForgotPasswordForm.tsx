"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { api, RoveApiError } from "@/lib/api";

const schema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const t = useTranslations("auth");
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting } } =
    useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      await api.post("/auth/forgot-password", { email: data.email });
      setSent(true);
    } catch (err) {
      if (err instanceof RoveApiError) setServerError(err.body.message);
    }
  }

  return (
    <div className="auth-form-wrap">
      <div className="auth-back-header">
        <Link href="/auth/login" className="auth-back-btn">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t("backToLogin")}
        </Link>
        <h2 className="auth-title">{t("resetPassword")}</h2>
        <p className="auth-subtitle">{t("resetPasswordSubtitle")}</p>
      </div>

      {sent ? (
        <div className="auth-success">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M6 10l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          {t("checkInbox")}
        </div>
      ) : (
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

          {serverError && <p className="auth-server-error">{serverError}</p>}

          <button type="submit" className="btn-orange btn-lg w-full" disabled={isSubmitting}>
            {isSubmitting ? t("sending") : t("sendResetLink")}
          </button>
        </form>
      )}
    </div>
  );
}
