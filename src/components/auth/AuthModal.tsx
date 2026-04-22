"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

type Tab = "login" | "register";

export function AuthModal() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("auth");

  const initial: Tab = pathname.includes("register") ? "register" : "login";
  const [tab, setTab] = useState<Tab>(initial);

  const close = useCallback(() => router.back(), [router]);

  const switchTab = useCallback((next: Tab) => {
    setTab(next);
    window.history.replaceState(null, "", `/auth/${next}`);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [close]);

  return (
    <div className="auth-backdrop" onClick={close} aria-modal="true" role="dialog">
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>

        <button className="auth-modal-close" onClick={close} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <div className="countries-tabs auth-tabs-row" role="tablist">
          <button
            role="tab"
            aria-selected={tab === "login"}
            onClick={() => switchTab("login")}
            className={`tab-btn${tab === "login" ? " active" : ""}`}
          >
            {t("signIn")}
          </button>
          <button
            role="tab"
            aria-selected={tab === "register"}
            onClick={() => switchTab("register")}
            className={`tab-btn${tab === "register" ? " active" : ""}`}
          >
            {t("signUp")}
          </button>
        </div>

        {tab === "login"    && <LoginForm onSuccess={close} />}
        {tab === "register" && <RegisterForm onSuccess={close} />}
      </div>
    </div>
  );
}
