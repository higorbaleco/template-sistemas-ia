import * as React from "react";

/** Soft statement chip used above/below hero headlines and in benefit stacks. */
export interface PillProps {
  children: React.ReactNode;
  tone?: "emerald" | "neutral" | "lavender";
  style?: React.CSSProperties;
}
export declare function Pill(props: PillProps): JSX.Element;
