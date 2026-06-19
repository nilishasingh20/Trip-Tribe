type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  hover?: boolean;
};

export function Card({
  hover = false,
  className = "",
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-stone-200/80 bg-white p-5 shadow-card",
        hover && "transition-shadow hover:shadow-card-hover",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    >
      {children}
    </div>
  );
}
