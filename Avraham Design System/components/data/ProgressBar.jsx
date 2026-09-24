import React from "react";

export function ProgressBar({ value = 0, max = 100, tone = "emerald", height = 8, showValue = false, label, caption, style }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const fills = { emerald: "var(--emerald-500)", lavender: "var(--lavender-500)", flow: "var(--gradient-flow)", warn: "var(--status-warn)" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, minWidth: 0, ...style }}>
      {label || showValue ? (
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12 }}>
          {label ? <span style={{ fontSize: 13, fontWeight: "var(--weight-semibold)", color: "var(--text-body)" }}>{label}</span> : null}
          {showValue ? <span style={{ fontFamily: "var(--font-data)", fontSize: 12, color: "var(--text-muted)" }}>{value}/{max}</span> : null}
        </div>
      ) : null}
      <div style={{ height, background: "var(--surface-sunken)", borderRadius: "var(--radius-pill)", overflow: "hidden" }}>
        <div style={{ width: pct + "%", height: "100%", background: fills[tone] || fills.emerald,
          borderRadius: "var(--radius-pill)", transition: "width var(--dur-slow) var(--ease-out-soft)" }} />
      </div>
      {caption ? <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{caption}</span> : null}
    </div>
  );
}
