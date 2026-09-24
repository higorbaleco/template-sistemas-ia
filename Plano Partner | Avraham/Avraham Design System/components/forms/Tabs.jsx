import React from "react";
import { Icon } from "../core/Icon.jsx";

export function Tabs({ tabs = [], value, onChange, variant = "pill", style }) {
  const active = value ?? (tabs[0] && (tabs[0].value ?? tabs[0]));
  if (variant === "underline") {
    return (
      <div style={{ display: "flex", gap: 26, borderBottom: "1px solid var(--border-subtle)", ...style }}>
        {tabs.map(t => {
          const v = t.value ?? t; const on = v === active;
          return (
            <button key={v} type="button" onClick={() => onChange && onChange(v)}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 0 12px", border: "none",
                background: "none", cursor: "pointer", fontSize: 14, fontWeight: "var(--weight-bold)",
                color: on ? "var(--text-strong)" : "var(--text-muted)",
                boxShadow: on ? "inset 0 -2px 0 var(--emerald-500)" : "none", transition: "var(--transition-control)" }}>
              {t.icon ? <Icon name={t.icon} size={16} /> : null}{t.label ?? t}
            </button>
          );
        })}
      </div>
    );
  }
  return (
    <div style={{ display: "inline-flex", gap: 4, padding: 4, background: "var(--surface-sunken)",
      border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-pill)", ...style }}>
      {tabs.map(t => {
        const v = t.value ?? t; const on = v === active;
        return (
          <button key={v} type="button" onClick={() => onChange && onChange(v)}
            style={{ display: "inline-flex", alignItems: "center", gap: 7, height: 34, padding: "0 16px",
              border: "none", borderRadius: "var(--radius-pill)", cursor: "pointer", fontSize: 13,
              fontWeight: "var(--weight-bold)", background: on ? "var(--surface-card)" : "transparent",
              color: on ? "var(--text-strong)" : "var(--text-muted)",
              boxShadow: on ? "var(--shadow-xs)" : "none", transition: "var(--transition-control)" }}>
            {t.icon ? <Icon name={t.icon} size={15} /> : null}{t.label ?? t}
            {t.count != null ? <span style={{ fontFamily: "var(--font-data)", fontSize: 11, color: "var(--text-muted)" }}>{t.count}</span> : null}
          </button>
        );
      })}
    </div>
  );
}
