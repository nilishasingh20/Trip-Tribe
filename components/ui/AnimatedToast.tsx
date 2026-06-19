"use client";

import { getToastMessage } from "@/lib/toast-messages";
import { useEffect, useState } from "react";

type AnimatedToastProps = {
  toastKey?: string;
  variant?: "default" | "success" | "celebrate";
  dismissMs?: number;
};

const variantClasses = {
  default: "border-ocean-200 bg-ocean-50 text-ocean-900",
  success: "border-emerald-200 bg-emerald-50 text-emerald-900",
  celebrate: "border-emerald-200 bg-emerald-50 text-emerald-900",
};

export function AnimatedToast({
  toastKey,
  variant = "default",
  dismissMs = 4500,
}: AnimatedToastProps) {
  const [visible, setVisible] = useState(Boolean(toastKey));
  const message = getToastMessage(toastKey);

  useEffect(() => {
    if (!toastKey) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = window.setTimeout(() => setVisible(false), dismissMs);
    return () => window.clearTimeout(timer);
  }, [toastKey, dismissMs]);

  if (!message || !visible) return null;

  const resolvedVariant =
    toastKey === "locked" || toastKey === "joined" || toastKey === "created"
      ? "celebrate"
      : variant;

  return (
    <div
      role="status"
      className={`animate-toast-in mb-6 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium shadow-sm transition-opacity duration-300 ${variantClasses[resolvedVariant]}`}
    >
      {(toastKey === "locked" || toastKey === "created" || toastKey === "joined") && (
        <span aria-hidden className="text-base">
          ✨
        </span>
      )}
      {message}
    </div>
  );
}
