"use client";

import { useState, useTransition, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import { api } from "@/lib/api";
import { usePreferences } from "@/lib/preferences";
import { ProductCard } from "@/components/ui/ProductCard";
import { REGION_FLAGS, regionFlag } from "@/lib/regions";

type Tab = "countries" | "region";

export interface Country {
  id: number;
  name: string;
  iso_code: string;
  flag_emoji: string;
  region: string;
  slug: string;
  products_count: number;
  price_from: { amount: number; currency: string; formatted: string };
}

export interface Region {
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

interface Props {
  initialCountries: Country[];
  initialRegions: Region[];
}

export function EsimStoreClient({ initialCountries, initialRegions }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [, startTransition] = useTransition();
  const { currency } = usePreferences();

  const activeRegion = searchParams.get("region") ?? null;
  // If URL has a region param, we're always in region tab regardless of local state
  const [localTab, setLocalTab] = useState<Tab>("countries");
  const tab: Tab = activeRegion ? "region" : localTab;
  const [query, setQuery] = useState("");

  const [allCountries, setAllCountries] = useState<Country[]>(initialCountries);
  const [regions, setRegions] = useState<Region[]>(initialRegions);

  // Re-fetch only when currency changes (prices update)
  useEffect(() => {
    const ctrl = new AbortController();
    Promise.all([
      api.get<ApiList<Country>>("/esim", { signal: ctrl.signal }),
      api.get<ApiList<Region>>("/regions", { signal: ctrl.signal }),
    ])
      .then(([cs, rs]) => {
        setAllCountries(cs.data);
        setRegions(rs.data);
      })
      .catch(() => {});
    return () => ctrl.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currency]);

  const showRegionOverview = tab === "region" && activeRegion === null;

  const visibleCountries = useMemo(() => {
    let list = allCountries;
    if (activeRegion) {
      const region = regions.find((r) => r.slug === activeRegion);
      const regionName = region?.name ?? activeRegion;
      list = list.filter(
        (c) => c.region.toLowerCase() === regionName.toLowerCase(),
      );
    }
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return list;
  }, [allCountries, regions, activeRegion, query]);

  const switchTab = (next: Tab) => {
    startTransition(() => {
      setLocalTab(next);
      setQuery("");
      if (activeRegion) router.push("/esim" as never);
    });
  };

  const goBackToRegions = () => {
    startTransition(() => {
      setQuery("");
      router.push("/esim" as never);
    });
  };

  return (
    <>
      <div className="countries-tabs store-tabs" role="tablist">
        <button
          role="tab"
          aria-selected={tab === "countries"}
          onClick={() => switchTab("countries")}
          className={`tab-btn${tab === "countries" ? " active" : ""}`}
        >
          Countries
        </button>
        <button
          role="tab"
          aria-selected={tab === "region"}
          onClick={() => switchTab("region")}
          className={`tab-btn${tab === "region" ? " active" : ""}`}
        >
          Region
        </button>
      </div>

      {tab === "region" && activeRegion && (
        <div className="store-region-back">
          <button className="store-back-btn" onClick={goBackToRegions}>
            <span className="material-icons" style={{ fontSize: 18 }}>
              arrow_back
            </span>
            All regions
          </button>
          <span className="store-region-label">
            {regionFlag(activeRegion)}{" "}
            {regions.find((r) => r.slug === activeRegion)?.name ?? activeRegion}
          </span>
        </div>
      )}

      {!showRegionOverview && (
        <div className="store-search">
          <span className="material-icons store-search-icon">search</span>
          <input
            type="search"
            placeholder="Search for destination…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="store-search-input"
          />
          {query && (
            <button
              className="store-search-clear"
              onClick={() => setQuery("")}
              aria-label="Clear"
            >
              <span className="material-icons" style={{ fontSize: 18 }}>
                close
              </span>
            </button>
          )}
        </div>
      )}

      {/* Region overview */}
      {showRegionOverview && (
        <div className="countries-grid countries-grid--3col store-grid">
          {regions.map((r) => (
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

      {/* Countries list */}
      {!showRegionOverview && (
        <div className="countries-grid countries-grid--4col store-grid">
          {visibleCountries.map((c) => (
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
    </>
  );
}
