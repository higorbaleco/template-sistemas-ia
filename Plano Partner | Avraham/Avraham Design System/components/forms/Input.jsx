import React from "react";
import { Icon } from "../core/Icon.jsx";

export function Input({ label, placeholder, value, onChange, icon, type = "text", hint, error, disabled, fullWidth = true, style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7, width: fullWidth ? "100%" : undefined, ...style }}>
      {label ? <span style={{ fontSize: "var(--text-label-size)", fontWeight: "var(--text-label-weight)", color: "var(--text-body)" }}>{label}</span> : null}
      <span style={{ display: "flex", alignItems: "center", gap: 10, height: "var(--control-h)", padding: "0 14px",
        background: disabled ? "var(--surface-sunken)" : "var(--surface-card)",
        border: `1px solid ${error ? "var(--status-danger)" : focus ? "var(--emerald-500)" : "var(--border-subtle)"}`,
        borderRadius: "var(--radius-md)", boxShadow: focus ? "var(--glow-focus)" : "none",
        transition: "var(--transition-control)" }}>
        {icon ? <Icon name={icon} size={17} color="var(--text-muted)" /> : null}
        <input type={type} value={value} placeholder={placeholder} disabled={disabled}
          onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent",
            font: "inherit", fontSize: 14, color: "var(--text-strong)" }} />
      </span>
      {error || hint ? <span style={{ fontSize: 12, color: error ? "var(--status-danger)" : "var(--text-muted)" }}>{error || hint}</span> : null}
    </label>
  );
}
