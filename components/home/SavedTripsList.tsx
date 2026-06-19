import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { listTripSummaries } from "@/lib/store";

export function SavedTripsList() {
  const summaries = listTripSummaries();

  if (summaries.length === 0) {
    return (
      <Card className="border-dashed border-stone-300 bg-stone-50/50">
        <p className="text-center text-sm text-stone-500">
          No saved trips yet — create one below to get started.
        </p>
      </Card>
    );
  }

  return (
    <ul className="space-y-3">
      {summaries.map(({ trip, lockedCount, totalTiles }) => {
        const pct =
          totalTiles > 0 ? Math.round((lockedCount / totalTiles) * 100) : 0;

        return (
          <li key={trip.id}>
            <Link
              href={`/trip/${trip.id}`}
              className="group block rounded-2xl border border-stone-200/80 bg-white p-4 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-ocean-200 hover:shadow-card-hover sm:p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-semibold text-stone-900 group-hover:text-ocean-800">
                    {trip.name}
                  </h3>
                  <p className="mt-1 text-sm text-stone-500">
                    {lockedCount} of {totalTiles} decisions locked · {pct}% done
                  </p>
                </div>
                <span className="shrink-0 text-sm font-medium text-ocean-600 group-hover:text-ocean-700">
                  Open board →
                </span>
              </div>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-stone-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-ocean-400 to-ocean-600 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
