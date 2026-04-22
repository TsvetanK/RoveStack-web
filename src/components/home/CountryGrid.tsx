"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ViewTransition } from "react";
import { useTranslations } from "next-intl";

// ── Arrow icon ────────────────────────────────────────────────
const ArrowDiag = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 11L11 3m0 0H5m6 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// ── Data ─────────────────────────────────────────────────────
const COUNTRIES = [
  { name: "Thailand",       slug: "thailand",       flag: "🇹🇭", region: "Southeast Asia",       price: "$6", unit: "/GB" },
  { name: "Mexico",         slug: "mexico",         flag: "🇲🇽", region: "North America",         price: "$7", unit: "/GB" },
  { name: "Japan",          slug: "japan",          flag: "🇯🇵", region: "East Asia",             price: "$8", unit: "/GB" },
  { name: "United States",  slug: "united-states",  flag: "🇺🇸", region: "All 50 states · 5G",   price: "$9", unit: "/GB" },
  { name: "Germany",        slug: "germany",        flag: "🇩🇪", region: "Central Europe",        price: "$5", unit: "/GB" },
  { name: "United Kingdom", slug: "united-kingdom", flag: "🇬🇧", region: "Western Europe",        price: "$6", unit: "/GB" },
  { name: "Australia",      slug: "australia",      flag: "🇦🇺", region: "Oceania",               price: "$9", unit: "/GB" },
  { name: "Brazil",         slug: "brazil",         flag: "🇧🇷", region: "South America",         price: "$8", unit: "/GB" },
];

const REGIONS = [
  { name: "Europe",       slug: "europe",       flag: "🇪🇺", region: "39 countries · One plan",  price: "$5",  unit: "/GB", variant: "cc-wide" as const },
  { name: "Asia Pacific", slug: "asia-pacific", flag: "🌏",  region: "18 countries · One plan",  price: "$7",  unit: "/GB", variant: "cc-wide" as const },
  { name: "Americas",     slug: "americas",     flag: "🌎",  region: "North & South America",    price: "$8",  unit: "/GB", variant: "cc-wide" as const },
  { name: "World",        slug: "world",        flag: "🌍",  region: "124 countries · One plan", price: "$12", unit: "/GB", variant: "cc-wide" as const },
];

const PLANS = [
  { name: "Light",  slug: "light",  flag: "⚡", region: "5 GB · 30 days",        price: "$15", unit: "/mo", variant: "cc-regular" as const },
  { name: "Pro",    slug: "pro",    flag: "🚀", region: "15 GB · 36 days",       price: "$35", unit: "/mo", variant: "cc-regular" as const },
  { name: "Global", slug: "global", flag: "🌐", region: "30 GB · 124 countries", price: "$60", unit: "/mo", variant: "cc-wide"    as const },
];

type Tab = "country" | "region" | "plans";

// ── Component ─────────────────────────────────────────────────
export function CountryGrid() {
  const t = useTranslations("plans");
  const [tab, setTab] = useState<Tab>("country");
  const [, startTransition] = useTransition();

  const tabs: { id: Tab; label: string }[] = [
    { id: "country", label: t("tabCountry") },
    { id: "region",  label: t("tabRegion") },
    { id: "plans",   label: t("tabPlans") },
  ];

  return (
    <section className="section" id="countries">
      <div className="wrap">

        {/* ── Section header ── */}
        <div className="section-head">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/travel_man.png" alt="" className="countries-header-img" aria-hidden="true" />

          <div className="countries-header">
            <div className="countries-header-text">
              <h2 className="display">
                Choose your <em>destination</em>
              </h2>
              <p>Pick a prepaid eSIM data plan for your upcoming trip.</p>
            </div>

            {/* Tabs */}
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
        <ViewTransition key={tab} enter="fade-in" exit="fade-out" default="none">
          <div>
            {/* Country tab — 4-col equal grid */}
            {tab === "country" && (
              <div className="countries-grid countries-grid--4col">
                {COUNTRIES.map((c) => (
                  <CountryCard key={c.slug} {...c} variant="cc-regular" />
                ))}
              </div>
            )}

            {/* Region tab — 12-col grid, cc-wide cards */}
            {tab === "region" && (
              <div className="countries-grid">
                {REGIONS.map((c) => (
                  <CountryCard key={c.slug} {...c} />
                ))}
              </div>
            )}

            {/* Plans tab — 12-col grid, mixed sizes */}
            {tab === "plans" && (
              <div className="countries-grid">
                {PLANS.map((c) => (
                  <CountryCard key={c.slug} {...c} />
                ))}
              </div>
            )}
          </div>
        </ViewTransition>

        <div className="tab-view-all">
          <Link href="/esim" className="btn-black">View all</Link>
        </div>
      </div>
    </section>
  );
}

// ── Card ──────────────────────────────────────────────────────
interface CardProps {
  name: string;
  slug: string;
  flag: string;
  region: string;
  price: string;
  unit: string;
  variant?: "cc-featured" | "cc-regular" | "cc-wide";
  badge?: string;
  hot?: boolean;
}

function CountryCard({ name, slug, flag, region, price, unit, variant = "cc-regular", badge, hot }: CardProps) {
  return (
    <Link href={`/esim/${slug}`} className={`country-card ${variant}`}>
      <div>
        <div className="cc-name-row">
          <span className="cc-flag">{flag}</span>
          <span className="cc-name">{name}</span>
          {badge && <span className={`cc-badge${hot ? " hot" : ""}`}>{badge}</span>}
        </div>
        <div className="cc-region">{region}</div>
      </div>

      <div className="cc-bottom">
        <div className="cc-price">
          {price}<small>{unit}</small>
        </div>
        <div className="cc-arrow">
          <ArrowDiag />
        </div>
      </div>
    </Link>
  );
}
