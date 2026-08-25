import type { ReactNode } from "react";

type SectionCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
  eyebrow?: string;
};

export function SectionCard({ title, subtitle, children, eyebrow }: SectionCardProps) {
  return (
    <section className="section-card">
      <div className="section-card__header">
        <div>
          {eyebrow ? <p className="section-card__eyebrow">{eyebrow}</p> : null}
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
}
