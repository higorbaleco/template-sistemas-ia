import * as React from "react";

/** Switch for permissions, notification and automation settings. */
export interface ToggleProps {
  checked?: boolean;
  onChange?: (next: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  style?: React.CSSProperties;
}
export declare function Toggle(props: ToggleProps): JSX.Element;
