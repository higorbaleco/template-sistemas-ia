import * as React from "react";

/**
 * Deal card for the pipeline board: value, AI score, tags, channel, owner.
 * @startingPoint section="Patterns" subtitle="Pipeline deal card with AI score" viewport="700x260"
 */
export interface KanbanCardProps {
  title: string;
  company?: string;
  /** Pre-formatted currency string, e.g. "R$ 48.000". */
  value?: string;
  /** AI qualification score 0–100; drives the badge colour. */
  score?: number;
  owner?: string;
  tags?: string[];
  channel?: string;
  /** Time in stage, e.g. "3d". */
  age?: string;
  onClick?: () => void;
  style?: React.CSSProperties;
}
export declare function KanbanCard(props: KanbanCardProps): JSX.Element;
