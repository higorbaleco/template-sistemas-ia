import React from "react";

export function DataTable({ columns = [], rows = [], onRowClick, dense = false, style }) {
  const [hover, setHover] = React.useState(-1);
  const pad = dense ? "10px 14px" : "15px 18px";
  return (
    <div style={{ width: "100%", overflowX: "auto", ...style }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
        <thead>
          <tr>
            {columns.map(c => (
              <th key={c.key} style={{ textAlign: c.align || "left", padding: pad, whiteSpace: "nowrap",
                fontSize: 11, fontWeight: "var(--weight-bold)", letterSpacing: "var(--text-eyebrow-ls)",
                textTransform: "uppercase", color: "var(--text-muted)",
                borderBottom: "1px solid var(--border-subtle)", width: c.width }}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id || i}
              onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(-1)}
              onClick={() => onRowClick && onRowClick(r)}
              style={{ background: hover === i ? "var(--surface-sunken)" : "transparent",
                cursor: onRowClick ? "pointer" : "default", transition: "background var(--dur-fast) var(--ease-standard)" }}>
              {columns.map(c => (
                <td key={c.key} style={{ padding: pad, textAlign: c.align || "left", color: "var(--text-body)",
                  borderBottom: "1px solid var(--border-subtle)", verticalAlign: "middle",
                  fontFamily: c.mono ? "var(--font-data)" : "inherit",
                  fontVariantNumeric: c.mono ? "tabular-nums" : undefined }}>
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
