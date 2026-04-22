"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { useWatch } from "react-hook-form";
import { useLocale } from "next-intl";
import { useAuth } from "@/lib/auth";
import { usePreferences } from "@/lib/preferences";
import { RoveApiError } from "@/lib/api";
import { SocialButtons } from "./SocialButtons";

const schema = z.object({
  name:     z.string().min(2, "Name must be at least 2 characters"),
  email:    z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  password_confirmation: z.string().min(1, "Please confirm your password"),
}).refine((d) => d.password === d.password_confirmation, {
  message: "Passwords do not match",
  path: ["password_confirmation"],
});

type FormData = z.infer<typeof schema>;

interface Props { onSuccess?: () => void; }

export function RegisterForm({ onSuccess }: Props) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const { currency } = usePreferences();
  const { register: registerUser } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormData>({ resolver: zodResolver(schema) });
  const { register, handleSubmit, setError, control, formState: { errors, isSubmitting } } = form;
  const passwordValue = useWatch({ control, name: "password", defaultValue: "" });

  async function onSubmit(data: FormData) {
    setServerError(null);
    try {
      await registerUser(data.name, data.email, data.password, locale, currency);
      onSuccess?.();
    } catch (err) {
      if (err instanceof RoveApiError) {
        if (err.isValidation) {
          (["name", "email", "password"] as const).forEach((f) => {
            const msg = err.fieldError(f);
            if (msg) setError(f, { message: msg });
          });
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
            {...register("name")}
            type="text"
            placeholder={t("fullName")}
            autoComplete="name"
            className={`auth-input${errors.name ? " error" : ""}`}
          />
          {errors.name && <p className="auth-field-error">{errors.name.message}</p>}
        </div>

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
            autoComplete="new-password"
            className={`auth-input${errors.password ? " error" : ""}`}
          />
          <ul className="pw-rules">
            <PasswordRule met={passwordValue.length >= 8}       label="At least 8 characters" />
            <PasswordRule met={/[A-Z]/.test(passwordValue)}     label="One uppercase letter" />
            <PasswordRule met={/[0-9]/.test(passwordValue)}     label="One number" />
          </ul>
        </div>

        <div className="auth-field">
          <input
            {...register("password_confirmation")}
            type="password"
            placeholder={t("confirmPassword")}
            autoComplete="new-password"
            className={`auth-input${errors.password_confirmation ? " error" : ""}`}
          />
          {errors.password_confirmation && (
            <p className="auth-field-error">{errors.password_confirmation.message}</p>
          )}
        </div>

        {serverError && <p className="auth-server-error">{serverError}</p>}

        <button type="submit" className="btn-orange btn-lg w-full" disabled={isSubmitting}>
          {isSubmitting ? t("creatingAccount") : t("signUp")}
        </button>
      </form>
    </div>
  );
}

function PasswordRule({ met, label }: { met: boolean; label: string }) {
  return (
    <li className={`pw-rule${met ? " met" : ""}`}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        {met
          ? <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          : <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.2"/>
        }
      </svg>
      {label}
    </li>
  );
}
