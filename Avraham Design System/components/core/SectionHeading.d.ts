import * as React from "react";

/** Eyebrow + H2 + lead: the opening block of every marketing section. */
export interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  /** Trailing words rendered in emerald — the brand's one colour-in-headline move. */
  accent?: string;
  lead?: string;
  align?: "left" | "center";
  maxWidth?: number | string;
  style?: React.CSSProperties;
}
export declare function SectionHeading(props: SectionHeadingProps): JSX.Element;
