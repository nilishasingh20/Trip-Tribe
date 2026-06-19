type ButtonVariant = "primary" | "secondary" | "ghost";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-coral-500 text-white shadow-sm hover:bg-coral-600 active:bg-coral-600",
  secondary:
    "border border-stone-200 bg-white text-stone-900 shadow-sm hover:bg-stone-50",
  ghost: "text-stone-600 hover:bg-stone-100 hover:text-stone-900",
};

export function buttonClassName(
  variant: ButtonVariant = "primary",
  className = "",
): string {
  return [
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    variantClasses[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button className={buttonClassName(variant, className)} {...props} />
  );
}
