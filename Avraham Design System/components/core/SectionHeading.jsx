import React from "react";
import { Eyebrow } from "./Eyebrow.jsx";

export function SectionHeading({ eyebrow, title, lead, align = "left", accent, maxWidth = 820, style }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18, alignItems: align === "center" ? "center" : "flex-start",
      textAlign: align, maxWidth, marginInline: align === "center" ? "auto" : undefined, ...style }}>
      {eyebrow ? <Eyebrow rule={align === "center"}>{eyebrow}</Eyebrow> : null}
      <h2 style={{ fontSize: "var(--text-h2-size)", lineHeight: "var(--text-h2-lh)", letterSpacing: "var(--text-h2-ls)", fontWeight: "var(--text-h2-weight)" }}>
        {title}{accent ? <span style={{ color: "var(--text-accent)" }}> {accent}</span> : null}
      </h2>
      {lead ? <p style={{ fontSize: "var(--text-lead-size)", lineHeight: "var(--text-lead-lh)", color: "var(--text-muted)" }}>{lead}</p> : null}
    </div>
  );
}
