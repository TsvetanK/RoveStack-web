"use client";

import { useState, useTransition, useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { ViewTransition } from "react";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { usePreferences } from "@/lib/preferences";
import { ProductCard } from "@/components/ui/ProductCard";
import { REGION_FLAGS } from "@/lib/regions";

// ── Types ─────────────────────────────────────────────────────
interface Country {
  id: number;
  name: string;
  iso_code: string;
  flag_emoji: string;
  region: string;
  slug: string;
  products_count: number;
  price_from: { amount: number; currency: string; formatted: string };
}

interface Region {
  name: string;
  slug: string;
  countries_count: number;
  products_count: number;
  price_from: { amount: number; currency: string; formatted: string };
}

interface ApiList<T> {
  success: boolean;
  data: T[];
}


type Tab = "country" | "region";

// ── Component ─────────────────────────────────────────────────
export function ProductsSection() {
  const t = useTranslations("plans");
  const { currency } = usePreferences();
  const [tab, setTab] = useState<Tab>("country");
  const [, startTransition] = useTransition();

  const [countries, setCountries] = useState<Country[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    Promise.all([
      api.get<ApiList<Country>>("/esim?popular=true", { signal }),
      api.get<ApiList<Region>>("/regions", { signal }),
    ])
      .then(([cs, rs]) => {
        setCountries(cs.data);
        setRegions(rs.data);
        setLoading(false);
      })
      .catch(() => {
        if (!signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [currency]);

  const tabs: { id: Tab; label: string }[] = [
    { id: "country", label: t("tabCountry") },
    { id: "region", label: t("tabRegion") },
  ];

  return (
    <section className="section" id="countries">
      <div className="wrap">
        {/* ── Section header ── */}
        <div className="section-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/travel_man.png"
            alt=""
            className="countries-header-img"
            aria-hidden="true"
          />

          <div className="countries-header">
            <div className="countries-header-text">
              <h2 className="display">
                Choose your <em>destination</em>
              </h2>
              <p>Pick a prepaid eSIM data plan for your upcoming trip.</p>
            </div>

            <div className="countries-tabs" role="tablist">
              {tabs.map(({ id, label }) => (
                <button
                  key={id}
                  role="tab"
                  aria-selected={tab === id}
                  onClick={() => startTransition(() => setTab(id))}
                  className={`tab-btn${tab === id ? " active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Tab content ── */}
        <ViewTransition
          key={tab}
          default="none"
        >
          <div>
            {tab === "country" && (
              <div className="countries-grid countries-grid--4col">
                {loading
                  ? Array.from({ length: 8 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  : countries.map((c) => (
                      <ProductCard
                        key={c.id}
                        name={c.name}
                        flag={c.flag_emoji}
                        subtitle={`${c.products_count} plans`}
                        price={c.price_from.formatted}
                        href={`/esim/${c.slug}`}
                      />
                    ))}
              </div>
            )}

            {tab === "region" && (
              <div className="countries-grid countries-grid--4col">
                {loading
                  ? Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonCard key={i} />
                    ))
                  : regions.map((r) => (
                      <ProductCard
                        key={r.slug}
                        name={r.name}
                        flag={REGION_FLAGS[r.name] ?? "🌍"}
                        subtitle={`${r.countries_count} countries · ${r.products_count} plans`}
                        price={r.price_from.formatted}
                        href={`/esim?region=${r.slug}`}
                      />
                    ))}
              </div>
            )}
          </div>
        </ViewTransition>

        <div className="tab-view-all">
          <Link href="/esim" className="btn-black">
            View all
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="country-card cc-regular skeleton" aria-hidden="true">
      <div>
        <div className="cc-name-row">
          <span className="skeleton-circle" />
          <span className="skeleton-line" style={{ width: "60%" }} />
        </div>
        <span
          className="skeleton-line"
          style={{ width: "40%", marginTop: 8 }}
        />
      </div>
      <div className="cc-bottom">
        <span className="skeleton-line" style={{ width: "30%" }} />
      </div>
    </div>
  );
}
