const CheckIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2.5 7l3.5 3.5 5.5-7"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const SpeedIcon = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M12 2a10 10 0 1 0 10 10"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 12l4.5-4.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

export interface PlanCardProps {
  id: number;
  slug: string;
  title: string;
  dataGb: number | null;
  unlimited: boolean;
  durationDays: number;
  price: string;
  speed: string[];
  hasVoice: boolean;
  hasSms: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

export function PlanCard({
  dataGb,
  unlimited,
  durationDays,
  price,
  speed,
  hasVoice,
  hasSms,
  selected,
  onSelect,
}: PlanCardProps) {
  const dataLabel = unlimited ? "Unlimited" : dataGb ? `${dataGb} GB` : "—";
  const topSpeed = speed.length > 0 ? speed[speed.length - 1] : null;

  const badges = [hasVoice ? "Voice" : null, hasSms ? "SMS" : null].filter(
    Boolean,
  ) as string[];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`plan-card${selected ? " selected" : ""}`}
      aria-pressed={selected}
    >
      {selected && (
        <span className="plan-card-check-badge" aria-hidden="true">
          <CheckIcon />
        </span>
      )}

      <div className="plan-card-body">
        <div className="plan-data-label">{dataLabel + " data"}</div>
        <div className="plan-card-meta-row">
          <span>
            <span className="plan-card-section-label">Validity: </span>
            {durationDays} days
          </span>
          <div className="plan-card-meta-right">
            {topSpeed && (
              <span className="plan-card-speed-inline">
                <SpeedIcon />
                {topSpeed}
              </span>
            )}
            {badges.map((b) => (
              <span key={b} className="plan-card-badge">
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="cc-bottom">
        <div className="cc-price">{price}</div>
        <div className={`cc-arrow${selected ? " selected" : ""}`}>
          <CheckIcon />
        </div>
      </div>
    </button>
  );
}
