import * as React from "react";

/** Gamification award row: earned achievements read emerald, locked ones stay muted with progress. */
export interface AchievementBadgeProps {
  icon?: string;
  title: string;
  /** Plain-language criterion, e.g. "40 leads qualificados em 7 dias". */
  detail: string;
  state?: "earned" | "locked";
  /** 0–100, only rendered when locked. */
  progress?: number;
  style?: React.CSSProperties;
}
export declare function AchievementBadge(props: AchievementBadgeProps): JSX.Element;
