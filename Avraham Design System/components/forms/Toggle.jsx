import React from "react";

export function Toggle({ checked = false, onChange, label, description, disabled, style }) {
  return (
    <label style={{ display: "flex", alignItems: description ? "flex-start" : "center", gap: 12,
      cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .5 : 1, ...style }}>
      <span onClick={() => !disabled && onChange && onChange(!checked)}
        style={{ width: 42, height: 24, borderRadius: "var(--radius-pill)", flex: "0 0 auto",
          background: checked ? "var(--emerald-500)" : "var(--neutral-300)", position: "relative",
          transition: "background var(--dur-base) var(--ease-standard)", marginTop: description ? 2 : 0 }}>
        <span style={{ position: "absolute", top: 3, left: checked ? 21 : 3, width: 18, height: 18,
          borderRadius: "50%", background: "#fff", boxShadow: "var(--shadow-xs)",
          transition: "left var(--dur-base) var(--ease-out-soft)" }} />
      </span>
      {label || description ? (
        <span style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {label ? <span style={{ fontSize: 14, fontWeight: "var(--weight-semibold)", color: "var(--text-strong)" }}>{label}</span> : null}
          {description ? <span style={{ fontSize: 13, color: "var(--text-muted)" }}>{description}</span> : null}
        </span>
      ) : null}
    </label>
  );
}
