import React from "react";
import { Icon } from "./Icon.jsx";

export function IconButton({ icon, label, size = 40, variant = "ghost", active = false, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const skins = {
    ghost: { background: hover || active ? "var(--action-secondary-bg)" : "transparent", color: active ? "var(--text-accent)" : "var(--action-ghost-fg)", border: "1px solid transparent" },
    outline: { background: hover ? "var(--action-secondary-bg)" : "var(--surface-card)", color: "var(--text-body)", border: "1px solid var(--border-subtle)" },
    solid: { background: hover ? "var(--action-primary-bg-hover)" : "var(--action-primary-bg)", color: "#fff", border: "1px solid transparent" },
  };
  return (
    <button type="button" onClick={onClick} aria-label={label} title={label}
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size,
        borderRadius: "var(--radius-pill)", cursor: "pointer", transition: "var(--transition-control)", ...skins[variant], ...style }}>
      <Icon name={icon} size={Math.round(size * 0.45)} />
    </button>
  );
}
