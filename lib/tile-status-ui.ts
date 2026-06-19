import type { TileStatus } from "./store";

export const tileStatusLabel: Record<TileStatus, string> = {
  pending: "Needs ideas",
  voting: "Vote now",
  locked: "Decided",
};

export const tileStatusHint: Record<TileStatus, string> = {
  pending: "Add options to get started",
  voting: "Pick your favorites with the group",
  locked: "Choice finalized",
};

/** Left accent + light tint for tile cards on trip home. */
export function tileCardClasses(status: TileStatus): string {
  switch (status) {
    case "pending":
      return "border border-stone-200/80 border-l-4 border-l-rose-400 bg-rose-50/40";
    case "voting":
      return "border border-stone-200/80 border-l-4 border-l-amber-400 bg-amber-50/40";
    case "locked":
      return "border border-stone-200/80 border-l-4 border-l-emerald-500 bg-emerald-50/40 opacity-95";
  }
}

/** Compact pill on cards and detail header. */
export function tileStatusBadgeClasses(status: TileStatus): string {
  switch (status) {
    case "pending":
      return "bg-rose-100 text-rose-800";
    case "voting":
      return "bg-amber-100 text-amber-900";
    case "locked":
      return "bg-emerald-100 text-emerald-800";
  }
}
