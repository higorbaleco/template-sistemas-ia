import * as React from "react";

/** Uppercase section kicker that sits above every H2 on the site. */
export interface EyebrowProps {
  children: React.ReactNode;
  tone?: "accent" | "muted" | "alt";
  /** Short leading rule, used on centred sections. */
  rule?: boolean;
  style?: React.CSSProperties;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
