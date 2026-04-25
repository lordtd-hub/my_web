import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageShell({
  eyebrow,
  title,
  description,
  children,
}: PageShellProps) {
  return (
    <section className="page-shell mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <div className="page-intro max-w-3xl">
        <p className="section-eyebrow">{eyebrow}</p>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-ink sm:text-5xl">
          {title}
        </h1>
        <p className="mt-5 text-lg leading-8 text-ink/70">{description}</p>
      </div>
      {children ? <div className="mt-10">{children}</div> : null}
    </section>
  );
}
