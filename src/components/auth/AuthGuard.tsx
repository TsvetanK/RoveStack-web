"use client";

import { useState, type ReactNode } from "react";
import Image from "next/image";
import { useAuth } from "@/lib/auth";
import { LoginForm } from "./LoginForm";
import { RegisterForm } from "./RegisterForm";

interface Props {
  children: ReactNode;
}

export function AuthGuard({ children }: Props) {
  const { user, loading } = useAuth();
  const [tab, setTab] = useState<"login" | "register">("login");

  if (loading) {
    return (
      <div className="auth-guard-loading">
        <div className="auth-guard-spinner" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="auth-guard-overlay">
        <div className="auth-guard-backdrop" />
        <div className="auth-guard-modal">
          <div className="auth-guard-brand">
            <Image src="/logo.png" alt="RoveStack" width={40} height={40} />
            <div>
              <div className="auth-guard-brand-title">Sign in to continue</div>
              <div className="auth-guard-brand-sub">Create an account or sign in to complete your purchase.</div>
            </div>
          </div>

          <div className="countries-tabs auth-tabs-row" role="tablist">
            <button
              role="tab"
              aria-selected={tab === "login"}
              onClick={() => setTab("login")}
              className={`tab-btn${tab === "login" ? " active" : ""}`}
            >
              Sign in
            </button>
            <button
              role="tab"
              aria-selected={tab === "register"}
              onClick={() => setTab("register")}
              className={`tab-btn${tab === "register" ? " active" : ""}`}
            >
              Create account
            </button>
          </div>

          {tab === "login" && <LoginForm />}
          {tab === "register" && <RegisterForm />}
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
