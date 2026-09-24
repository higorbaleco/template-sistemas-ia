import React from "react";
import { Icon } from "../core/Icon.jsx";

export function AchievementBadge({ icon = "award", title, detail, state = "earned", progress, style }) {
  const earned = state === "earned";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 14,
      background: earned ? "var(--gradient-card-emerald)" : "var(--surface-card)",
      border: `1px solid ${earned ? "var(--border-accent)" : "var(--border-subtle)"}`,
      borderRadius: "var(--radius-lg)", opacity: earned ? 1 : .72, ...style }}>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 44, height: 44,
        borderRadius: "var(--radius-md)", flex: "0 0 auto",
        background: earned ? "var(--emerald-500)" : "var(--surface-sunken)",
        color: earned ? "#fff" : "var(--text-muted)",
        boxShadow: earned ? "var(--shadow-emerald-sm)" : "none" }}>
        <Icon name={earned ? icon : "lock"} size={20} />
      </span>
      <span style={{ display: "flex", flexDirection: "column", gap: 3, minWidth: 0 }}>
        <span style={{ fontSize: 14, fontWeight: "var(--weight-bold)", color: "var(--text-strong)" }}>{title}</span>
        <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{detail}</span>
        {!earned && progress != null ? (
          <span style={{ marginTop: 4, height: 5, borderRadius: 999, background: "var(--surface-sunken)", overflow: "hidden" }}>
            <span style={{ display: "block", width: progress + "%", height: "100%", background: "var(--gradient-flow)" }} />
          </span>
        ) : null}
      </span>
    </div>
  );
}
