import React from "react";

export function ScoreRing({ value = 0, size = 76, thickness = 7, label, tone, style }) {
  const pct = Math.max(0, Math.min(100, value));
  const color = tone || (pct >= 75 ? "var(--emerald-500)" : pct >= 45 ? "var(--status-warn)" : "var(--status-danger)");
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  return (
    <div style={{ position: "relative", width: size, height: size, flex: "0 0 auto", ...style }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-subtle)" strokeWidth={thickness} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={thickness}
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * pct) / 100}
          style={{ transition: "stroke-dashoffset var(--dur-slow) var(--ease-out-soft)" }} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center", gap: 1 }}>
        <span style={{ fontFamily: "var(--font-data)", fontSize: size * 0.3, fontWeight: 600,
          color: "var(--text-strong)", letterSpacing: "-0.02em" }}>{pct}</span>
        {label ? <span style={{ fontSize: 9, textTransform: "uppercase", letterSpacing: "0.12em",
          color: "var(--text-muted)", fontWeight: 700 }}>{label}</span> : null}
      </div>
    </div>
  );
}
