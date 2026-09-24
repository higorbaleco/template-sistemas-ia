import * as React from "react";

/**
 * Text field: 44px tall, 14px radius, emerald focus ring.
 * @startingPoint section="Forms" subtitle="Inputs, select, toggle and tabs" viewport="700x280"
 */
export interface InputProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  /** Leading Lucide glyph, e.g. "search", "mail". */
  icon?: string;
  type?: string;
  hint?: string;
  error?: string;
  disabled?: boolean;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}
export declare function Input(props: InputProps): JSX.Element;
