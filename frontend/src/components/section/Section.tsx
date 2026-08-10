import type { ReactNode } from "react";
import "./Section.css";

interface SectionProps {
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function Section({ title, children, actions }: SectionProps) {
  return (
    <section className="section">
      {(title || actions) && (
        <div className="section__header">
          {title && <h2 className="section__title">{title}</h2>}
          {actions}
        </div>
      )}
      {children}
    </section>
  );
}
