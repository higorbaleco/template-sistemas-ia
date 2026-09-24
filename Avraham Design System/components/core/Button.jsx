import React from "react";
import { Icon } from "./Icon.jsx";

const SIZES = {
  sm: { h: "var(--control-h-sm)", px: 16, fs: 13 },
  md: { h: "var(--control-h)", px: 22, fs: 14 },
  lg: { h: 54, px: 30, fs: 16 },
};

export function Button({
  children, variant = "primary", size = "md", icon, iconRight = "arrow-right",
  fullWidth = false, disabled = false, onClick, type = "button", style,
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);
  const s = SIZES[size] || SIZES.md;

  const skins = {
    primary: {
      background: press ? "var(--cyan-700)" : hover ? "var(--cyan-600)" : "var(--cyan-500)",
      color: "var(--action-primary-fg)",
      border: "1px solid transparent",
      boxShadow: hover && !press ? "0 8px 16px rgba(11,188,162,0.24)" : "0 4px 12px rgba(11,188,162,0.12)",
    },
    secondary: {
      background: hover ? "var(--n-100)" : "var(--n-000)",
      color: "var(--t1)",
      border: "1px solid var(--gbo)",
      boxShadow: "none",
    },
    outline: {
      background: hover ? "var(--cyan-050)" : "transparent",
      color: "var(--cyan-700)",
      border: "1px solid var(--cyan-500)",
      boxShadow: "none",
    },
    ghost: {
      background: hover ? "var(--n-050)" : "transparent",
      color: "var(--t2)",
      border: "1px solid transparent",
      boxShadow: "none",
    },
    danger: {
      background: hover ? "#CE3B40" : "var(--coral)",
      color: "#fff",
      border: "1px solid transparent",
      boxShadow: "none",
    },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setPress(false); }}
      onMouseDown={() => setPress(true)}
      onMouseUp={() => setPress(false)}
      style={{
        display: fullWidth ? "flex" : "inline-flex", width: fullWidth ? "100%" : undefined,
        alignItems: "center", justifyContent: "center", gap: 10,
        height: s.h, padding: `0 ${s.px}px`, fontSize: s.fs,
        fontFamily: "var(--font-body)", fontWeight: "var(--weight-bold)",
        letterSpacing: "-0.005em", borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        transform: press && !disabled ? "translateY(1px)" : "none",
        transition: "var(--transition-control)",
        ...skins[variant], ...style,
      }}
    >
      {icon ? <Icon name={icon} size={s.fs + 3} /> : null}
      <span>{children}</span>
      {iconRight && variant !== "ghost" ? <Icon name={iconRight} size={s.fs + 2} /> : null}
    </button>
  );
}
