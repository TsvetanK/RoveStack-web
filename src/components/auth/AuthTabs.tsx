"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AuthTabs() {
  const pathname = usePathname();
  const isLogin = pathname.includes("/auth/login");

  return (
    <div className="auth-tabs">
      <Link href="/auth/login" className={`auth-tab${isLogin ? " active" : ""}`}>
        Log in
      </Link>
      <Link href="/auth/register" className={`auth-tab${!isLogin ? " active" : ""}`}>
        Sign up
      </Link>
    </div>
  );
}
