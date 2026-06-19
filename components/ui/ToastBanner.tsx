const TOAST_MESSAGES: Record<string, string> = {
  vote: "Your vote was saved.",
  option: "Option added — let the group decide!",
  date: "Date added to the poll.",
  locked: "Decision locked. You're one step closer!",
};

type ToastBannerProps = {
  toastKey?: string;
};

export function ToastBanner({ toastKey }: ToastBannerProps) {
  if (!toastKey) return null;
  const message = TOAST_MESSAGES[toastKey];
  if (!message) return null;

  return (
    <div
      role="status"
      className="mb-6 rounded-xl border border-ocean-200 bg-ocean-50 px-4 py-3 text-sm font-medium text-ocean-900 shadow-sm"
    >
      {message}
    </div>
  );
}
