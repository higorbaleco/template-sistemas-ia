import * as React from "react";

/**
 * Collapsible CRM sidebar. Section rows are labels, not links; the active row carries the emerald tint.
 * @startingPoint section="Patterns" subtitle="Collapsible CRM sidebar navigation" viewport="700x380"
 */
export interface SidebarNavItem {
  value?: string;
  label?: string;
  icon?: string;
  count?: number;
  /** Renders an uppercase group label instead of a nav row. */
  section?: string;
}
export interface SidebarNavProps {
  items: SidebarNavItem[];
  value?: string;
  onChange?: (value: string) => void;
  collapsed?: boolean;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function SidebarNav(props: SidebarNavProps): JSX.Element;
