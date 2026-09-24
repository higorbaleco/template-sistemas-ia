import * as React from "react";

/** Numbered phase/layer card — "01 Diagnóstico", "02 Implantação em 3 Camadas". */
export interface NumberedCardProps {
  /** Zero-padded string: "01". */
  number: string;
  icon: string;
  title: string;
  body?: string;
  bullets?: string[];
  tone?: "emerald" | "lavender" | "neutral";
  style?: React.CSSProperties;
}
export declare function NumberedCard(props: NumberedCardProps): JSX.Element;
