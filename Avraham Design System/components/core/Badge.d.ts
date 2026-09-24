import * as React from "react";

/** Status pill: TEMPO REAL, ATIVO, API OFICIAL, SLA em risco. */
export interface BadgeProps {
  children: React.ReactNode;
  tone?: "live" | "info" | "warn" | "danger" | "neutral" | "solid";
  /** Leading status dot. */
  dot?: boolean;
  /** Animate the dot — reserve for genuinely live data. */
  pulse?: boolean;
  icon?: string;
  /** Uppercase + wide tracking (default). Set false for sentence-case tags. */
  uppercase?: boolean;
  style?: React.CSSProperties;
}
export declare function Badge(props: BadgeProps): JSX.Element;
