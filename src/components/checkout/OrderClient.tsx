"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { InstallGuideModal } from "@/components/orders/InstallGuideModal";

// ── Types ─────────────────────────────────────────────────────
interface EsimAssignment {
  id: number;
  iccid: string | null;
  status: string;
  status_label: string;
  qr_code_data: string | null;
  activation_code: string | null;
  smdp_address: string | null;
  data_used_mb: number;
  data_total_mb: number;
  data_remaining_mb: number;
  usage_percent: number;
  is_low_data: boolean;
  days_remaining: number | null;
  is_expired: boolean;
  activated_at: string | null;
  expires_at: string | null;
}

interface OrderItem {
  id: number;
  quantity: number;
  unit_price: number;
  currency_code: string;
  line_total: number;
  product?: {
    title: string;
    country?: { name: string; flag_emoji: string };
    details?: {
      data_gb: number | null;
      unlimited: boolean;
      duration_days: number;
      speed: string[];
      has_voice: boolean;
      has_sms: boolean;
    };
  };
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  status_label: string;
  total_formatted: string;
  paid_at: string | null;
  created_at: string;
  items: OrderItem[];
  esims: EsimAssignment[];
}

interface ApiResponse {
  data: Order;
}
interface Props {
  orderId: string;
  paymentStatus?: string;
}

// ── Helpers ───────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function statusBadgeClass(status: string) {
  if (status === "active") return "order-status-badge--paid";
  if (status === "expired" || status === "failed")
    return "order-status-badge--cancelled";
  return "order-status-badge--pending";
}

