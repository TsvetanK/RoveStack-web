type BadgeVariant = "default" | "hot" | "featured" | "muted";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-black/5 text-ink",
  hot: "bg-[image:var(--accent-gradient)] text-white",
  featured: "bg-white/10 text-paper",
  muted: "bg-black/5 text-mute",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={[
        "font-mono text-[0.68rem] tracking-[0.1em] uppercase",
        "px-2.5 py-1.5 rounded-full",
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </span>
  );
}
