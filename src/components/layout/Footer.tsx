import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const cols = [
    {
      heading: t("product"),
      links: [
        { href: "/esim",      label: t("links.esimStore") },
        { href: "/pricing",   label: t("links.pricing") },
        { href: "/coverage",  label: t("links.coverage") },
        { href: "/blog",      label: t("links.blog") },
      ],
    },
    {
      heading: t("company"),
      links: [
        { href: "/about",    label: t("links.about") },
        { href: "/careers",  label: t("links.careers") },
        { href: "/press",    label: t("links.press") },
      ],
    },
    {
      heading: t("support"),
      links: [
        { href: "/help",     label: t("links.helpCenter") },
        { href: "/contact",  label: t("links.contact") },
        { href: "/privacy",  label: t("links.privacy") },
        { href: "/terms",    label: t("links.terms") },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--line)] pt-20 pb-10">
      <div className="wrap">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_1fr_1fr] gap-10 mb-16">
          {/* Brand col */}
          <div>
            <Link href="/">
              <Image src="/logo.png" alt="RoveStack" width={120} height={40} style={{ height: "40px", width: "auto" }} />
            </Link>
            <p className="font-display text-[1.15rem] text-mute mt-[18px] max-w-[280px] leading-[1.5]">
              {t("tagline")}
            </p>
          </div>

          {/* Link cols */}
          {cols.map((col) => (
            <div key={col.heading}>
              <h4 className="font-mono text-[0.72rem] tracking-[0.12em] uppercase text-mute font-medium mb-4">
                {col.heading}
              </h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[0.92rem] text-ink transition-colors duration-200 hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[var(--line)] pt-8 flex flex-wrap justify-between gap-5 text-[0.85rem] text-mute">
          <p>{t("copyright", { year })}</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-ink transition-colors duration-200">
              {t("links.privacy")}
            </Link>
            <Link href="/terms" className="hover:text-ink transition-colors duration-200">
              {t("links.terms")}
            </Link>
            <Link href="/help" className="hover:text-ink transition-colors duration-200">
              {t("links.helpCenter")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
