import { PageHeader } from "@/components/layout/PageHeader";
import { OptionCard } from "@/components/tile/OptionCard";
import { Badge } from "@/components/ui/Badge";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { AnimatedToast } from "@/components/ui/AnimatedToast";
import {
  addDateOption,
  addOption,
  lockDecision,
} from "@/app/trip/[tripId]/tile/[tileId]/actions";
import { isDatesTileLabel, maxTripDateLocalYMD, todayLocalYMD } from "@/lib/dates-tile";
import { getTileIcon } from "@/lib/tile-icons";
import {
  tileStatusBadgeClasses,
  tileStatusHint,
  tileStatusLabel,
} from "@/lib/tile-status-ui";
import { inputClassName, textareaClassName } from "@/lib/ui-classes";
import {
  canUserLockTile,
  getOption,
  getTile,
  getTileOptionsWithVotes,
  getTripTribe,
  getUser,
} from "@/lib/store";
import Link from "next/link";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

type TileDetailPageProps = {
  params: Promise<{ tripId: string; tileId: string }>;
  searchParams: Promise<{ toast?: string }>;
};

export default async function TileDetailPage({
  params,
  searchParams,
}: TileDetailPageProps) {
  const { tripId, tileId } = await params;
  const { toast } = await searchParams;
  const trip = getTripTribe(tripId);
  const tile = getTile(tileId);
  if (!trip || !tile || tile.tripId !== tripId) {
    notFound();
  }

  const currentUserId = trip.memberUserIds[0];
  const summaries = getTileOptionsWithVotes(tileId);
  const isLocked = tile.status === "locked";
  const canLock = !isLocked && canUserLockTile(trip, currentUserId);
  const winnerOption = tile.lockedOptionId
    ? getOption(tile.lockedOptionId)
    : undefined;

  const captainName = trip.captainUserId
    ? getUser(trip.captainUserId)?.name
    : undefined;

  const isDatesTile = isDatesTileLabel(tile.label);
  const dateMin = todayLocalYMD();
  const dateMax = maxTripDateLocalYMD();
  const leadingOptionId =
    summaries.length > 0 &&
    (summaries[0].score > 0 || summaries[0].votes.length > 0)
      ? summaries[0].option.id
      : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
      <AnimatedToast toastKey={toast} />

      <PageHeader
        breadcrumbs={
          <>
            <Link href="/" className="hover:text-ocean-700">
              Home
            </Link>
            <span className="mx-1.5 text-stone-300">/</span>
            <Link href={`/trip/${tripId}`} className="hover:text-ocean-700">
              Trip board
            </Link>
            <span className="mx-1.5 text-stone-300">·</span>
            <span className="text-stone-600">{trip.name}</span>
          </>
        }
        title={
          <span className="flex flex-wrap items-center gap-2">
            <span aria-hidden className="text-2xl">
              {getTileIcon(tile.label)}
            </span>
            {tile.label}
            <Badge className={tileStatusBadgeClasses(tile.status)}>
              {tileStatusLabel[tile.status]}
            </Badge>
          </span>
        }
        description={
          isLocked
            ? "This decision is final — no more edits or votes."
            : "Add ideas, vote with your crew, then finalize the winning choice."
        }
      />

      {isLocked ? (
        <Card className="mb-8 border-emerald-200 bg-gradient-to-br from-emerald-50 to-white">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Decision locked
              </p>
              <p className="mt-2 text-lg font-bold text-stone-900">
                {winnerOption ? (
                  <>You&apos;re going with: {winnerOption.title}</>
                ) : (
                  "Locked with no option selected."
                )}
              </p>
            </div>
            <span
              aria-hidden
              className={`shrink-0 text-3xl leading-none sm:text-4xl ${
                toast === "locked" ? "animate-celebrate-pop" : ""
              }`}
            >
              🎉
            </span>
          </div>
        </Card>
      ) : null}

      {!isLocked && canLock ? (
        <Card className="mb-8">
          <form action={lockDecision} className="flex flex-wrap items-center gap-4">
            <input type="hidden" name="tripId" value={tripId} />
            <input type="hidden" name="tileId" value={tileId} />
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-stone-900">Ready to finalize?</p>
              <p className="mt-0.5 text-sm text-stone-500">
                Locks the top-voted option.{" "}
                {trip.captainUserId
                  ? `Only the Trip Captain (${captainName ?? "captain"}) can lock.`
                  : "Any trip member can lock."}
              </p>
            </div>
            <button
              type="submit"
              className={buttonClassName(
                "primary",
                "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-700",
              )}
            >
              Finalize choice
            </button>
          </form>
        </Card>
      ) : null}

      {!isLocked && !canLock && trip.captainUserId ? (
        <p className="mb-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          Only the Trip Captain can finalize this tile.
        </p>
      ) : null}

      {!isLocked ? (
        <Card className="mb-10">
          {isDatesTile ? (
            <>
              <h2 className="text-base font-bold text-stone-900">
                Pick a date
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Today through two years out — tap the field to open the calendar.
              </p>
              <form
                action={addDateOption}
                className="mt-5 flex max-w-sm flex-col gap-4"
              >
                <input type="hidden" name="tripId" value={tripId} />
                <input type="hidden" name="tileId" value={tileId} />
                <div>
                  <label
                    htmlFor="tripDate"
                    className="mb-1.5 block text-sm font-medium text-stone-700"
                  >
                    Trip date
                  </label>
                  <input
                    id="tripDate"
                    name="tripDate"
                    type="date"
                    required
                    min={dateMin}
                    max={dateMax}
                    className={inputClassName}
                  />
                </div>
                <button type="submit" className={buttonClassName("primary", "w-fit")}>
                  Add to poll
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-base font-bold text-stone-900">Add an idea</h2>
              <p className="mt-1 text-sm text-stone-500">
                Share a suggestion for the group to vote on.
              </p>
              <form action={addOption} className="mt-5 flex flex-col gap-4">
                <input type="hidden" name="tripId" value={tripId} />
                <input type="hidden" name="tileId" value={tileId} />
                <input
                  name="title"
                  placeholder="Title"
                  required
                  className={inputClassName}
                />
                <textarea
                  name="description"
                  placeholder="Why this option? (optional)"
                  rows={3}
                  className={textareaClassName}
                />
                <input
                  name="link"
                  placeholder="Link — Airbnb, article, etc. (optional)"
                  className={inputClassName}
                />
                <button type="submit" className={buttonClassName("primary", "w-fit")}>
                  Add to poll
                </button>
              </form>
            </>
          )}
        </Card>
      ) : (
        <p className="mb-10 text-sm text-stone-500">
          This tile is locked — no new options or votes.
        </p>
      )}

      <section>
        <h2 className="mb-4 text-base font-bold text-stone-900">
          Group poll
          <span className="ml-2 text-sm font-normal text-stone-500">
            Sorted by score
          </span>
        </h2>

        {summaries.length === 0 ? (
          <EmptyState
            icon={getTileIcon(tile.label)}
            title="No options yet"
            description={tileStatusHint[tile.status]}
          />
        ) : (
          <ul className="space-y-4">
            {summaries.map(({ option, score, votes }) => (
              <li key={option.id}>
                <OptionCard
                  tripId={tripId}
                  tileId={tileId}
                  option={option}
                  score={score}
                  votes={votes}
                  currentUserId={currentUserId}
                  isLocked={isLocked}
                  isLeading={option.id === leadingOptionId}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
