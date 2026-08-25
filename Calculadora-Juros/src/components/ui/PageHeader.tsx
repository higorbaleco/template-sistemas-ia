import type { ReactNode } from "react";

type PageHeaderProps = {
  kicker: string;
  title: string;
  description: string;
  chips?: string[];
  action?: ReactNode;
};

export function PageHeader({ kicker, title, description, chips = [], action }: PageHeaderProps) {
  return (
    <section className="page-header">
      <div className="page-header__eyebrow">{kicker}</div>
      <div className="page-header__row">
        <div className="page-header__copy">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {action ? <div className="page-header__action">{action}</div> : null}
      </div>
      {chips.length > 0 ? (
        <div className="page-header__chips" aria-label="Destaques da tela">
          {chips.map((chip) => (
            <span key={chip} className="page-chip">
              {chip}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

