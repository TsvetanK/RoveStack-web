import { Link } from "@/i18n/navigation";

const ArrowDiag = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M3 11L11 3m0 0H5m6 0v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export interface ProductCardProps {
  /** Country or product name */
  name: string;
  /** Flag emoji or image */
  flag: string;
  /** Subtitle — e.g. "1 GB · 7 days" or region name */
  subtitle: string;
  /** Formatted price — e.g. "€3.99" or "from €1.99" */
  price: string;
  /** Optional price unit — e.g. "/GB" or "/mo" */
  unit?: string;
  /** Navigation target */
  href: string;
  /** Optional badge text */
  badge?: string;
  /** Highlight badge in accent color */
  hot?: boolean;
}

export function ProductCard({ name, flag, subtitle, price, unit, href, badge, hot }: ProductCardProps) {
  return (
    <Link href={href as never} className="product-card">
      <div>
        <div className="cc-name-row">
          <span className="cc-flag">{flag}</span>
          <span className="cc-name">{name}</span>
          {badge && <span className={`cc-badge${hot ? " hot" : ""}`}>{badge}</span>}
        </div>
        <div className="product-title">{subtitle}</div>
      </div>

      <div className="cc-bottom">
        <div className="cc-price">
          <small className="cc-price-from">from</small>
          {price}
          {unit && <small>{unit}</small>}
        </div>
        <div className="cc-arrow">
          <ArrowDiag />
        </div>
      </div>
    </Link>
  );
}
