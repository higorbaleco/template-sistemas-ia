import * as React from "react";

/** Rounded-square icon holder that opens every solution / phase card. */
export interface IconTileProps {
  icon: string;
  tone?: "emerald" | "lavender" | "neutral";
  /** Box size in px — 56 on marketing cards, 40 in dense CRM lists. */
  size?: number;
  style?: React.CSSProperties;
}
export declare function IconTile(props: IconTileProps): JSX.Element;
