import React from "react";
import { Avatar } from "../data/Avatar.jsx";
import { Badge } from "../core/Badge.jsx";
import { Icon } from "../core/Icon.jsx";

export function KanbanCard({ title, company, value, score, owner, tags = [], channel = "WhatsApp", age, onClick, style }) {
  const [hover, setHover] = React.useState(false);
  const scoreTone = score >= 75 ? "live" : score >= 45 ? "warn" : "danger";
  return (
    <div onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: "flex", flexDirection: "column", gap: 12, padding: 16, background: "var(--surface-card)",
        border: `1px solid ${hover ? "var(--border-accent)" : "var(--border-subtle)"}`,
        borderRadius: "var(--radius-lg)", boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
        cursor: onClick ? "pointer" : "default", transition: "var(--transition-control)", ...style }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 10 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: "var(--weight-bold)", color: "var(--text-strong)" }}>{title}</div>
          {company ? <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{company}</div> : null}
        </div>
        {score != null ? <Badge tone={scoreTone} uppercase={false}>{score}</Badge> : null}
      </div>
      {value ? <div style={{ fontFamily: "var(--font-data)", fontSize: 17, fontWeight: 600,
        color: "var(--text-strong)", letterSpacing: "-0.01em" }}>{value}</div> : null}
      {tags.length ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {tags.map(t => <Badge key={t} tone="neutral" uppercase={false} style={{ fontSize: 10, padding: "3px 9px" }}>{t}</Badge>)}
        </div>
      ) : null}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
        paddingTop: 10, borderTop: "1px solid var(--border-subtle)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11, color: "var(--text-muted)" }}>
          <Icon name="message-circle" size={13} color="var(--whatsapp)" />{channel}
          {age ? <span style={{ fontFamily: "var(--font-data)" }}>· {age}</span> : null}
        </span>
        {owner ? <Avatar name={owner} size={24} /> : null}
      </div>
    </div>
  );
}
