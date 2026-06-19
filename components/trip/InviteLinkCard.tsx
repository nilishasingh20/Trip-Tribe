"use client";

import { useCallback, useState } from "react";
import { buttonClassName } from "@/components/ui/Button";

type InviteLinkCardProps = {
  inviteUrl: string;
};

export function InviteLinkCard({ inviteUrl }: InviteLinkCardProps) {
  const [copied, setCopied] = useState(false);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  }, [inviteUrl]);

  return (
    <div className="rounded-2xl border border-ocean-200/80 bg-gradient-to-br from-ocean-50/80 to-white p-4 shadow-card sm:p-5">
      <p className="text-sm font-semibold text-stone-900">Invite your crew</p>
      <p className="mt-0.5 text-sm text-stone-500">
        Share this link so friends can join and plan together.
      </p>
      <div className="mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={inviteUrl}
          aria-label="Invite link"
          className="min-w-0 flex-1 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs text-stone-600 shadow-sm sm:text-sm"
          onFocus={(e) => e.target.select()}
        />
        <button
          type="button"
          onClick={copyLink}
          className={buttonClassName(
            copied ? "secondary" : "primary",
            "shrink-0 transition-transform active:scale-95",
          )}
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
