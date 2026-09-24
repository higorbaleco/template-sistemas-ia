import * as React from "react";

/** Donut gauge for the AI lead score ("91 · Score IA") and goal completion. */
export interface ScoreRingProps {
  /** 0–100. Colour thresholds: >=75 emerald, >=45 amber, below that red. */
  value: number;
  size?: number;
  thickness?: number;
  /** Tiny uppercase caption inside the ring. */
  label?: string;
  /** Force a colour instead of the threshold logic. */
  tone?: string;
  style?: React.CSSProperties;
}
export declare function ScoreRing(props: ScoreRingProps): JSX.Element;
