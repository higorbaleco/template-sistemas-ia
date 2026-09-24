import * as React from "react";

/**
 * Single KPI readout. Value is set in the mono/tabular face so columns of numbers align.
 * @startingPoint section="Data" subtitle="KPI tiles with delta and status tones" viewport="700x180"
 */
export interface StatTileProps {
  /** Uppercase metric name, e.g. "Conversas". */
  label: string;
  value: string | number;
  unit?: string;
  /** Small clarifier under the number, e.g. "tempo real", "pela IA". */
  sub?: string;
  delta?: string;
  deltaTone?: "up" | "down" | "flat";
  icon?: string;
  tone?: "plain" | "emerald" | "lavender" | "ops";
  style?: React.CSSProperties;
}
export declare function StatTile(props: StatTileProps): JSX.Element;
