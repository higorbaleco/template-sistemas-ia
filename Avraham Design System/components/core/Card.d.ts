import * as React from "react";

/**
 * Surface container: 24px radius, hairline border, soft wide shadow.
 * @startingPoint section="Core" subtitle="Card surfaces incl. emerald/lavender tints" viewport="700x260"
 */
export interface CardProps {
  children: React.ReactNode;
  /** plain white, emerald/lavender brand tints, sunken neutral, or dark ops surface. */
  tone?: "plain" | "emerald" | "lavender" | "sunken" | "ops";
  /** 2px green→purple gradient hairline across the top edge. */
  flowTop?: boolean;
  /** Lift + deepen shadow on hover — only for cards that link somewhere. */
  hoverLift?: boolean;
  pad?: string | number;
  style?: React.CSSProperties;
}
export declare function Card(props: CardProps): JSX.Element;
