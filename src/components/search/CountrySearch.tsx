"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { api } from "@/lib/api";
import { REGION_FLAGS } from "@/lib/regions";

// ── Types ─────────────────────────────────────────────────────
interface Country {
  id: number;
  name: string;
  flag_emoji: string;
  region: string;
  slug: string;
  price_from: { formatted: string };
}

interface Region {
  name: string;
  slug: string;
  countries_count: number;
  price_from: { formatted: string };
}

interface ProductResult {
  id: number;
  slug: string;
  price: { formatted: string };
  country: { name: string; iso_code: string; slug: string };
  details: {
    data_gb: number | null;
    unlimited: boolean;
    duration_days: number;
    speed: string[];
  };
}

interface ApiList<T> { success: boolean; data: T[]; }
interface ProductsApiResponse { success: boolean; data: ProductResult[]; }

interface NavItem {
  name: string;
  flag: string;
  subtitle: string;
  price: string;
  slug: string;
  type: "country" | "region";
}

interface PlanItem {
  id: number;
  countryName: string;
  flag: string;
  countrySlug: string;
  productSlug: string;
  dataLabel: string;
  durationDays: number;
  topSpeed: string | null;
  price: string;
}

// ── Helpers ───────────────────────────────────────────────────
function isoToFlag(iso: string): string {
  return iso
    .toUpperCase()
    .split("")
    .map((ch) => String.fromCodePoint(0x1f1e6 - 65 + ch.charCodeAt(0)))
    .join("");
}

function toNavItem(c: Country): NavItem {
  return { name: c.name, flag: c.flag_emoji, subtitle: c.region, price: c.price_from.formatted, slug: c.slug, type: "country" };
}

function toRegionItem(r: Region): NavItem {
  return { name: r.name, flag: REGION_FLAGS[r.name] ?? "🌍", subtitle: `${r.countries_count} countries`, price: r.price_from.formatted, slug: r.slug, type: "region" };
}

function toPlanItem(p: ProductResult): PlanItem {
  const d = p.details;
  return {
    id: p.id,
    countryName: p.country.name,
    flag: isoToFlag(p.country.iso_code),
    countrySlug: p.country.slug,
    productSlug: p.slug,
    dataLabel: d.unlimited ? "∞" : d.data_gb ? `${d.data_gb} GB` : "—",
    durationDays: d.duration_days,
    topSpeed: d.speed.length > 0 ? d.speed[d.speed.length - 1] : null,
    price: p.price.formatted,
  };
}

