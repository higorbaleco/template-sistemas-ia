import * as React from "react";

/** Native select in brand chrome — used for pipeline, owner, period and role pickers. */
export interface SelectProps {
  label?: string;
  options: Array<string | { value: string; label: string }>;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  fullWidth?: boolean;
  style?: React.CSSProperties;
}
export declare function Select(props: SelectProps): JSX.Element;
