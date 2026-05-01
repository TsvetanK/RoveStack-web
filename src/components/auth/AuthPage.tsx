"use client";

import { useCallback } from "react";
import Image from "next/image";
import { Link, useRouter, usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";
import { ForgotPasswordForm } from "./ForgotPasswordForm";

type View = "login" | "register" | "forgot-password";

function getView(pathname: string): View {
  if (pathname.includes("register")) return "register";
  if (pathname.includes("forgot-password")) return "forgot-password";
  return "login";
}

export function AuthPage() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");

  const view = getView(pathname);
  const handleSuccess = useCallback(() => {
    router.push("/");
  }, [router]);
  const switchTab = useCallback(
    (next: "login" | "register") => {
      router.replace(`/auth/${next}` as "/auth/login" | "/auth/register");
    },
    [router],
  );

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-brand">
          <Image src="/logo.png" alt="RoveStack" width={52} height={52} />
          <span>
            RoveStack
          </span>
        </Link>
        {view !== "forgot-password" && (
          <div className="countries-tabs auth-tabs-row" role="tablist">
            <button
              role="tab"
              aria-selected={view === "login"}
              onClick={() => switchTab("login")}
              className={`tab-btn${view === "login" ? " active" : ""}`}
            >
              {t("signIn")}
            </button>
            <button
              role="tab"
              aria-selected={view === "register"}
              onClick={() => switchTab("register")}
              className={`tab-btn${view === "register" ? " active" : ""}`}
            >
              {t("signUp")}
            </button>
          </div>
        )}

        {view === "login" && <LoginForm onSuccess={handleSuccess} />}
        {view === "register" && <RegisterForm onSuccess={handleSuccess} />}
        {view === "forgot-password" && <ForgotPasswordForm />}
      </div>
    </div>
  );
}
