"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { http, setToken, clearToken, getToken } from "@/lib/api";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  role: "customer" | "admin" | "support";
  preferred_language: string;
  preferred_currency: string;
  email_verified_at: string | null;
}

interface AuthCtx {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, locale?: string, currency?: string) => Promise<void>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);

type ApiResponse = { data: { user: AuthUser; token: string } };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) { setLoading(false); return; }
    http.get<{ data: AuthUser }>("/auth/me")
      .then((r) => setUser(r.data.data))
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const r = await http.post<ApiResponse>("/auth/login", { email, password });
    setToken(r.data.data.token);
    setUser(r.data.data.user);
  }, []);

  const register = useCallback(async (
    name: string,
    email: string,
    password: string,
    locale = "en",
    currency = "EUR",
  ) => {
    const r = await http.post<ApiResponse>("/auth/register", {
      name,
      email,
      password,
      password_confirmation: password,
      preferred_language: locale,
      preferred_currency: currency,
    });
    setToken(r.data.data.token);
    setUser(r.data.data.user);
  }, []);

  const logout = useCallback(async () => {
    await http.post("/auth/logout", {}).catch(() => {});
    clearToken();
    setUser(null);
    router.push("/");
  }, [router]);

  return (
    <Ctx.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </Ctx.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
