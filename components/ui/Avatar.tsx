type AvatarProps = {
  name: string;
  className?: string;
  size?: "sm" | "md";
};

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const sizeClasses = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
};

export function Avatar({ name, className = "", size = "md" }: AvatarProps) {
  return (
    <span
      title={name}
      className={`inline-flex items-center justify-center rounded-full bg-ocean-100 font-bold text-ocean-800 ring-2 ring-white ${sizeClasses[size]} ${className}`}
    >
      {initialsFromName(name)}
    </span>
  );
}
