/** Emoji icons for default trip tiles (minimal, no icon library). */
const TILE_ICONS: Record<string, string> = {
  Destination: "📍",
  Dates: "📅",
  Accommodation: "🏨",
  Activities: "🎯",
  Itinerary: "🗺️",
  Transport: "✈️",
};

export function getTileIcon(label: string): string {
  return TILE_ICONS[label] ?? "🧳";
}
