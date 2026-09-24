import React from "react";

export function Card({ children, tone = "plain", flowTop = false, hoverLift = false, pad = "var(--card-pad)", style }) {
  const [hover, setHover] = React.useState(false);
  const tones = {
    plain: { background: "var(--surface-card)", border: "1px solid var(--border-subtle)" },
    emerald: { background: "var(--gradient-card-emerald)", border: "1px solid var(--border-accent)" },
    lavender: { background: "var(--gradient-card-lavender)", border: "1px solid var(--border-accent-alt)" },
    sunken: { background: "var(--surface-sunken)", border: "1px solid var(--border-subtle)" },
    ops: { background: "var(--ops-850)", border: "1px solid var(--ops-line)" },
  };
  return (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", borderRadius: "var(--radius-xl)", padding: pad, overflow: "hidden",
        boxShadow: hoverLift && hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hoverLift && hover ? "translateY(-2px)" : "none",
        transition: "box-shadow var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-standard)",
        ...tones[tone], ...style }}>
      {flowTop ? <span style={{ position: "absolute", inset: "0 0 auto 0", height: 2, background: "var(--gradient-flow)" }} /> : null}
      {children}
    </div>
  );
}
