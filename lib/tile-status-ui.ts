import type { TileStatus } from "./store";

export const tileStatusLabel: Record<TileStatus, string> = {
  pending: "Pending",
  voting: "Voting",
  locked: "Locked",
};

/** Left accent + light tint for tile cards on trip home. */
export function tileCardClasses(status: TileStatus): string {
  switch (status) {
    case "pending":
      return "border border-neutral-200 border-l-4 border-l-red-500 bg-red-50/50";
    case "voting":
      return "border border-neutral-200 border-l-4 border-l-amber-400 bg-amber-50/50";
    case "locked":
      return "border border-neutral-200 border-l-4 border-l-green-600 bg-green-50/50";
  }
}

/** Compact pill on cards and detail header. */
export function tileStatusBadgeClasses(status: TileStatus): string {
  switch (status) {
    case "pending":
      return "bg-red-100 text-red-900";
    case "voting":
      return "bg-amber-100 text-amber-900";
    case "locked":
      return "bg-green-100 text-green-900";
  }
}
