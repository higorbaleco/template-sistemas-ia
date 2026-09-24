import React from "react";
import { Icon } from "../core/Icon.jsx";

export function Select({ label, options = [], value, onChange, fullWidth = true, style }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 7, width: fullWidth ? "100%" : undefined, ...style }}>
      {label ? <span style={{ fontSize: "var(--text-label-size)", fontWeight: "var(--text-label-weight)", color: "var(--text-body)" }}>{label}</span> : null}
      <span style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={{ width: "100%", height: "var(--control-h)", padding: "0 38px 0 14px", appearance: "none",
            background: "var(--surface-card)", color: "var(--text-strong)", font: "inherit", fontSize: 14,
            border: `1px solid ${focus ? "var(--emerald-500)" : "var(--border-subtle)"}`,
            borderRadius: "var(--radius-md)", boxShadow: focus ? "var(--glow-focus)" : "none",
            outline: "none", cursor: "pointer", transition: "var(--transition-control)" }}>
          {options.map(o => <option key={o.value ?? o} value={o.value ?? o}>{o.label ?? o}</option>)}
        </select>
        <span style={{ position: "absolute", right: 13, display: "inline-flex", pointerEvents: "none" }}>
          <Icon name="chevron-down" size={17} color="var(--text-muted)" />
        </span>
      </span>
    </label>
  );
}
