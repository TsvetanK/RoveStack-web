"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { localeLabels, type Locale, locales } from "@/i18n/config";
import { usePreferences } from "@/lib/preferences";
import { useAuth } from "@/lib/auth";
import { CountrySearch } from "@/components/search/CountrySearch";

interface NavbarProps { locale: Locale; }

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="pop-check" aria-hidden="true">
      <path d="M2 7l4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations("nav");
  const tAuth = useTranslations("auth");
  const pathname = usePathname();
  const { currency, setCurrency, currencies, currenciesLoading } = usePreferences();
  const { user, logout } = useAuth();
  const [langOpen, setLangOpen] = useState(false);
  const [currOpen, setCurrOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const closeAll = useCallback(() => {
    setLangOpen(false);
    setCurrOpen(false);
    setUserOpen(false);
  }, []);

  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      const target = e.target as Node;
      if (
        langRef.current?.contains(target) ||
        currRef.current?.contains(target) ||
        userRef.current?.contains(target)
      ) return;
      closeAll();
    }
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [closeAll]);

  const navLinks = [
    { href: "/",      label: t("home") },
    { href: "/esim",  label: t("store") },
    { href: "/about", label: t("about") },
    { href: "/help",  label: t("help") },
  ];

  const initials = user
    ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
    : "";

  return (
    <nav
      className="sticky top-0 z-50 pb-[30px]"
      style={{
        background: "rgba(245,241,234,0.82)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
      }}
    >
      <div className="wrap">
        {/* ── Top row ── */}
        <div className="flex items-center justify-between h-[72px]">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5">
            <Image
              src="/logo.png"
              alt="RoveStack"
              width={140}
              height={35}
              style={{ height: "35px", width: "auto" }}
              priority
            />
            <span className="font-mono font-bold text-[1.40rem] tracking-[-0.03em] text-ink">
              RoveStack
            </span>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex gap-9 text-[0.93rem] font-semibold" aria-label="Main">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={[
                  "relative py-1.5 transition-colors duration-200 hover:text-accent",
                  "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0",
                  "after:h-0.5 after:bg-accent after:rounded-sm",
                  "after:origin-left after:transition-[transform] after:duration-[250ms] after:ease-[cubic-bezier(0.2,0.8,0.2,1)]",
                  pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href))
                    ? "text-accent after:scale-x-100 after:opacity-50"
                    : "after:scale-x-0 hover:after:scale-x-100 after:opacity-50",
                ].join(" ")}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA area */}
          <div className="flex items-center gap-2.5">

            {/* Language selector */}
            <div ref={langRef} style={{ position: "relative" }}>
              <button
                className={`icon-btn${langOpen ? " active" : ""}`}
                onClick={() => { setLangOpen(!langOpen); setCurrOpen(false); setUserOpen(false); }}
                aria-label="Select language"
                aria-haspopup="true"
                aria-expanded={langOpen}
              >
                <span className="material-icons">language</span>
              </button>
              <div className={`popover${langOpen ? " open" : ""}`} role="menu">
                <div className="popover-header">Language</div>
                {locales.map((loc) => {
                  const info = localeLabels[loc];
                  return (
                    <Link
                      key={loc}
                      href={`/${loc}`}
                      role="menuitem"
                      onClick={closeAll}
                      className={`popover-item${loc === locale ? " selected" : ""}`}
                    >
                      <span className="pop-flag">{info.flag}</span>
                      <span className="pop-label">{info.nativeName}</span>
                      <span className="pop-sub">{loc.toUpperCase()}</span>
                      <CheckIcon />
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Currency selector */}
            <div ref={currRef} style={{ position: "relative" }}>
              <button
                className={`icon-btn${currOpen ? " active" : ""}`}
                onClick={() => { setCurrOpen(!currOpen); setLangOpen(false); setUserOpen(false); }}
                aria-label="Select currency"
                aria-haspopup="true"
                aria-expanded={currOpen}
              >
                <span className="material-icons">payments</span>
              </button>
              <div className={`popover${currOpen ? " open" : ""}`} role="menu">
                <div className="popover-header">Currency</div>
                {currenciesLoading ? (
                  <div className="popover-item" style={{ opacity: 0.5, pointerEvents: "none" }}>Loading…</div>
                ) : (
                  currencies.map((cur) => (
                    <button
                      key={cur.code}
                      role="menuitem"
                      onClick={() => { setCurrency(cur.code); setCurrOpen(false); }}
                      className={`popover-item${cur.code === currency ? " selected" : ""}`}
                    >
                      <span className="pop-symbol">{cur.symbol}</span>
                      <span className="pop-label">{cur.name}</span>
                      <span className="pop-sub">{cur.code}</span>
                      <CheckIcon />
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Divider */}
            <span style={{ width: 1, height: 24, background: "var(--line-strong)", margin: "0 4px" }} aria-hidden="true" />

            {/* Auth area */}
            {user ? (
              <div ref={userRef} style={{ position: "relative" }}>
                <button
                  className={`icon-btn nav-avatar${userOpen ? " active" : ""}`}
                  onClick={() => { setUserOpen(!userOpen); setLangOpen(false); setCurrOpen(false); }}
                  aria-label="Account menu"
                  aria-haspopup="true"
                  aria-expanded={userOpen}
                >
                  {user.avatar_url ? (
                    <Image src={user.avatar_url} alt={user.name} width={28} height={28} className="rounded-full" />
                  ) : (
                    <span className="nav-avatar-initials">{initials}</span>
                  )}
                </button>
                <div className={`popover${userOpen ? " open" : ""}`} role="menu">
                  <div className="popover-header">{user.name}</div>
                  <div className="popover-sub-header">{user.email}</div>
                  <Link href="/dashboard" role="menuitem" onClick={closeAll} className="popover-item">
                    <span className="material-icons pop-icon">dashboard</span>
                    <span className="pop-label">Dashboard</span>
                  </Link>
                  <Link href="/dashboard/esims" role="menuitem" onClick={closeAll} className="popover-item">
                    <span className="material-icons pop-icon">sim_card</span>
                    <span className="pop-label">My eSIMs</span>
                  </Link>
                  <div className="popover-divider" />
                  <button
                    role="menuitem"
                    onClick={() => { closeAll(); logout(); }}
                    className="popover-item popover-item--danger"
                  >
                    <span className="material-icons pop-icon">logout</span>
                    <span className="pop-label">{tAuth("logout")}</span>
                  </button>
                </div>
              </div>
            ) : (
              <Link href="/auth/login" className="btn-orange">
                {tAuth("signIn")}
              </Link>
            )}
          </div>
        </div>

        {/* Search row */}
        <div className="flex items-center gap-3 pt-10 relative">
          <CountrySearch />
        </div>
      </div>
    </nav>
  );
}
