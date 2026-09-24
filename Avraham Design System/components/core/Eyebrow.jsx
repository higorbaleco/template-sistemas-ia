import React from "react";

export function Eyebrow({ children, tone = "accent", rule = false, style }) {
  const colors = { accent: "var(--text-accent)", muted: "var(--text-muted)", alt: "var(--text-accent-alt)" };
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, color: colors[tone] || colors.accent,
      fontSize: "var(--text-eyebrow-size)", fontWeight: "var(--text-eyebrow-weight)",
      letterSpacing: "var(--text-eyebrow-ls)", textTransform: "uppercase", ...style }}>
      {rule ? <span style={{ width: 28, height: 1, background: "currentColor", opacity: .6 }} /> : null}
      {children}
    </div>
  );
}
