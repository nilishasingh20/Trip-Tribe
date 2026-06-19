import { PageHeader } from "@/components/layout/PageHeader";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import {
  ensureDefaultTiles,
  getOption,
  getOptionsForTile,
  getTripTribe,
  getUser,
  type Tile,
} from "@/lib/store";
import { getTileIcon } from "@/lib/tile-icons";
import {
  tileCardClasses,
  tileStatusBadgeClasses,
  tileStatusHint,
  tileStatusLabel,
} from "@/lib/tile-status-ui";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type TripPageProps = {
  params: Promise<{ tripId: string }>;
};

function tileSubtitle(tile: Tile): string {
  const optionCount = getOptionsForTile(tile.id).length;

  if (tile.status === "locked" && tile.lockedOptionId) {
    const winner = getOption(tile.lockedOptionId);
    if (winner) return `Decided: ${winner.title}`;
  }

  if (optionCount === 0) {
    return tileStatusHint[tile.status];
  }

  const countLabel = `${optionCount} option${optionCount === 1 ? "" : "s"}`;
  if (tile.status === "voting") return `${countLabel} · open for votes`;
  if (tile.status === "locked") return countLabel;
  return countLabel;
}

export default async function TripPage({ params }: TripPageProps) {
  const { tripId } = await params;
  const trip = getTripTribe(tripId);
  if (!trip) {
    notFound();
  }

  const tiles = ensureDefaultTiles(tripId);
  const lockedCount = tiles.filter((t) => t.status === "locked").length;
  const progressPct = Math.round((lockedCount / tiles.length) * 100);

  const members = trip.memberUserIds
    .map((id) => getUser(id))
    .filter(Boolean);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <PageHeader
        breadcrumbs={
          <Link href="/" className="hover:text-ocean-700">
            Home
          </Link>
        }
        title={trip.name}
        description="Tap a tile to add ideas, vote with your group, and lock the final choice."
        actions={
          members.length > 0 ? (
            <div className="flex items-center gap-1">
              {members.slice(0, 4).map((m) => (
                <Avatar key={m!.id} name={m!.name} />
              ))}
              {members.length > 4 ? (
                <span className="ml-1 text-xs font-medium text-stone-500">
                  +{members.length - 4}
                </span>
              ) : null}
            </div>
          ) : null
        }
      />

      <div className="mb-8 rounded-2xl border border-stone-200/80 bg-white p-4 shadow-card sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-stone-900">Trip progress</p>
            <p className="mt-0.5 text-sm text-stone-500">
              {lockedCount} of {tiles.length} decisions locked
            </p>
          </div>
          <p className="text-2xl font-bold tabular-nums text-ocean-700">
            {progressPct}%
          </p>
        </div>
        <div
          className="mt-3 h-2 overflow-hidden rounded-full bg-stone-100"
          role="progressbar"
          aria-valuenow={lockedCount}
          aria-valuemin={0}
          aria-valuemax={tiles.length}
          aria-label="Decisions locked"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-ocean-500 to-ocean-600 transition-all"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {tiles.map((tile) => (
          <li key={tile.id}>
            <Link
              href={`/trip/${tripId}/tile/${tile.id}`}
              className={`group block rounded-2xl p-4 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover sm:p-5 ${tileCardClasses(tile.status)}`}
            >
              <div className="flex items-start gap-3">
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/80 text-xl shadow-sm ring-1 ring-stone-200/60"
                  aria-hidden
                >
                  {getTileIcon(tile.label)}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-semibold text-stone-900 group-hover:text-ocean-800">
                      {tile.label}
                    </h2>
                    <Badge className={tileStatusBadgeClasses(tile.status)}>
                      {tileStatusLabel[tile.status]}
                    </Badge>
                  </div>
                  <p className="mt-1.5 text-sm text-stone-600">{tileSubtitle(tile)}</p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
