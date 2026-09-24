import React from "react";

/* The site's soft claim chip: emerald dot + sentence-case statement. */
export function Pill({ children, tone = "emerald", style }) {
  const tones = {
    emerald: { bg: "var(--surface-emerald)", fg: "var(--emerald-700)", dot: "var(--emerald-500)" },
    neutral: { bg: "var(--surface-sunken)", fg: "var(--text-body)", dot: "var(--neutral-400)" },
    lavender: { bg: "var(--surface-lavender)", fg: "var(--lavender-700)", dot: "var(--lavender-500)" },
  };
  const t = tones[tone] || tones.emerald;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 20px",
      background: t.bg, color: t.fg, borderRadius: "var(--radius-pill)", fontSize: 15,
      fontWeight: "var(--weight-semibold)", lineHeight: 1.3, ...style }}>
      <span style={{ width: 7, height: 7, borderRadius: "50%", background: t.dot, flex: "0 0 auto" }} />
      {children}
    </span>
  );
}
