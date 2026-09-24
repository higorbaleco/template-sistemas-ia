import React from "react";
import { IconTile } from "../core/IconTile.jsx";
import { Icon } from "../core/Icon.jsx";

export function SolutionCard({ icon, title, body, meta, cta = "Explore details", tone = "emerald", onClick, style }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", flexDirection: "column", gap: 18, padding: "var(--card-pad)",
        background: "var(--surface-card)", border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)", cursor: onClick ? "pointer" : "default",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-sm)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "box-shadow var(--dur-base) var(--ease-standard),transform var(--dur-base) var(--ease-standard)", ...style }}>
      <IconTile icon={icon} tone={tone} />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <h3 style={{ fontSize: "var(--text-h4-size)", lineHeight: "var(--text-h4-lh)", fontWeight: "var(--text-h4-weight)" }}>{title}</h3>
        <p style={{ fontSize: 15, lineHeight: 1.58, color: "var(--text-muted)" }}>{body}</p>
      </div>
      {meta ? <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{meta}</div> : null}
      {cta ? (
        <span style={{ marginTop: "auto", display: "inline-flex", alignItems: "center", gap: 8,
          color: "var(--text-accent)", fontSize: 14, fontWeight: "var(--weight-bold)" }}>
          {cta}<span style={{ display: "inline-flex", transform: hover ? "translateX(3px)" : "none",
            transition: "transform var(--dur-fast) var(--ease-standard)" }}><Icon name="arrow-right" size={15} /></span>
        </span>
      ) : null}
    </div>
  );
}
