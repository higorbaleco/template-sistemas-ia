import * as React from "react";

/**
 * Product/solution tile: icon tile, title, one-line promise, emerald "Explore" affordance.
 * @startingPoint section="Patterns" subtitle="Solution grid tile with icon and CTA" viewport="700x300"
 */
export interface SolutionCardProps {
  icon: string;
  title: string;
  body: string;
  /** Optional "Para quem:" clarifier line. */
  meta?: React.ReactNode;
  cta?: string | null;
  tone?: "emerald" | "lavender" | "neutral";
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function SolutionCard(props: SolutionCardProps): JSX.Element;
