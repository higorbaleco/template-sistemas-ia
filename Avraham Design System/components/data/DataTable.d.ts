import * as React from "react";

/** Hairline-ruled table for contacts, organisations, instances, invoices and users. */
export interface DataTableColumn {
  key: string;
  label: string;
  width?: number | string;
  align?: "left" | "right" | "center";
  /** Render the cell in the tabular mono face — use for counts, money, dates. */
  mono?: boolean;
  render?: (row: any) => React.ReactNode;
}
export interface DataTableProps {
  columns: DataTableColumn[];
  rows: any[];
  onRowClick?: (row: any) => void;
  dense?: boolean;
  style?: React.CSSProperties;
}
export declare function DataTable(props: DataTableProps): JSX.Element;