// ── Component ─────────────────────────────────────────────────
export function CountrySearch() {
  const t = useTranslations("search");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const [popular, setPopular] = useState<NavItem[]>([]);
  const [regional, setRegional] = useState<NavItem[]>([]);
  const [planResults, setPlanResults] = useState<PlanItem[]>([]);
  const [searching, setSearching] = useState(false);

  // Load popular + regions once on mount
  useEffect(() => {
    const ctrl = new AbortController();
    Promise.all([
      api.get<ApiList<Country>>("/esim?popular=true", { signal: ctrl.signal }),
      api.get<ApiList<Region>>("/regions", { signal: ctrl.signal }),
    ])
      .then(([cs, rs]) => {
        setPopular(cs.data.map(toNavItem));
        setRegional(rs.data.map(toRegionItem));
      })
      .catch(() => {});
    return () => ctrl.abort();
  }, []);

  // Debounced search — returns plans directly
  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      if (query.length < 2) {
        setPlanResults([]);
        setSearching(false);
        return;
      }
      setSearching(true);
      api
        .get<ProductsApiResponse>(`/search?q=${encodeURIComponent(query)}&type=esim&per_page=10`, { signal: ctrl.signal })
        .then((res) => {
          setPlanResults(res.data.slice(0, 10).map(toPlanItem));
          setSearching(false);
        })
        .catch(() => setSearching(false));
    }, 250);
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [query]);

  const allVisible: (NavItem | PlanItem)[] =
    query.length >= 2 ? planResults : [...popular, ...regional];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelectNav = useCallback(
    (item: NavItem) => {
      router.push(item.type === "region" ? `/esim?region=${item.slug}` : `/esim/${item.slug}`);
      setOpen(false);
      setQuery("");
    },
    [router],
  );

  const handleSelectPlan = useCallback(
    (item: PlanItem) => {
      router.push(`/esim/${item.countrySlug}?plan=${item.productSlug}`);
      setOpen(false);
      setQuery("");
    },
    [router],
  );

  function handleKey(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setActiveIdx((i) => Math.min(i + 1, allVisible.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setActiveIdx((i) => Math.max(i - 1, -1)); }
    if (e.key === "Enter" && activeIdx >= 0) {
      const item = allVisible[activeIdx];
      if ("productSlug" in item) handleSelectPlan(item);
      else handleSelectNav(item);
    }
    if (e.key === "Escape") setOpen(false);
  }

  const showPopular = query.length < 2 && popular.length > 0;
  const showRegional = query.length < 2 && regional.length > 0;
  const showSearch = query.length >= 2;
  const noResults = showSearch && !searching && planResults.length === 0;

  return (
    <div ref={wrapRef} className="relative z-30 flex-1">
      <div className="relative">
        <style>{`
          .search-bar-wrap::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 16px;
            padding: 1.5px;
            background: linear-gradient(135deg, #FF5B2E 0%, #C9A961 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
            pointer-events: none;
          }
        `}</style>
        <div
          className="search-bar-wrap flex items-center gap-3.5 bg-white rounded-2xl pl-2 pr-5 w-full"
          style={{ position: "relative" }}
        >
          <span
            className="w-9 h-9 rounded-[10px] grid place-items-center flex-shrink-0 text-white shadow-[0_4px_12px_rgba(255,91,46,0.25)]"
            style={{ background: "linear-gradient(135deg, #FF5B2E 0%, #C9A961 100%)" }}
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="2" />
              <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIdx(-1); }}
            onFocus={() => setOpen(true)}
            onKeyDown={handleKey}
            placeholder={t("placeholder")}
            autoComplete="off"
            className="flex-1 border-none outline-none bg-transparent text-[22px] h-[60px] text-ink font-[450] tracking-[-0.005em] placeholder:text-mute/70"
            aria-label={t("placeholder")}
            aria-autocomplete="list"
          />
        </div>

        {/* Dropdown */}
        <div
          className={[
            "absolute top-[calc(100%+10px)] left-0 right-0",
            "bg-white border border-[var(--line-strong)] rounded-[18px] shadow-[var(--shadow-lg)]",
            "max-h-[460px] overflow-y-auto",
            "transition-all duration-[180ms]",
            open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none",
          ].join(" ")}
          role="listbox"
        >
          {noResults ? (
            <div className="p-8 text-center text-mute text-[0.92rem]">
              No results for <strong className="text-ink font-medium">&ldquo;{query}&rdquo;</strong>
            </div>
          ) : (
            <>
              {showPopular && (
                <div className="p-3.5 pb-2.5">
                  <p className="text-[0.7rem] tracking-[0.1em] uppercase text-mute font-semibold mb-1.5 px-1.5">{t("popular")}</p>
                  {popular.map((item, i) => (
                    <NavDropdownItem key={item.slug} item={item} active={activeIdx === i} onSelect={handleSelectNav} />
                  ))}
                </div>
              )}
              {showRegional && (
                <div className="p-3.5 pt-2.5 border-t border-[var(--line)]">
                  <p className="text-[0.7rem] tracking-[0.1em] uppercase text-mute font-semibold mb-1.5 px-1.5">{t("regional")}</p>
                  {regional.map((item, i) => (
                    <NavDropdownItem key={item.slug} item={item} active={activeIdx === popular.length + i} onSelect={handleSelectNav} />
                  ))}
                </div>
              )}
              {showSearch && (
                <div className="p-3.5">
                  {searching ? (
                    <div className="py-4 text-center text-mute text-[0.88rem]">Searching…</div>
                  ) : (
                    planResults.map((item, i) => (
                      <PlanDropdownItem key={item.id} item={item} active={activeIdx === i} onSelect={handleSelectPlan} />
                    ))
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Nav item (popular / region) ───────────────────────────────
function NavDropdownItem({ item, active, onSelect }: { item: NavItem; active: boolean; onSelect: (item: NavItem) => void }) {
  return (
    <div
      role="option"
      aria-selected={active}
      onClick={() => onSelect(item)}
      className={[
        "flex items-center gap-3.5 px-2.5 py-[11px] rounded-[10px] cursor-pointer relative transition-all duration-100",
        active ? "bg-gradient-to-r from-accent/6 to-sky/4" : "hover:bg-gradient-to-r hover:from-accent/6 hover:to-sky/4",
        active ? "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-gradient-to-b before:from-accent before:to-sky before:rounded-r-sm" : "",
      ].join(" ")}
    >
      <span className="text-[1.5rem] leading-none w-7 text-center">{item.flag}</span>
      <span className="font-medium text-[0.96rem] flex-1">{item.name}</span>
      <span className="text-[0.82rem] text-mute">{item.subtitle}</span>
      <span className="font-mono text-[0.82rem] font-semibold text-accent px-2 py-0.5 rounded-md" style={{ background: "rgba(255,91,46,0.08)" }}>
        {item.price}
      </span>
    </div>
  );
}

// ── Plan item (search results) ────────────────────────────────
function PlanDropdownItem({ item, active, onSelect }: { item: PlanItem; active: boolean; onSelect: (item: PlanItem) => void }) {
  return (
    <div
      role="option"
      aria-selected={active}
      onClick={() => onSelect(item)}
      className={[
        "flex items-center gap-3 px-2.5 py-2.5 rounded-[10px] cursor-pointer relative transition-all duration-100",
        active ? "bg-gradient-to-r from-accent/6 to-sky/4" : "hover:bg-gradient-to-r hover:from-accent/6 hover:to-sky/4",
        active ? "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-gradient-to-b before:from-accent before:to-sky before:rounded-r-sm" : "",
      ].join(" ")}
    >
      <span className="text-[1.4rem] leading-none w-7 text-center flex-shrink-0">{item.flag}</span>
      <span className="font-medium text-[0.93rem] w-28 truncate flex-shrink-0">{item.countryName}</span>
      <span className="flex-1 flex items-center gap-1.5 text-[0.82rem] text-mute">
        <span className="font-semibold text-ink">{item.dataLabel}</span>
        <span aria-hidden="true">·</span>
        <span>{item.durationDays}d</span>
        {item.topSpeed && (
          <>
            <span aria-hidden="true">·</span>
            <span>{item.topSpeed}</span>
          </>
        )}
      </span>
      <span className="font-mono text-[0.82rem] font-semibold text-accent px-2 py-0.5 rounded-md flex-shrink-0" style={{ background: "rgba(255,91,46,0.08)" }}>
        {item.price}
      </span>
    </div>
  );
}