// ── eSIM Info Card ────────────────────────────────────────────
function EsimInfoCard({
  esim,
  item,
}: {
  esim: EsimAssignment;
  item?: OrderItem;
}) {
  const [copied, setCopied] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);
  const product = item?.product;
  const d = product?.details;
  const dataLabel = d?.unlimited
    ? "Unlimited"
    : d?.data_gb
      ? `${d.data_gb} GB`
      : "—";
  const usedGb = (esim.data_used_mb / 1024).toFixed(2);
  const totalGb = d?.data_gb ?? (esim.data_total_mb / 1024).toFixed(1);

  function copy(text: string, key: string) {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="od-esim-card">
      {/* Header */}
      <div className="od-esim-header">
        <div className="od-esim-country">
          <span className="od-flag">
            {product?.country?.flag_emoji ?? "🌍"}
          </span>
          <div>
            <div className="od-country-name">
              {product?.country?.name ?? "eSIM"}
            </div>
            <div className="od-plan-label">
              {dataLabel}
              {d?.duration_days ? ` · ${d.duration_days} days` : ""}
              {d?.speed && d.speed.length > 0
                ? ` · ${d.speed[d.speed.length - 1]}`
                : ""}
            </div>
          </div>
        </div>
        <span className={`order-status-badge ${statusBadgeClass(esim.status)}`}>
          {esim.status_label}
        </span>
      </div>

      <div className="od-divider" />

      {/* QR Code */}
      {esim.qr_code_data ? (
        <div className="od-qr-section">
          <div className="od-qr-box">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(esim.qr_code_data)}`}
              alt="eSIM QR Code"
              width={180}
              height={180}
            />
          </div>
          <div className="od-qr-instructions">
            <div className="od-qr-title">Scan to install eSIM</div>
            <p className="od-qr-sub">
              Go to Settings → Cellular → Add eSIM and scan this QR code.
            </p>
            <div className="od-qr-title"> Or enter manually</div>
            {esim.smdp_address && (
              <div className="od-copy-row">
                <span className="od-copy-label">SM-DP+</span>
                <span className="od-copy-value">{esim.smdp_address}</span>
                <button
                  className="od-copy-btn"
                  onClick={() => copy(esim.smdp_address!, "smdp")}
                >
                  {copied === "smdp" ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
            {esim.activation_code && (
              <div className="od-copy-row">
                <span className="od-copy-label">Activation code</span>
                <span className="od-copy-value od-mono">
                  {esim.activation_code}
                </span>
                <button
                  className="od-copy-btn"
                  onClick={() => copy(esim.activation_code!, "code")}
                >
                  {copied === "code" ? "Copied!" : "Copy"}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="od-pending-box">
          <div
            className="auth-guard-spinner"
            style={{ width: 24, height: 24, borderWidth: 2 }}
          />
          <span>
            Your eSIM is being provisioned. QR code will appear here shortly.
          </span>
        </div>
      )}

      {/* Install guide button */}
      {esim.qr_code_data && (
        <div style={{ padding: "0 24px 20px" }}>
          <button
            className="od-install-guide-btn"
            onClick={() => setGuideOpen(true)}
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 8v5m0 3v.5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            How to install your eSIM
          </button>
        </div>
      )}

      <InstallGuideModal
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        qrCode={esim.qr_code_data}
        smdpAddress={esim.smdp_address}
        activationCode={esim.activation_code}
      />

      <div className="od-divider" />

      {/* Installation status bar */}
      <div className={`od-install-bar od-install-bar--${esim.status}`}>
        <span className="od-install-icon">
          {esim.status === "active" && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2C8 2 4 5 4 9c0 5 8 13 8 13s8-8 8-13c0-4-4-7-8-7z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
              />
              <circle
                cx="12"
                cy="9"
                r="2.5"
                stroke="currentColor"
                strokeWidth="1.8"
              />
            </svg>
          )}
          {esim.status === "pending" && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="5"
                y="2"
                width="14"
                height="20"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M9 18h6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="10"
                r="3"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M12 7V5"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
          {(esim.status === "expired" || esim.status === "cancelled") && (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M9 9l6 6M15 9l-6 6"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          )}
        </span>
        <div>
          <div className="od-install-title">
            {esim.status === "active" && "Installed on device"}
            {esim.status === "pending" && "Not installed yet"}
            {esim.status === "expired" && "eSIM expired"}
            {esim.status === "cancelled" && "eSIM cancelled"}
          </div>
          <div className="od-install-sub">
            {esim.status === "active" &&
              "Your eSIM is active and installed on your device."}
            {esim.status === "pending" &&
              "Scan the QR code above to install your eSIM."}
            {esim.status === "expired" &&
              "This eSIM has expired and is no longer usable."}
            {esim.status === "cancelled" && "This eSIM has been cancelled."}
          </div>
        </div>
      </div>

      <div className="od-divider" />

      {/* Remaining package */}
      <div className="od-remaining">
        <div className="od-remaining-label">Remaining package</div>
        <div className="od-remaining-stats">
          <div className="od-remaining-stat">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M12 2v20M2 12h20"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle
                cx="12"
                cy="12"
                r="9"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M3.5 7.5C6 9 9 9.5 12 9.5s6-.5 8.5-2M3.5 16.5C6 15 9 14.5 12 14.5s6 .5 8.5 2"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <div className="od-remaining-value">
                {esim.data_remaining_mb >= 1024
                  ? `${(esim.data_remaining_mb / 1024).toFixed(1)} GB`
                  : `${Math.round(esim.data_remaining_mb)} MB`}
              </div>
              <div className="od-remaining-sub">Data</div>
            </div>
          </div>
          <div className="od-remaining-sep" />
          <div className="od-remaining-stat">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <rect
                x="3"
                y="4"
                width="18"
                height="18"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M3 9h18M8 2v4M16 2v4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <div>
              <div className="od-remaining-value">
                {esim.days_remaining !== null
                  ? `${esim.days_remaining} days`
                  : "—"}
              </div>
              <div className="od-remaining-sub">Validity</div>
            </div>
          </div>
          {esim.iccid && (
            <>
              <div className="od-remaining-sep" />
              <div className="od-remaining-stat od-remaining-iccid">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <rect
                    x="2"
                    y="5"
                    width="20"
                    height="14"
                    rx="2"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M7 9v6M10 9l2 3 2-3v6M17 9v6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div>
                  <div
                    className="od-remaining-value od-mono"
                    style={{ fontSize: "0.78rem" }}
                  >
                    {esim.iccid}
                  </div>
                  <div className="od-remaining-sub">ICCID</div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="od-divider" />

      {/* Details grid */}
      <div className="od-details-grid">
        {esim.iccid && (
          <div className="od-detail-row">
            <span className="od-detail-label">ICCID</span>
            <div className="od-detail-value-row">
              <span className="od-mono">{esim.iccid}</span>
              <button
                className="od-copy-btn"
                onClick={() => copy(esim.iccid!, "iccid")}
              >
                {copied === "iccid" ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>
        )}
        {esim.activated_at && (
          <div className="od-detail-row">
            <span className="od-detail-label">Activated</span>
            <span className="od-detail-value">
              {formatDate(esim.activated_at)}
            </span>
          </div>
        )}
        {esim.expires_at && (
          <div className="od-detail-row">
            <span className="od-detail-label">Expires</span>
            <span className="od-detail-value">
              {formatDate(esim.expires_at)}
            </span>
          </div>
        )}
        {esim.days_remaining !== null && !esim.is_expired && (
          <div className="od-detail-row">
            <span className="od-detail-label">Days remaining</span>
            <span className="od-detail-value">{esim.days_remaining} days</span>
          </div>
        )}
        {d?.has_voice && (
          <div className="od-detail-row">
            <span className="od-detail-label">Voice calls</span>
            <span className="od-detail-value od-yes">Included</span>
          </div>
        )}
        {d?.has_sms && (
          <div className="od-detail-row">
            <span className="od-detail-label">SMS</span>
            <span className="od-detail-value od-yes">Included</span>
          </div>
        )}
      </div>

      {/* Usage */}
      {esim.data_total_mb > 0 && (
        <>
          <div className="od-divider" />
          <div className="od-usage">
            <div className="od-usage-row">
              <span className="od-detail-label">Data used</span>
              <span className="od-detail-value">
                {usedGb} GB / {totalGb} GB
              </span>
            </div>
            <div className="od-usage-bar-wrap">
              <div
                className={`od-usage-bar-fill${esim.is_low_data ? " low" : ""}`}
                style={{ width: `${Math.min(esim.usage_percent, 100)}%` }}
              />
            </div>
            {esim.is_low_data && (
              <p className="od-low-data-warning">⚠ Low data remaining</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ── Main view ─────────────────────────────────────────────────
function OrderView({ orderId, paymentStatus }: Props) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get<ApiResponse>(`/orders/${orderId}`)
      .then((r) => setOrder(r.data))
      .catch(() => setError("Order not found."))
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="order-loading">
        <div className="auth-guard-spinner" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-error">
        <p>{error ?? "Something went wrong."}</p>
        <Link href="/orders" className="btn-black" style={{ marginTop: 16 }}>
          Back to My eSIMs
        </Link>
      </div>
    );
  }

  const isSuccess =
    paymentStatus === "success" ||
    order.status === "paid" ||
    order.status === "completed";
  const isCancelled = paymentStatus === "cancelled";

  return (
    <div className="wrap inner-page">
      {/* Breadcrumb */}
      <nav className="breadcrumb" aria-label="Breadcrumb">
        <Link href="/orders" className="breadcrumb-link">
          My eSIMs
        </Link>
        <span className="breadcrumb-sep" aria-hidden="true">
          /
        </span>
        <span>Order #{order.order_number}</span>
      </nav>

      <div className="od-page">
        {/* Status banners */}
        {isSuccess && (
          <div className="order-banner order-banner--success">
            <span className="order-banner-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="11"
                  fill="currentColor"
                  opacity="0.15"
                />
                <path
                  d="M6 11l3.5 3.5 6.5-7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <div>
              <div className="order-banner-title">Payment successful!</div>
              <div className="order-banner-sub">
                Your eSIM QR code will be delivered to your email shortly.
              </div>
            </div>
          </div>
        )}
        {isCancelled && (
          <div className="order-banner order-banner--warning">
            <span className="order-banner-icon">
              <svg
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="11"
                  cy="11"
                  r="11"
                  fill="currentColor"
                  opacity="0.15"
                />
                <path
                  d="M11 7v5m0 3v.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div>
              <div className="order-banner-title">Payment cancelled</div>
              <div className="order-banner-sub">
                Your order is saved. You can retry payment below.
              </div>
            </div>
          </div>
        )}

        {/* eSIM cards */}
        {order.esims?.length > 0
          ? order.esims.map((esim, i) => (
              <EsimInfoCard key={esim.id} esim={esim} item={order.items[i]} />
            ))
          : order.items.map((item) => (
              <div key={item.id} className="od-esim-card od-pending-card">
                <div className="od-esim-header">
                  <div className="od-esim-country">
                    <span className="od-flag">
                      {item.product?.country?.flag_emoji ?? "🌍"}
                    </span>
                    <div>
                      <div className="od-country-name">
                        {item.product?.country?.name ?? "eSIM"}
                      </div>
                      <div className="od-plan-label">{item.product?.title}</div>
                    </div>
                  </div>
                  <span
                    className={`order-status-badge order-status-badge--${order.status}`}
                  >
                    {order.status_label}
                  </span>
                </div>
                <div className="od-divider" />
                <div className="od-pending-box">
                  <div
                    className="auth-guard-spinner"
                    style={{ width: 24, height: 24, borderWidth: 2 }}
                  />
                  <span>
                    {order.status === "pending"
                      ? "Awaiting payment."
                      : "Your eSIM is being provisioned."}
                  </span>
                </div>
              </div>
            ))}

        {/* Order summary */}
        <div className="od-summary-card">
          <div className="od-summary-title">Order summary</div>
          <div className="od-summary-row">
            <span className="od-detail-label">Order number</span>
            <span className="od-detail-value">#{order.order_number}</span>
          </div>
          <div className="od-summary-row">
            <span className="od-detail-label">Date</span>
            <span className="od-detail-value">
              {formatDate(order.created_at)}
            </span>
          </div>
          {order.paid_at && (
            <div className="od-summary-row">
              <span className="od-detail-label">Paid on</span>
              <span className="od-detail-value">
                {formatDate(order.paid_at)}
              </span>
            </div>
          )}
          <div className="od-summary-row od-summary-total">
            <span>Total</span>
            <span>{order.total_formatted}</span>
          </div>
        </div>

        {/* Actions */}
        {isCancelled && (
          <div className="order-actions">
            <RetryButton orderId={order.id} />
          </div>
        )}
      </div>
    </div>
  );
}

function RetryButton({ orderId }: { orderId: number }) {
  const [loading, setLoading] = useState(false);
  async function retry() {
    setLoading(true);
    try {
      const res = await api.post<{ data: { checkout_url: string } }>(
        `/orders/${orderId}/checkout`,
        {},
      );
      window.location.href = res.data.checkout_url;
    } catch {
      setLoading(false);
    }
  }
  return (
    <button
      type="button"
      className="btn-orange"
      onClick={retry}
      disabled={loading}
    >
      {loading ? "Redirecting…" : "Retry payment"}
    </button>
  );
}

export function OrderClient({ orderId, paymentStatus }: Props) {
  return (
    <AuthGuard>
      <OrderView orderId={orderId} paymentStatus={paymentStatus} />
    </AuthGuard>
  );
}
