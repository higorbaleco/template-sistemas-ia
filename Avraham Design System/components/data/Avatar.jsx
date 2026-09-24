import React from "react";

export function Avatar({ name = "", src, size = 36, tone = "emerald", status, style }) {
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map(w => w[0]).join("").toUpperCase();
  const tones = {
    emerald: { bg: "var(--emerald-100)", fg: "var(--emerald-700)" },
    lavender: { bg: "var(--lavender-100)", fg: "var(--lavender-700)" },
    neutral: { bg: "var(--surface-sunken)", fg: "var(--text-body)" },
  };
  const t = tones[tone] || tones.emerald;
  const statusColor = { online: "var(--status-live)", busy: "var(--status-warn)", offline: "var(--neutral-400)" }[status];
  return (
    <span style={{ position: "relative", display: "inline-flex", flex: "0 0 auto", ...style }}>
      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: size, height: size,
        borderRadius: "50%", background: src ? `center/cover url(${src})` : t.bg, color: t.fg,
        fontSize: size * 0.36, fontWeight: "var(--weight-bold)", letterSpacing: "0.01em" }}>
        {src ? null : initials}
      </span>
      {statusColor ? <span style={{ position: "absolute", right: -1, bottom: -1, width: size * 0.28, height: size * 0.28,
        borderRadius: "50%", background: statusColor, border: "2px solid var(--surface-card)" }} /> : null}
    </span>
  );
}

export function AvatarGroup({ people = [], size = 32, max = 4, style }) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", ...style }}>
      {shown.map((p, i) => (
        <span key={i} style={{ marginLeft: i ? -10 : 0, border: "2px solid var(--surface-card)", borderRadius: "50%", display: "inline-flex" }}>
          <Avatar name={p.name} src={p.src} size={size} tone={i % 2 ? "lavender" : "emerald"} />
        </span>
      ))}
      {rest > 0 ? <span style={{ marginLeft: -10, width: size, height: size, borderRadius: "50%",
        background: "var(--surface-sunken)", border: "2px solid var(--surface-card)", display: "inline-flex",
        alignItems: "center", justifyContent: "center", fontSize: size * 0.34, fontWeight: 700,
        color: "var(--text-muted)" }}>+{rest}</span> : null}
    </span>
  );
}
