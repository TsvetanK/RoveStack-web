import { forwardRef } from "react";
import Link from "next/link";

export type ButtonVariant = "orange" | "black" | "ghost" | "outline";

function variantClass(v: ButtonVariant) {
  return `btn-${v}`;
}

// ── Link button ───────────────────────────────────────────────
interface ButtonLinkProps {
  href: string;
  variant?: ButtonVariant;
  lg?: boolean;
  className?: string;
  children: React.ReactNode;
  target?: string;
  rel?: string;
}

export function ButtonLink({
  href,
  variant = "orange",
  lg,
  className,
  children,
  target,
  rel,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      target={target}
      rel={rel}
      className={[variantClass(variant), lg ? "btn-lg" : "", className].filter(Boolean).join(" ")}
    >
      {children}
    </Link>
  );
}

// ── Button element ────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  lg?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "orange", lg, className, children, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={[variantClass(variant), lg ? "btn-lg" : "", className].filter(Boolean).join(" ")}
      {...props}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

// ── Arrow icon (reused in buttons) ───────────────────────────
export const ArrowIcon = () => (
  <svg width="18" height="18" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path
      d="M3 7h8m0 0L7 3m4 4L7 11"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
