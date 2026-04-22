"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const POPULAR = [
  {
    name: "Thailand",
    iso: "TH",
    flag: "🇹🇭",
    region: "Southeast Asia",
    price: "$6/GB",
  },
  { name: "Japan", iso: "JP", flag: "🇯🇵", region: "East Asia", price: "$8/GB" },
  {
    name: "United States",
    iso: "US",
    flag: "🇺🇸",
    region: "North America",
    price: "$9/GB",
  },
  {
    name: "Germany",
    iso: "DE",
    flag: "🇩🇪",
    region: "Central Europe",
    price: "$5/GB",
  },
  {
    name: "United Kingdom",
    iso: "GB",
    flag: "🇬🇧",
    region: "Western Europe",
    price: "$6/GB",
  },
  {
    name: "Australia",
    iso: "AU",
    flag: "🇦🇺",
    region: "Oceania",
    price: "$9/GB",
  },
];

const REGIONAL = [
  {
    name: "Europe",
    flag: "🇪🇺",
    region: "39 countries · One plan",
    price: "$5/GB",
  },
  {
    name: "Asia Pacific",
    flag: "🌏",
    region: "18 countries · One plan",
    price: "$7/GB",
  },
  {
    name: "Americas",
    flag: "🌎",
    region: "North & South America",
    price: "$8/GB",
  },
  {
    name: "Global",
    flag: "🌍",
    region: "124 countries · One plan",
    price: "$12/GB",
  },
];

interface SearchItem {
  name: string;
  flag: string;
  region: string;
  price: string;
  iso?: string;
  slug?: string;
}

export function CountrySearch() {
  const t = useTranslations("search");
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  const filtered: SearchItem[] =
    query.length > 0
      ? [...POPULAR, ...REGIONAL].filter(
          (c) =>
            c.name.toLowerCase().includes(query.toLowerCase()) ||
            c.region.toLowerCase().includes(query.toLowerCase()),
        )
      : [];

  const allVisible = query.length > 0 ? filtered : [...POPULAR, ...REGIONAL];

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = useCallback(
    (item: SearchItem) => {
      const slug = item.iso
        ? item.name.toLowerCase().replace(/\s+/g, "-")
        : item.name.toLowerCase().replace(/\s+/g, "-");
      router.push(`/esim/${slug}`);
      setOpen(false);
      setQuery("");
    },
    [router],
  );

  function handleKey(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, allVisible.length - 1));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    }
    if (e.key === "Enter" && activeIdx >= 0)
      handleSelect(allVisible[activeIdx]);
    if (e.key === "Escape") setOpen(false);
  }

  const popularItems = query ? [] : POPULAR;
  const regionalItems = query ? [] : REGIONAL;
  const searchResults = query ? filtered : [];

  return (
    <div ref={wrapRef} className="relative z-30 flex-1">
      {/* Search bar with gradient border */}
      <div className="relative">
        <div
          className="flex items-center gap-3.5 bg-white rounded-2xl"
          style={{
            position: "relative",
          }}
        >
          {/* Gradient border via pseudo-element approach with inline style */}
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
            {/* Icon badge */}
            <span
              className="w-9 h-9 rounded-[10px] grid place-items-center flex-shrink-0 text-white shadow-[0_4px_12px_rgba(255,91,46,0.25)]"
              style={{
                background: "linear-gradient(135deg, #FF5B2E 0%, #C9A961 100%)",
              }}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 20 20"
                fill="none"
                aria-hidden="true"
              >
                <circle
                  cx="9"
                  cy="9"
                  r="6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <path
                  d="M14 14l4 4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setOpen(true);
                setActiveIdx(-1);
              }}
              onFocus={() => setOpen(true)}
              onKeyDown={handleKey}
              placeholder={t("placeholder")}
              autoComplete="off"
              className="flex-1 border-none outline-none bg-transparent text-[22px] h-[60px] text-ink font-[450] tracking-[-0.005em] placeholder:text-mute/70"
              aria-label={t("placeholder")}
              aria-autocomplete="list"
              aria-expanded={open}
            />
          </div>
        </div>

        {/* Dropdown */}
        <div
          className={[
            "absolute top-[calc(100%+10px)] left-0 right-0",
            "bg-white border border-[var(--line-strong)] rounded-[18px] shadow-[var(--shadow-lg)]",
            "max-h-[420px] overflow-y-auto",
            "transition-all duration-[180ms]",
            open
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 -translate-y-2 pointer-events-none",
          ].join(" ")}
          role="listbox"
        >
          {searchResults.length === 0 && query.length > 0 ? (
            <div className="p-8 text-center text-mute text-[0.92rem]">
              No results for{" "}
              <strong className="text-ink font-medium">
                &ldquo;{query}&rdquo;
              </strong>
            </div>
          ) : (
            <>
              {/* Popular */}
              {popularItems.length > 0 && (
                <div className="p-3.5 pb-2.5">
                  <p className="text-[0.7rem] tracking-[0.1em] uppercase text-mute font-semibold mb-1.5 px-1.5">
                    {t("popular")}
                  </p>
                  {popularItems.map((item, i) => (
                    <DropdownItem
                      key={item.name}
                      item={item}
                      active={activeIdx === i}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}

              {/* Regional */}
              {regionalItems.length > 0 && (
                <div className="p-3.5 pt-2.5 border-t border-[var(--line)]">
                  <p className="text-[0.7rem] tracking-[0.1em] uppercase text-mute font-semibold mb-1.5 px-1.5">
                    {t("regional")}
                  </p>
                  {regionalItems.map((item, i) => (
                    <DropdownItem
                      key={item.name}
                      item={item}
                      active={activeIdx === POPULAR.length + i}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}

              {/* Search results */}
              {searchResults.length > 0 && (
                <div className="p-3.5">
                  {searchResults.map((item, i) => (
                    <DropdownItem
                      key={item.name}
                      item={item}
                      active={activeIdx === i}
                      onSelect={handleSelect}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function DropdownItem({
  item,
  active,
  onSelect,
}: {
  item: SearchItem;
  active: boolean;
  onSelect: (item: SearchItem) => void;
}) {
  return (
    <div
      role="option"
      aria-selected={active}
      onClick={() => onSelect(item)}
      className={[
        "flex items-center gap-3.5 px-2.5 py-[11px] rounded-[10px] cursor-pointer",
        "relative transition-all duration-100",
        active
          ? "bg-gradient-to-r from-accent/6 to-sky/4"
          : "hover:bg-gradient-to-r hover:from-accent/6 hover:to-sky/4",
        active
          ? "before:absolute before:left-0 before:top-2 before:bottom-2 before:w-[3px] before:bg-gradient-to-b before:from-accent before:to-sky before:rounded-r-sm"
          : "",
      ].join(" ")}
    >
      <span className="text-[1.5rem] leading-none w-7 text-center">
        {item.flag}
      </span>
      <span className="font-medium text-[0.96rem] flex-1">{item.name}</span>
      <span className="text-[0.82rem] text-mute">{item.region}</span>
      <span
        className="font-mono text-[0.82rem] font-semibold text-accent px-2 py-0.5 rounded-md"
        style={{ background: "rgba(255,91,46,0.08)" }}
      >
        {item.price}
      </span>
    </div>
  );
}
