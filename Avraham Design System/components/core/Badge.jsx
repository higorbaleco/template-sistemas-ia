import React from "react";
import { Icon } from "./Icon.jsx";

const TONES = {
  live:    { bg: "var(--surface-emerald)", fg: "var(--emerald-700)", dot: "var(--status-live)", bd: "var(--border-accent)" },
  info:    { bg: "var(--surface-lavender)", fg: "var(--lavender-700)", dot: "var(--status-info)", bd: "var(--border-accent-alt)" },
  warn:    { bg: "rgba(232,161,58,.14)", fg: "var(--amber)", dot: "var(--status-warn)", bd: "rgba(232,161,58,.34)" },
  danger:  { bg: "var(--surface-coral)", fg: "var(--coral)", dot: "var(--status-danger)", bd: "rgba(240,85,91,.34)" },
  neutral: { bg: "var(--surface-sunken)", fg: "var(--text-body)", dot: "var(--status-neutral)", bd: "var(--border-subtle)" },
  solid:   { bg: "var(--emerald-500)", fg: "#fff", dot: "#fff", bd: "transparent" },
};

export function Badge({ children, tone = "neutral", dot = false, pulse = false, icon, uppercase = true, style }) {
  const t = TONES[tone] || TONES.neutral;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "5px 12px",
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`, borderRadius: "var(--radius-pill)",
      fontSize: 11, fontWeight: "var(--weight-bold)",
      letterSpacing: uppercase ? "var(--text-eyebrow-ls)" : "0.01em",
      textTransform: uppercase ? "uppercase" : "none", whiteSpace: "nowrap", ...style }}>
      {dot ? <span style={{ width: 6, height: 6, borderRadius: "50%", background: t.dot, animation: pulse ? "var(--pulse-live)" : undefined }} /> : null}
      {icon ? <Icon name={icon} size={13} /> : null}
      {children}
    </span>
  );
}
