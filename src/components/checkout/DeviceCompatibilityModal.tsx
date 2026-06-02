"use client";

import { useState, useEffect, useRef } from "react";
import { api } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";

interface Device {
  id: number;
  brand: string;
  model: string;
  category: string;
}

interface ApiResponse { data: Device[]; }

interface Props {
  open: boolean;
  onClose: () => void;
}

const categoryIcon: Record<string, string> = {
  smartphone: "📱",
  tablet: "📟",
  watch: "⌚",
  laptop: "💻",
};

const categoryLabel: Record<string, string> = {
  smartphone: "Smartphone",
  tablet: "Tablet",
  watch: "Smartwatch",
  laptop: "Laptop",
};

const popularBrands = ["Apple", "Samsung", "Google", "OnePlus", "Motorola"];

export function DeviceCompatibilityModal({ open, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Device[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      setSearched(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      if (query.length < 2) {
        setResults([]);
        setSearched(false);
        return;
      }
      setLoading(true);
      api.get<ApiResponse>(`/compatibility?q=${encodeURIComponent(query)}`, { signal: ctrl.signal })
        .then((r) => { setResults(r.data); setSearched(true); setLoading(false); })
        .catch(() => setLoading(false));
    }, 250);
    return () => { clearTimeout(timer); ctrl.abort(); };
  }, [query]);

  function searchBrand(brand: string) {
    setQuery(brand);
  }

  if (!open) return null;

  const grouped = results.reduce<Record<string, Device[]>>((acc, d) => {
    if (!acc[d.brand]) acc[d.brand] = [];
    acc[d.brand].push(d);
    return acc;
  }, {});

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Device compatibility"
      subtitle="Check if your device supports eSIM technology"
      maxWidth={540}
    >
        {/* Search */}
        <div className="dc-search-wrap">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" className="dc-search-icon">
            <circle cx="9" cy="9" r="6.5" stroke="currentColor" strokeWidth="2"/>
            <path d="M14 14l4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search device (e.g. iPhone 15, Pixel 8…)"
            className="dc-search-input"
          />
          {query && (
            <button className="dc-clear" onClick={() => setQuery("")} aria-label="Clear">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </button>
          )}
        </div>

        {/* Popular brands */}
        {!query && (
          <div className="dc-brands">
            <div className="dc-brands-label">Popular brands</div>
            <div className="dc-brands-list">
              {popularBrands.map((b) => (
                <button key={b} className="dc-brand-chip" onClick={() => searchBrand(b)}>
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        <div className="dc-results">
          {loading && (
            <div className="dc-status">
              <div className="auth-guard-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              Searching…
            </div>
          )}

          {!loading && searched && results.length === 0 && (
            <div className="dc-status dc-not-found">
              <span style={{ fontSize: "1.8rem" }}>😕</span>
              <div>
                <div style={{ fontWeight: 600, color: "var(--ink)" }}>Device not found</div>
                <div style={{ fontSize: "0.82rem", color: "var(--mute)", marginTop: 4 }}>
                  &ldquo;{query}&rdquo; may not support eSIM or isn&apos;t in our database yet.
                </div>
              </div>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="dc-groups">
              {Object.entries(grouped).map(([brand, devices]) => (
                <div key={brand} className="dc-group">
                  <div className="dc-group-brand">{brand}</div>
                  {devices.map((d) => (
                    <div key={d.id} className="dc-device-row">
                      <span className="dc-device-icon">{categoryIcon[d.category] ?? "📱"}</span>
                      <span className="dc-device-model">{d.model}</span>
                      <span className="dc-device-category">{categoryLabel[d.category] ?? d.category}</span>
                      <span className="dc-compatible-badge">✓ eSIM</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {!query && !loading && (
            <div className="dc-hint">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8"/>
                <path d="M12 8v5m0 3v.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Type at least 2 characters to search. All listed devices are eSIM compatible.
            </div>
          )}
        </div>
    </Modal>
  );
}
