import React from "react";
import { Icon } from "../core/Icon.jsx";

export function SidebarNav({ items = [], value, onChange, collapsed = false, header, footer, style }) {
  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 4,
      width: collapsed ? "var(--sidebar-w-collapsed)" : "var(--sidebar-w)",
      padding: collapsed ? "16px 12px" : "16px", background: "var(--surface-card)",
      borderRight: "1px solid var(--border-subtle)", height: "100%", boxSizing: "border-box",
      transition: "width var(--dur-base) var(--ease-standard)", overflow: "hidden", ...style }}>
      {header}
      {items.map(it => {
        if (it.section) return collapsed ? <span key={it.section} style={{ height: 12 }} /> : (
          <span key={it.section} style={{ padding: "16px 10px 6px", fontSize: 10, fontWeight: 700,
            letterSpacing: "var(--text-eyebrow-ls)", textTransform: "uppercase", color: "var(--text-muted)" }}>{it.section}</span>
        );
        const on = it.value === value;
        return (
          <button key={it.value} type="button" onClick={() => onChange && onChange(it.value)} title={it.label}
            style={{ display: "flex", alignItems: "center", gap: 11, height: 42,
              padding: collapsed ? 0 : "0 12px", justifyContent: collapsed ? "center" : "flex-start",
              border: "none", borderRadius: "var(--radius-md)", cursor: "pointer", width: "100%",
              background: on ? "var(--surface-emerald)" : "transparent",
              color: on ? "var(--text-accent)" : "var(--text-body)",
              fontSize: 14, fontWeight: on ? "var(--weight-bold)" : "var(--weight-medium)",
              transition: "var(--transition-control)", textAlign: "left" }}>
            <Icon name={it.icon} size={18} />
            {collapsed ? null : <span style={{ flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</span>}
            {!collapsed && it.count != null ? (
              <span style={{ fontFamily: "var(--font-data)", fontSize: 11, fontWeight: 600, padding: "2px 7px",
                borderRadius: 999, background: on ? "var(--emerald-500)" : "var(--surface-sunken)",
                color: on ? "#fff" : "var(--text-muted)" }}>{it.count}</span>
            ) : null}
          </button>
        );
      })}
      <div style={{ marginTop: "auto" }}>{footer}</div>
    </nav>
  );
}
