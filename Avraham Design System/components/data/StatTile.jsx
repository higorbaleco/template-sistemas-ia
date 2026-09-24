import React from "react";
import { Icon } from "../core/Icon.jsx";

export function StatTile({ label, value, unit, sub, delta, deltaTone = "up", icon, tone = "plain", style }) {
  const tones = {
    plain: { bg: "var(--surface-card)", bd: "var(--border-subtle)" },
    emerald: { bg: "var(--gradient-card-emerald)", bd: "var(--border-accent)" },
    lavender: { bg: "var(--gradient-card-lavender)", bd: "var(--border-accent-alt)" },
    ops: { bg: "var(--ops-850)", bd: "var(--ops-line)" },
  };
  const t = tones[tone] || tones.plain;
  const dcolor = deltaTone === "up" ? "var(--emerald-600)" : deltaTone === "down" ? "var(--status-danger)" : "var(--text-muted)";
  return (
    <div style={{ background: t.bg, border: `1px solid ${t.bd}`, borderRadius: "var(--radius-lg)",
      padding: 20, display: "flex", flexDirection: "column", gap: 12, minWidth: 0, ...style }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 12, fontWeight: "var(--weight-bold)", letterSpacing: "var(--text-eyebrow-ls)",
          textTransform: "uppercase", color: "var(--text-muted)" }}>{label}</span>
        {icon ? <Icon name={icon} size={16} color="var(--text-muted)" /> : null}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <span className="av-mono" style={{ fontFamily: "var(--font-data)", fontSize: "var(--text-metric-size)",
          lineHeight: "var(--text-metric-lh)", letterSpacing: "var(--text-metric-ls)",
          fontWeight: "var(--text-metric-weight)", color: "var(--text-strong)", fontVariantNumeric: "tabular-nums" }}>{value}</span>
        {unit ? <span style={{ fontSize: 15, fontWeight: "var(--weight-semibold)", color: "var(--text-muted)" }}>{unit}</span> : null}
        {delta ? <span style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 4,
          fontSize: 13, fontWeight: "var(--weight-bold)", color: dcolor }}>
          <Icon name={deltaTone === "down" ? "trending-down" : "trending-up"} size={14} />{delta}</span> : null}
      </div>
      {sub ? <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{sub}</span> : null}
    </div>
  );
}
