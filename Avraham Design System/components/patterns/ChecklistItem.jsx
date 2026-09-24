import React from "react";
import { Icon } from "../core/Icon.jsx";

export function ChecklistItem({ children, state = "yes", divider = false, style }) {
  const cfg = {
    yes: { icon: "check", bg: "var(--surface-emerald)", fg: "var(--emerald-600)", bd: "var(--border-accent)" },
    no: { icon: "x", bg: "var(--surface-sunken)", fg: "var(--text-muted)", bd: "var(--border-subtle)" },
  }[state] || {};
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 14, padding: "14px 0",
      borderBottom: divider ? "1px solid var(--border-subtle)" : "none", ...style }}>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 24, height: 24,
        borderRadius: "50%", background: cfg.bg, border: `1px solid ${cfg.bd}`, color: cfg.fg, flex: "0 0 auto", marginTop: 1 }}>
        <Icon name={cfg.icon} size={13} strokeWidth={2.4} />
      </span>
      <span style={{ fontSize: 15, lineHeight: 1.5, color: "var(--text-body)" }}>{children}</span>
    </div>
  );
}
