import axios, { type AxiosRequestConfig, type AxiosError } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// ── Token storage (client-side only) ────────────────────────────────────────
const TOKEN_KEY = "rs_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}
export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

// ── Axios instance ───────────────────────────────────────────────────────────
export const http = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 15_000,
});

// ── Request interceptor — attach token + locale + currency ──────────────────
http.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  if (typeof window !== "undefined") {
    const locale = document.documentElement.lang ?? "en";
    const currency = localStorage.getItem("rs_currency") ?? "EUR";
    config.headers["X-Locale"] = locale;
    config.headers["X-Currency"] = currency;
  }

  return config;
});

// ── Response interceptor — normalise errors ──────────────────────────────────
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const status = error.response?.status;
    const message =
      error.response?.data?.message ??
      error.message ??
      "An unexpected error occurred";
    const errors = error.response?.data?.errors;

    // 401 — clear stale token so the user is sent to login
    if (status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
    }

    return Promise.reject(new RoveApiError(status ?? 0, { message, errors }));
  }
);

// ── Typed error ──────────────────────────────────────────────────────────────
export interface ApiErrorBody {
  message: string;
  errors?: Record<string, string[]>;
}

export class RoveApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly body: ApiErrorBody
  ) {
    super(body.message);
    this.name = "RoveApiError";
  }

  /** First validation error for a given field, or undefined. */
  fieldError(field: string): string | undefined {
    return this.body.errors?.[field]?.[0];
  }

  get isValidation() { return this.status === 422; }
  get isUnauthorized() { return this.status === 401; }
  get isForbidden() { return this.status === 403; }
  get isNotFound() { return this.status === 404; }
  get isServer() { return this.status >= 500; }
}

export { RoveApiError as ApiError };

// ── Typed convenience wrappers ───────────────────────────────────────────────
type ExtraConfig = Pick<AxiosRequestConfig, "signal">;

export const api = {
  get<T>(path: string, config?: ExtraConfig) {
    return http.get<T>(path, config).then((r) => r.data);
  },
  post<T>(path: string, body: unknown, config?: ExtraConfig) {
    return http.post<T>(path, body, config).then((r) => r.data);
  },
  put<T>(path: string, body: unknown, config?: ExtraConfig) {
    return http.put<T>(path, body, config).then((r) => r.data);
  },
  patch<T>(path: string, body: unknown, config?: ExtraConfig) {
    return http.patch<T>(path, body, config).then((r) => r.data);
  },
  delete<T>(path: string, config?: ExtraConfig) {
    return http.delete<T>(path, config).then((r) => r.data);
  },
};

// ── Cache helpers (used by Server Components) ────────────────────────────────
export const CacheTags = {
  countries: ["countries"],
  country: (slug: string) => [`country:${slug}`],
  products: ["products"],
  product: (slug: string) => [`product:${slug}`],
  sitemap: ["sitemap"],
} as const;

export const REVALIDATE_COUNTRIES = 21600;
export const REVALIDATE_PRODUCTS  = 21600;
export const REVALIDATE_SETTINGS  = 3600;
