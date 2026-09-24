import * as React from "react";

/**
 * Pill action button. Primary emerald is the only high-emphasis action on a view.
 * @startingPoint section="Core" subtitle="Pill buttons in every brand variant" viewport="700x150"
 */
export interface ButtonProps {
  children: React.ReactNode;
  /** primary = emerald CTA; secondary = neutral pill; outline = emerald hairline; ghost = bare; danger = destructive. */
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  /** Lucide name rendered before the label. */
  icon?: string;
  /** Lucide name rendered after the label. Defaults to "arrow-right"; pass null to drop it. */
  iconRight?: string | null;
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
