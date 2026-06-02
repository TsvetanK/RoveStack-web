"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { AuthGuard } from "@/components/auth/AuthGuard";

interface EsimProduct {
  title: string;
  country?: { name: string; flag_emoji: string };
  details?: { data_gb: number | null; unlimited: boolean; duration_days: number };
}

interface Esim {
  id: number;
  iccid: string | null;
  status: string;
  status_label: string;
  data_used_mb: number;
  data_total_mb: number;
  data_remaining_mb: number;
  usage_percent: number;
  days_remaining: number | null;
  is_expired: boolean;
  is_low_data: boolean;
  expires_at: string | null;
  activated_at: string | null;
  created_at: string;
  order_item?: { order_id?: number; product?: EsimProduct };
}

interface ApiResponse { data: Esim[]; }

type Filter = "all" | "active" | "expired";

const DataIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 2v20M2 12h20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3.5 7.5C6 9 9 9.5 12 9.5s6-.5 8.5-2M3.5 16.5C6 15 9 14.5 12 14.5s6 .5 8.5 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const CalendarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.8" />
    <path d="M3 9h18M8 2v4M16 2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

function statusBadgeClass(status: string) {
  if (status === "active") return "esim-badge--active";
  if (status === "expired") return "esim-badge--expired";
  if (status === "assigned" || status === "provisioned") return "esim-badge--pending";
  return "esim-badge--default";
}

function EsimCard({ esim }: { esim: Esim }) {
  const product = esim.order_item?.product;
  const d = product?.details;
  const country = product?.country;

  const remainingMb = esim.data_remaining_mb;
  const remainingGb = remainingMb >= 1024
    ? `${(remainingMb / 1024).toFixed(1)} GB`
    : `${Math.round(remainingMb)} MB`;

  const dataDisplay = d?.unlimited ? "Unlimited" : remainingGb;
  const daysDisplay = esim.days_remaining !== null
    ? `${esim.days_remaining} days`
    : "—";

  return (
    <div className="esim2-card">
      {/* Header */}
      <div className="esim2-header">
        <span className="esim2-flag">{country?.flag_emoji ?? "🌍"}</span>
        <div className="esim2-header-text">
          <div className="esim2-country">{country?.name ?? "eSIM"}</div>
          <span className={`esim-badge ${statusBadgeClass(esim.status)}`}>
            {esim.status_label}
          </span>
        </div>
      </div>

      <div className="esim2-divider" />

      {/* Remaining package */}
      <div className="esim2-remaining-label">Remaining package</div>
      <div className="esim2-stats">
        <div className="esim2-stat">
          <span className={`esim2-stat-icon${esim.is_low_data ? " low" : ""}`}>
            <DataIcon />
          </span>
          <span className="esim2-stat-value">{dataDisplay}</span>
        </div>
        <div className="esim2-stat-sep" aria-hidden="true" />
        <div className="esim2-stat">
          <span className={`esim2-stat-icon${esim.is_expired ? " low" : ""}`}>
            <CalendarIcon />
          </span>
          <span className="esim2-stat-value">{daysDisplay}</span>
        </div>
      </div>

      {/* Usage bar (only when active and has data) */}
      {esim.data_total_mb > 0 && (
        <div className="esim2-bar-wrap">
          <div
            className={`esim2-bar-fill${esim.is_low_data ? " low" : ""}`}
            style={{ width: `${Math.min(100 - esim.usage_percent, 100)}%` }}
          />
        </div>
      )}

      {/* Footer */}
      <Link href={`/orders/${esim.order_item?.order_id ?? esim.id}`} className="esim2-view-btn">
        View details
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path d="M3 11L11 3m0 0H5m6 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </Link>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="esim2-card" aria-hidden="true">
      <div className="esim2-header">
        <div className="skeleton-circle" style={{ width: 44, height: 44, borderRadius: 12 }} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6 }}>
          <div className="skeleton-line" style={{ width: "55%" }} />
          <div className="skeleton-line" style={{ width: "30%" }} />
        </div>
      </div>
      <div className="esim2-divider" />
      <div className="skeleton-line" style={{ width: "40%", marginBottom: 12 }} />
      <div style={{ display: "flex", gap: 16 }}>
        <div className="skeleton-line" style={{ width: "35%" }} />
        <div className="skeleton-line" style={{ width: "35%" }} />
      </div>
      <div className="skeleton-line" style={{ width: "100%", marginTop: 12, height: 6, borderRadius: 100 }} />
      <div className="skeleton-line" style={{ width: "100%", marginTop: 16, height: 40, borderRadius: 12 }} />
    </div>
  );
}

function EsimList() {
  const [esims, setEsims] = useState<Esim[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    api.get<ApiResponse>("/esims")
      .then((r) => setEsims(r.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = esims.filter((e) => {
    if (filter === "active") return e.status === "active" || e.status === "assigned" || e.status === "provisioned";
    if (filter === "expired") return e.is_expired || e.status === "expired";
    return true;
  });

  const counts = {
    all: esims.length,
    active: esims.filter((e) => e.status === "active" || e.status === "assigned" || e.status === "provisioned").length,
    expired: esims.filter((e) => e.is_expired || e.status === "expired").length,
  };

  return (
    <div>
      {/* Tab bar */}
      <div className="countries-tabs" style={{ marginBottom: 28 }} role="tablist">
        {(["all", "active", "expired"] as Filter[]).map((f) => (
          <button
            key={f}
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`tab-btn${filter === f ? " active" : ""}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="esim2-grid">
          {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="esim-empty">
          <div className="esim-empty-icon">{filter === "expired" ? "⏰" : "📱"}</div>
          <div className="esim-empty-title">
            {filter === "all" ? "No eSIMs yet" : `No ${filter} eSIMs`}
          </div>
          <p className="esim-empty-sub">
            {filter === "all"
              ? "Purchase an eSIM to get started with instant connectivity."
              : `You don't have any ${filter} eSIMs at the moment.`}
          </p>
          {filter === "all" && (
            <Link href="/esim" className="btn-orange" style={{ marginTop: 20 }}>
              Browse plans
            </Link>
          )}
        </div>
      ) : (
        <div className="esim2-grid">
          {filtered.map((e) => <EsimCard key={e.id} esim={e} />)}
        </div>
      )}
    </div>
  );
}

export function MyEsimsClient() {
  return (
    <AuthGuard>
      <EsimList />
    </AuthGuard>
  );
}
