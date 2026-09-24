import * as React from "react";

/** One line of the manual-vs-structured comparison, or a deliverable checklist. */
export interface ChecklistItemProps {
  children: React.ReactNode;
  /** "yes" = emerald check (structured outcome); "no" = grey x (today's pain). */
  state?: "yes" | "no";
  divider?: boolean;
  style?: React.CSSProperties;
}
export declare function ChecklistItem(props: ChecklistItemProps): JSX.Element;
