import { ensureDefaultTiles, getTripTribe } from "@/lib/store";
import {
  tileCardClasses,
  tileStatusBadgeClasses,
  tileStatusLabel,
} from "@/lib/tile-status-ui";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type TripPageProps = {
  params: Promise<{ tripId: string }>;
};

export default async function TripPage({ params }: TripPageProps) {
  const { tripId } = await params;
  const trip = getTripTribe(tripId);
  if (!trip) {
    notFound();
  }

  const tiles = ensureDefaultTiles(tripId);

  return (
    <main className="mx-auto max-w-3xl p-8">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight text-neutral-900">
        {trip.name}
      </h1>
      <ul className="grid gap-4 sm:grid-cols-2">
        {tiles.map((tile) => (
          <li key={tile.id}>
            <Link
              href={`/trip/${tripId}/tile/${tile.id}`}
              className={`block rounded-lg p-4 shadow-sm transition-opacity hover:opacity-90 ${tileCardClasses(tile.status)}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h2 className="text-base font-medium text-neutral-900">
                  {tile.label}
                </h2>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${tileStatusBadgeClasses(tile.status)}`}
                >
                  {tileStatusLabel[tile.status]}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
