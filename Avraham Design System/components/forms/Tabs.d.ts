import * as React from "react";

/** Segmented pill tabs (default) or underlined tabs for in-page sections. */
export interface TabItem { value: string; label: string; icon?: string; count?: number }
export interface TabsProps {
  tabs: Array<string | TabItem>;
  value?: string;
  onChange?: (value: string) => void;
  variant?: "pill" | "underline";
  style?: React.CSSProperties;
}
export declare function Tabs(props: TabsProps): JSX.Element;
