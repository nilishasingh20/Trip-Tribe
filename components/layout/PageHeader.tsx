import type { ReactNode } from "react";

type PageHeaderProps = {
  title: ReactNode;
  description?: string;
  eyebrow?: string;
  breadcrumbs?: React.ReactNode;
  actions?: React.ReactNode;
};

export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumbs,
  actions,
}: PageHeaderProps) {
  return (
    <header className="mb-8">
      {breadcrumbs ? (
        <div className="mb-3 text-sm text-stone-500">{breadcrumbs}</div>
      ) : null}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {eyebrow ? (
              <span className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                <span className="text-ocean-600">{eyebrow}</span>
                <span aria-hidden className="font-normal text-stone-300">
                  ·
                </span>
                <span className="text-stone-900">{title}</span>
              </span>
            ) : (
              <span className="text-stone-900">{title}</span>
            )}
          </h1>
          {description ? (
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-stone-600">
              {description}
            </p>
          ) : null}
        </div>
        {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
