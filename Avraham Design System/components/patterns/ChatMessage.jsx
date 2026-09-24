import React from "react";
import { Icon } from "../core/Icon.jsx";

export function ChatMessage({ children, from = "contact", author, time, status = "read", agent = false, style }) {
  const mine = from === "agent";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: mine ? "flex-end" : "flex-start", gap: 5, ...style }}>
      <div style={{ maxWidth: "78%", padding: "12px 15px", fontSize: 14, lineHeight: 1.5,
        background: mine ? "var(--surface-emerald)" : "var(--surface-card)",
        border: `1px solid ${mine ? "var(--border-accent)" : "var(--border-subtle)"}`,
        color: "var(--text-strong)",
        borderRadius: mine ? "18px 18px 6px 18px" : "18px 18px 18px 6px" }}>
        {agent ? (
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, marginBottom: 6,
            fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-accent)" }}>
            <Icon name="bot" size={12} />IA
          </span>
        ) : null}
        <div>{children}</div>
      </div>
      <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--text-muted)" }}>
        {author ? <span style={{ fontWeight: 600 }}>{author}</span> : null}
        {time ? <span style={{ fontFamily: "var(--font-data)" }}>{time}</span> : null}
        {mine && status ? <Icon name={status === "read" ? "check-check" : "check"} size={13}
          color={status === "read" ? "var(--emerald-500)" : "var(--text-muted)"} /> : null}
      </span>
    </div>
  );
}
