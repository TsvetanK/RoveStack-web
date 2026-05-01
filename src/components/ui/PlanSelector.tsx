"use client";

import { useState } from "react";
import { PlanCard, type PlanCardProps } from "./PlanCard";

type Plan = Omit<PlanCardProps, "selected" | "onSelect">;

interface Props {
  plans: Plan[];
  countryName: string;
  countryFlag: string;
}

function formatTotal(price: string, qty: number): string {
  if (qty === 1) return price;
  const match = price.match(/[\d.,]+/);
  if (!match) return price;
  const num = parseFloat(match[0].replace(",", ".")) * qty;
  const symbol = price.replace(/[\d.,\s]+/, "").trim();
  return `${symbol}${num.toFixed(2)}`;
}

export function PlanSelector({ plans, countryName, countryFlag }: Props) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [qty, setQty] = useState(1);

  const selected = plans.find((p) => p.id === selectedId) ?? null;
  const dataLabel = selected
    ? selected.unlimited
      ? "Unlimited"
      : selected.dataGb
        ? `${selected.dataGb} GB`
        : "—"
    : "";

  return (
    <>
      <div className="plan-grid">
        {plans.map((p) => (
          <PlanCard
            key={p.id}
            {...p}
            selected={p.id === selectedId}
            onSelect={() => {
              setSelectedId(p.id === selectedId ? null : p.id);
              setQty(1);
            }}
          />
        ))}
      </div>

      <div
        className={`plan-footer${selected ? " visible" : ""}`}
        role="region"
        aria-label="Selected plan"
        style={{
          position: "fixed",
          left: "50%",
          bottom: "24px",
          zIndex: 50,
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
        }}
      >
        <div className="plan-footer-left">
          <span className="plan-footer-flag">{countryFlag}</span>
          <span className="plan-footer-country">{countryName}</span>
        </div>

        <div className="plan-footer-right">
          <span className="plan-footer-meta">{dataLabel}</span>
          <span className="plan-footer-sep" aria-hidden="true">
            ·
          </span>
          <span className="plan-footer-meta">
            {selected?.durationDays} days
          </span>
          <span className="plan-footer-sep" aria-hidden="true">
            ·
          </span>
          <span className="plan-footer-price">
            {selected ? formatTotal(selected.price, qty) : ""}
          </span>

          <div className="plan-qty">
            <button
              className="plan-qty-btn"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Decrease"
            >
              −
            </button>
            <span className="plan-qty-num">{qty}</span>
            <button
              className="plan-qty-btn"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Increase"
            >
              +
            </button>
          </div>

          <a
            href={
              selected
                ? `/esim/${plans[0]?.slug.split("/")[0]}/${selected.slug}`
                : "#"
            }
            className="btn-orange plan-footer-buy"
          >
            Buy now
          </a>
        </div>
      </div>
    </>
  );
}
