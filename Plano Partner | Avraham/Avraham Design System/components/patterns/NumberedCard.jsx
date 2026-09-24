import React from "react";
import { IconTile } from "../core/IconTile.jsx";
import { Icon } from "../core/Icon.jsx";

export function NumberedCard({ number, icon, title, body, bullets = [], tone = "emerald", style }) {
  return (
    <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16,
      padding: "var(--card-pad)", background: "var(--surface-card)", border: "1px solid var(--border-subtle)",
      borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-sm)", ...style }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
        <IconTile icon={icon} tone={tone} size={48} />
        <span style={{ fontFamily: "var(--font-display)", fontSize: 34, fontWeight: "var(--weight-extrabold)",
          letterSpacing: "-0.03em", color: "var(--border-strong)", lineHeight: 1 }}>{number}</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <h3 style={{ fontSize: "var(--text-h4-size)", fontWeight: "var(--text-h4-weight)" }}>{title}</h3>
        {body ? <p style={{ fontSize: 15, lineHeight: 1.58, color: "var(--text-muted)" }}>{body}</p> : null}
      </div>
      {bullets.length ? (
        <ul style={{ display: "flex", flexDirection: "column", gap: 8, margin: 0, padding: 0, listStyle: "none" }}>
          {bullets.map((b, i) => (
            <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, fontSize: 14, color: "var(--text-body)" }}>
              <span style={{ marginTop: 6, width: 6, height: 6, borderRadius: "50%", flex: "0 0 auto",
                background: tone === "lavender" ? "var(--lavender-500)" : "var(--emerald-500)" }} />
              {b}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
