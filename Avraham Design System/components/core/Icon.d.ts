import * as React from "react";

/** Lucide glyph, the icon set used across every Avraham surface. */
export interface IconProps {
  /** Lucide icon name in kebab-case, e.g. "bot", "send", "server", "shield-check". */
  name: string;
  /** Square size in px. 16 inline, 20 default, 24 in icon tiles. */
  size?: number;
  strokeWidth?: number;
  color?: string;
  style?: React.CSSProperties;
}
export declare function Icon(props: IconProps): JSX.Element;
