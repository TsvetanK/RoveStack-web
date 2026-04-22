// ============================================================
// API Resource Types — RoveStack eSIM Platform
// ============================================================

export type UserRole = "customer" | "support" | "admin";
export type OrderStatus = "pending" | "paid" | "provisioning" | "completed" | "failed" | "refunded";
export type EsimStatus = "pending" | "active" | "expired" | "cancelled";
export type SupportPriority = "low" | "normal" | "high";

// ── Pagination ───────────────────────────────────────────────
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
  };
}

// ── Error ────────────────────────────────────────────────────
export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}

// ── Currency ─────────────────────────────────────────────────
export interface Currency {
  code: string;
  name: string;
  symbol: string;
  decimal_places: number;
  is_default: boolean;
}

// ── Language ─────────────────────────────────────────────────
export interface Language {
  code: string;
  name: string;
  native_name: string;
  flag_emoji: string;
}

// ── Country ──────────────────────────────────────────────────
export interface CountryResource {
  id: number;
  name: string;
  iso_code: string;
  region: string;
  slug: string;
  flag_emoji: string;
  products_count: number;
  seo?: {
    title: string;
    description: string;
  };
  products?: ProductResource[];
}

// ── Product ──────────────────────────────────────────────────
export interface ProductPrice {
  amount: number;
  currency: string;
  formatted: string;
}

export interface ProductDetails {
  data_mb: number;
  data_gb: number;
  unlimited: boolean;
  duration_days: number;
  has_voice: boolean;
  has_sms: boolean;
  speed: string[];
  roaming: string[];
}

export interface ProductResource {
  id: number;
  type: string;
  slug: string;
  image_url: string | null;
  price: ProductPrice;
  country: Pick<CountryResource, "id" | "name" | "iso_code" | "region" | "slug">;
  seo?: {
    title: string;
    description: string;
  };
  title: string;
  description: string;
  details: ProductDetails;
}

// ── User ─────────────────────────────────────────────────────
export interface UserResource {
  id: number;
  name: string;
  email: string;
  avatar_url: string | null;
  role: UserRole;
  preferred_language: string;
  preferred_currency: string;
  email_verified_at: string | null;
  created_at: string;
  orders_count: number;
  esims_count: number;
}

// ── Order ────────────────────────────────────────────────────
export interface OrderItemResource {
  id: number;
  product: ProductResource;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderResource {
  id: number;
  order_number: string;
  status: OrderStatus;
  status_label: string;
  status_color: string;
  currency_code: string;
  subtotal: number;
  discount: number;
  total: number;
  total_formatted: string;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  items?: OrderItemResource[];
  esims?: EsimAssignmentResource[];
  user?: UserResource;
}

// ── eSIM Assignment ──────────────────────────────────────────
export interface EsimAssignmentResource {
  id: number;
  iccid: string;
  status: EsimStatus;
  status_label: string;
  qr_code_data: string;
  activation_code: string;
  smdp_address: string;
  data_used_mb: number;
  data_total_mb: number;
  data_remaining_mb: number;
  usage_percent: number;
  is_low_data: boolean;
  days_remaining: number;
  is_expired: boolean;
  activated_at: string | null;
  expires_at: string | null;
  created_at: string;
  order_item?: OrderItemResource;
}

// ── Support ──────────────────────────────────────────────────
export interface SupportMessageResource {
  id: number;
  message: string;
  is_staff: boolean;
  created_at: string;
}

export interface SupportConversationResource {
  id: number;
  subject: string;
  priority: SupportPriority;
  status: "open" | "closed";
  created_at: string;
  updated_at: string;
  messages?: SupportMessageResource[];
}

// ── Sitemap ──────────────────────────────────────────────────
export interface SitemapEntry {
  url: string;
  last_modified: string;
  priority: number;
}

// ── Auth ─────────────────────────────────────────────────────
export interface AuthResponse {
  data: {
    user: UserResource;
    token: string;
  };
}

export interface CheckoutResponse {
  data: {
    checkout_url: string;
    session_id: string;
  };
}

// ── eSIM Usage ───────────────────────────────────────────────
export interface EsimUsage {
  iccid: string;
  data_used_mb: number;
  data_total_mb: number;
  data_remaining_mb: number;
  usage_percent: number;
  days_remaining: number;
  expires_at: string;
  status: EsimStatus;
  last_updated_at: string;
}
