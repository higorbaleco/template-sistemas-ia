import React from "react";
import { Icon } from "./Icon.jsx";

export function IconTile({ icon, tone = "emerald", size = 56, style }) {
  const tones = {
    emerald: { bg: "var(--surface-emerald)", bd: "var(--border-accent)", fg: "var(--emerald-500)" },
    lavender: { bg: "var(--surface-lavender)", bd: "var(--border-accent-alt)", fg: "var(--lavender-500)" },
    neutral: { bg: "var(--surface-sunken)", bd: "var(--border-subtle)", fg: "var(--text-body)" },
  };
  const t = tones[tone] || tones.emerald;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: size, height: size, background: t.bg, border: `1px solid ${t.bd}`,
      borderRadius: "var(--radius-md)", color: t.fg, flex: "0 0 auto", ...style }}>
      <Icon name={icon} size={Math.round(size * 0.4)} />
    </span>
  );
}
