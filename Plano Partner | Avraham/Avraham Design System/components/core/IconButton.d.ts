import * as React from "react";

/** Circular icon-only control: nav chrome, row actions, sidebar collapse, theme toggle. */
export interface IconButtonProps {
  /** Lucide icon name. */
  icon: string;
  /** Accessible label — always required, shown as the tooltip. */
  label: string;
  size?: number;
  variant?: "ghost" | "outline" | "solid";
  active?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}
export declare function IconButton(props: IconButtonProps): JSX.Element;
