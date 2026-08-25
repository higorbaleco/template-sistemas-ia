import type { ReactNode } from "react";

type MetricCardProps = {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "positive" | "alert";
  icon?: ReactNode;
};

export function MetricCard({ label, value, hint, tone = "default", icon }: MetricCardProps) {
  return (
    <article className={`metric-card tone-${tone}`}>
      <span className="metric-card__accent" aria-hidden="true" />
      <div className="metric-card__label">
        {icon}
        <span>{label}</span>
      </div>
      <strong>{value}</strong>
      {hint ? <p>{hint}</p> : null}
    </article>
  );
}
