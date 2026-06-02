"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";
import { useAuth } from "@/lib/auth";
import { api, RoveApiError } from "@/lib/api";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { DeviceCompatibilityModal } from "@/components/checkout/DeviceCompatibilityModal";

export interface CheckoutPlan {
  id: number;
  slug: string;
  title: string;
  price: string;
  dataGb: number | null;
  unlimited: boolean;
  durationDays: number;
  speed: string[];
  hasVoice: boolean;
  hasSms: boolean;
}

export interface CheckoutCountry {
  name: string;
  flag: string;
  slug: string;
  region: string;
}

interface Props {
  plan: CheckoutPlan;
  country: CheckoutCountry;
  qty?: number;
}

interface OrderResponse {
  data: { id: number; order_number: string };
}

interface CheckoutResponse {
  data: { checkout_url: string };
}

function CheckoutForm({ plan, country, qty = 1 }: Props) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [compatOpen, setCompatOpen] = useState(false);

  const dataLabel = plan.unlimited ? "Unlimited" : plan.dataGb ? `${plan.dataGb} GB` : "—";
  const topSpeed = plan.speed.length > 0 ? plan.speed[plan.speed.length - 1] : null;

  async function handleBuy() {
    setError(null);
    setLoading(true);
    try {
      // 1. Create order
      const order = await api.post<OrderResponse>("/orders", {
        items: [{ product_id: plan.id, quantity: qty }],
      });

      // 2. Get Stripe checkout URL
      const checkout = await api.post<CheckoutResponse>(
        `/orders/${order.data.id}/checkout`,
        {},
      );

      // 3. Redirect to Stripe hosted checkout
      window.location.href = checkout.data.checkout_url;
    } catch (err) {
      const msg =
        err instanceof RoveApiError ? err.body.message : "Something went wrong. Please try again.";
      setError(msg);
      setLoading(false);
    }
  }

  return (
    <div className="checkout-layout">
      {/* ── Order summary ── */}
      <div className="checkout-summary">
        <h2 className="checkout-section-title">Order summary</h2>

        <div className="checkout-country-row">
          <span className="checkout-flag">{country.flag}</span>
          <div>
            <div className="checkout-country-name">{country.name}</div>
            <div className="checkout-country-region">{country.region}</div>
          </div>
        </div>

        <div className="checkout-plan-card">
          <div className="checkout-plan-data">{dataLabel} data</div>

          <div className="checkout-plan-meta">
            <div className="checkout-plan-row">
              <span className="checkout-plan-label">Validity</span>
              <span className="checkout-plan-value">{plan.durationDays} days</span>
            </div>
            {topSpeed && (
              <div className="checkout-plan-row">
                <span className="checkout-plan-label">Speed</span>
                <span className="checkout-plan-value">{plan.speed.join(" / ")}</span>
              </div>
            )}
            {plan.hasVoice && (
              <div className="checkout-plan-row">
                <span className="checkout-plan-label">Voice calls</span>
                <span className="checkout-plan-value checkout-plan-yes">Included</span>
              </div>
            )}
            {plan.hasSms && (
              <div className="checkout-plan-row">
                <span className="checkout-plan-label">SMS</span>
                <span className="checkout-plan-value checkout-plan-yes">Included</span>
              </div>
            )}
          </div>

          <div className="checkout-plan-price-row">
            <span className="checkout-plan-price-label">Total</span>
            <span className="checkout-plan-price">{plan.price}</span>
          </div>
        </div>

        <DeviceCompatibilityModal open={compatOpen} onClose={() => setCompatOpen(false)} />

        <button type="button" className="checkout-compat-btn" onClick={() => setCompatOpen(true)}>
          <span className="checkout-compat-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="5" y="2" width="14" height="20" rx="3" stroke="currentColor" strokeWidth="1.8" />
              <path d="M9 18h6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <path d="M9 7h2m2 0h2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
          </span>
          Check device compatibility
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="checkout-compat-chevron">
            <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <p className="checkout-compat-note">Make sure your device supports eSIM before purchasing.</p>
      </div>

      {/* ── Billing + CTA ── */}
      <div className="checkout-billing">
        <h2 className="checkout-section-title">Billing information</h2>

        <div className="checkout-user-row">
          <div className="checkout-user-avatar">
            {user!.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div className="checkout-user-name">{user!.name}</div>
            <div className="checkout-user-email">{user!.email}</div>
          </div>
        </div>
        <p className="checkout-field-note" style={{ marginBottom: 20 }}>
          Your eSIM QR code will be sent to this email address.
        </p>

        {error && <p className="auth-server-error" style={{ marginBottom: 16 }}>{error}</p>}

        <div className="checkout-total-box">
          <div className="checkout-total-row">
            <span className="checkout-total-label">{dataLabel} · {plan.durationDays} days{qty > 1 ? ` × ${qty}` : ""}</span>
            <span className="checkout-total-price">{plan.price}</span>
          </div>
          <button
            type="button"
            className="btn-orange checkout-buy-btn"
            onClick={handleBuy}
            disabled={loading}
          >
            {loading ? "Redirecting to payment…" : `Buy now — ${plan.price}`}
          </button>
          <p className="checkout-terms">
            By purchasing you agree to our{" "}
            <Link href="/terms" className="checkout-terms-link">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="checkout-terms-link">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CheckoutClient({ plan, country, qty }: Props) {
  return (
    <AuthGuard>
      <CheckoutForm plan={plan} country={country} qty={qty} />
    </AuthGuard>
  );
}
