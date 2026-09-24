import * as React from "react";

/** Linear progress: quotas, XP to next level, campaign delivery, plan usage. */
export interface ProgressBarProps {
  value: number;
  max?: number;
  /** "flow" paints the green→purple brand gradient — reserve it for level/progression bars. */
  tone?: "emerald" | "lavender" | "flow" | "warn";
  height?: number;
  showValue?: boolean;
  label?: string;
  caption?: string;
  style?: React.CSSProperties;
}
export declare function ProgressBar(props: ProgressBarProps): JSX.Element;
