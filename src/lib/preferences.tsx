"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { http } from "@/lib/api";

export interface CurrencyOption {
  code: string;
  name: string;
  symbol: string;
  is_default: boolean;
}

interface PreferencesCtx {
  currency: string;
  setCurrency: (code: string) => void;
  currencies: CurrencyOption[];
  currenciesLoading: boolean;
}

const Ctx = createContext<PreferencesCtx | null>(null);

const CURRENCY_KEY = "rs_currency";

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState("EUR");
  const [currencies, setCurrencies] = useState<CurrencyOption[]>([]);
  const [currenciesLoading, setCurrenciesLoading] = useState(true);

  // Load saved currency from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(CURRENCY_KEY);
    if (saved) setCurrencyState(saved);
  }, []);

  // Fetch available currencies from backend
  useEffect(() => {
    http.get<{ success: boolean; data: CurrencyOption[] }>("/currencies")
      .then((res) => {
        const list: CurrencyOption[] = res.data.data;
        setCurrencies(list);
        const saved = localStorage.getItem(CURRENCY_KEY);
        if (!saved) {
          const def = list.find((c) => c.is_default);
          if (def) setCurrencyState(def.code);
        }
      })
      .catch(() => {
        // Keep fallback EUR if API is unavailable
      })
      .finally(() => setCurrenciesLoading(false));
  }, []);

  const setCurrency = useCallback((code: string) => {
    setCurrencyState(code);
    localStorage.setItem(CURRENCY_KEY, code);
  }, []);

  return (
    <Ctx.Provider value={{ currency, setCurrency, currencies, currenciesLoading }}>
      {children}
    </Ctx.Provider>
  );
}

export function usePreferences() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePreferences must be used inside PreferencesProvider");
  return ctx;
}
