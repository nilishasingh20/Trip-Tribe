/** Must match default tile label in `lib/store.ts`. */
export const DATES_TILE_LABEL = "Dates" as const;

export function isDatesTileLabel(label: string): boolean {
  return label === DATES_TILE_LABEL;
}

function toLocalYMD(d: Date): string {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Today in local calendar (for `<input type="date" min>`). */
export function todayLocalYMD(): string {
  return toLocalYMD(new Date());
}

/** Same calendar day, two years later (for `<input type="date" max>`). */
export function maxTripDateLocalYMD(): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + 2);
  return toLocalYMD(d);
}

export function parseLocalYMD(ymd: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd.trim());
  if (!m) return null;
  const y = Number(m[1]);
  const mo = Number(m[2]) - 1;
  const da = Number(m[3]);
  const d = new Date(y, mo, da);
  if (d.getFullYear() !== y || d.getMonth() !== mo || d.getDate() !== da) {
    return null;
  }
  return d;
}

/** `ymd` is within [minYmd, maxYmd] inclusive (lexicographic OK for same YYYY-MM-DD format). */
export function isYmdInRange(
  ymd: string,
  minYmd: string,
  maxYmd: string,
): boolean {
  return ymd >= minYmd && ymd <= maxYmd;
}

export function formatDateOptionTitle(d: Date): string {
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
