type EmptyStateProps = {
  icon?: string;
  title: string;
  description?: string;
};

export function EmptyState({
  icon = "✨",
  title,
  description,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-stone-50/80 px-6 py-10 text-center">
      <span className="text-3xl" aria-hidden>
        {icon}
      </span>
      <p className="mt-3 font-semibold text-stone-900">{title}</p>
      {description ? (
        <p className="mt-1 text-sm text-stone-500">{description}</p>
      ) : null}
    </div>
  );
}
