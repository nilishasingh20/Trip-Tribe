import Link from "next/link";
import { revalidatePath } from "next/cache";
import {
  canUserLockTile,
  createOption,
  getOption,
  getTile,
  getTileOptionsWithVotes,
  getTripTribe,
  getUser,
  lockTile,
  setVote,
} from "@/lib/store";
import {
  formatDateOptionTitle,
  isDatesTileLabel,
  isYmdInRange,
  maxTripDateLocalYMD,
  parseLocalYMD,
  todayLocalYMD,
} from "@/lib/dates-tile";
import {
  tileStatusBadgeClasses,
  tileStatusLabel,
} from "@/lib/tile-status-ui";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

async function addOption(formData: FormData) {
  "use server";

  const tripId = String(formData.get("tripId") ?? "");
  const tileId = String(formData.get("tileId") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const linkRaw = String(formData.get("link") ?? "").trim();

  const tile = getTile(tileId);
  const trip = getTripTribe(tripId);
  if (!trip || !tile || tile.tripId !== tripId || tile.status === "locked") {
    return;
  }

  if (!title) {
    return;
  }

  const createdByUserId = trip.memberUserIds[0];
  if (!createdByUserId) {
    return;
  }

  createOption({
    tileId,
    title,
    description,
    link: linkRaw ? linkRaw : undefined,
    createdByUserId,
  });

  revalidatePath(`/trip/${tripId}/tile/${tileId}`);
}

async function addDateOption(formData: FormData) {
  "use server";

  const tripId = String(formData.get("tripId") ?? "");
  const tileId = String(formData.get("tileId") ?? "");
  const ymd = String(formData.get("tripDate") ?? "").trim();

  const tile = getTile(tileId);
  const trip = getTripTribe(tripId);
  if (
    !trip ||
    !tile ||
    tile.tripId !== tripId ||
    tile.status === "locked" ||
    !isDatesTileLabel(tile.label)
  ) {
    return;
  }

  const minY = todayLocalYMD();
  const maxY = maxTripDateLocalYMD();
  if (!isYmdInRange(ymd, minY, maxY)) {
    return;
  }

  const d = parseLocalYMD(ymd);
  if (!d) {
    return;
  }

  const createdByUserId = trip.memberUserIds[0];
  if (!createdByUserId) {
    return;
  }

  createOption({
    tileId,
    title: formatDateOptionTitle(d),
    description: `Calendar date: ${ymd}`,
    createdByUserId,
  });

  revalidatePath(`/trip/${tripId}/tile/${tileId}`);
}

async function castVote(formData: FormData) {
  "use server";

  const tripId = String(formData.get("tripId") ?? "");
  const tileId = String(formData.get("tileId") ?? "");
  const optionId = String(formData.get("optionId") ?? "");
  const raw = String(formData.get("value") ?? "").trim();
  const value = raw === "-1" ? (-1 as const) : (1 as const);

  const trip = getTripTribe(tripId);
  const tile = getTile(tileId);
  const option = getOption(optionId);
  if (
    !trip ||
    !tile ||
    tile.status === "locked" ||
    !option ||
    option.tileId !== tileId ||
    tile.tripId !== tripId
  ) {
    return;
  }

  const userId = trip.memberUserIds[0];
  if (!userId || !trip.memberUserIds.includes(userId)) {
    return;
  }

  setVote({ optionId, userId, value });

  revalidatePath(`/trip/${tripId}/tile/${tileId}`);
}

async function lockDecision(formData: FormData) {
  "use server";

  const tripId = String(formData.get("tripId") ?? "");
  const tileId = String(formData.get("tileId") ?? "");

  const trip = getTripTribe(tripId);
  const tile = getTile(tileId);
  if (!trip || !tile || tile.tripId !== tripId) {
    return;
  }

  const userId = trip.memberUserIds[0];
  if (!userId) {
    return;
  }

  const result = lockTile({ tripId, tileId, userId });
  if (result.ok) {
    revalidatePath(`/trip/${tripId}/tile/${tileId}`);
    revalidatePath(`/trip/${tripId}`);
  }
}

type TileDetailPageProps = {
  params: Promise<{ tripId: string; tileId: string }>;
};

export default async function TileDetailPage({ params }: TileDetailPageProps) {
  const { tripId, tileId } = await params;
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

  return (
    <main className="mx-auto max-w-2xl p-8">
      <Link
        href={`/trip/${tripId}`}
        className="text-sm text-neutral-600 hover:text-neutral-900"
      >
        ← Back to trip
      </Link>
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
          {tile.label}
        </h1>
        <span
          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${tileStatusBadgeClasses(tile.status)}`}
        >
          {tileStatusLabel[tile.status]}
        </span>
      </div>

      {isLocked ? (
        <div className="mt-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-950">
          <p className="font-medium">Decision locked</p>
          <p className="mt-1 text-green-900">
            {winnerOption ? (
              <>
                Selected: <strong>{winnerOption.title}</strong>
              </>
            ) : (
              "No options were available; tile is locked with no selection."
            )}
          </p>
        </div>
      ) : null}

      {!isLocked && canLock ? (
        <div className="mt-6">
          <form action={lockDecision}>
            <input type="hidden" name="tripId" value={tripId} />
            <input type="hidden" name="tileId" value={tileId} />
            <button
              type="submit"
              className="rounded-md bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-800"
            >
              Lock Decision
            </button>
          </form>
          <p className="mt-2 text-xs text-neutral-500">
            Picks the highest-scored option and locks this tile. Voting and edits
            will be disabled.
            {trip.captainUserId ? (
              <>
                {" "}
                Only the Trip Captain ({captainName ?? "captain"}) can lock.
              </>
            ) : (
              <> Any trip member can lock.</>
            )}
          </p>
        </div>
      ) : null}

      {!isLocked && !canLock && trip.captainUserId ? (
        <p className="mt-6 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-950">
          Only the Trip Captain can lock this tile.
        </p>
      ) : null}

      {!isLocked ? (
        <section className="mt-8">
          {isDatesTile ? (
            <>
              <h2 className="mb-3 text-sm font-medium text-neutral-700">
                Add a date option
              </h2>
              <p className="mb-3 text-xs text-neutral-500">
                Choose any day from today through two years ahead. Your browser
                date picker opens when you tap the field.
              </p>
              <form action={addDateOption} className="flex max-w-xs flex-col gap-3">
                <input type="hidden" name="tripId" value={tripId} />
                <input type="hidden" name="tileId" value={tileId} />
                <label htmlFor="tripDate" className="text-sm text-neutral-700">
                  Trip date
                </label>
                <input
                  id="tripDate"
                  name="tripDate"
                  type="date"
                  required
                  min={dateMin}
                  max={dateMax}
                  className="rounded border border-neutral-300 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  Add date as option
                </button>
              </form>
            </>
          ) : (
            <>
              <h2 className="mb-3 text-sm font-medium text-neutral-700">
                Add option
              </h2>
              <form action={addOption} className="flex flex-col gap-3">
                <input type="hidden" name="tripId" value={tripId} />
                <input type="hidden" name="tileId" value={tileId} />
                <input
                  name="title"
                  placeholder="Title"
                  required
                  className="rounded border border-neutral-300 px-3 py-2 text-sm"
                />
                <textarea
                  name="description"
                  placeholder="Description"
                  rows={3}
                  className="rounded border border-neutral-300 px-3 py-2 text-sm"
                />
                <input
                  name="link"
                  placeholder="Link (optional)"
                  className="rounded border border-neutral-300 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
                >
                  Add option
                </button>
              </form>
            </>
          )}
        </section>
      ) : (
        <p className="mt-8 text-sm text-neutral-500">
          This tile is locked — you cannot add options or change votes.
        </p>
      )}

      <section className="mt-10">
        <h2 className="mb-3 text-sm font-medium text-neutral-700">
          Options (sorted by score)
        </h2>
        <ul className="space-y-4">
          {summaries.length === 0 ? (
            <p className="text-sm text-neutral-500">No options yet.</p>
          ) : (
            summaries.map(({ option: opt, score, votes }) => {
              const myVote = currentUserId
                ? votes.find((v) => v.userId === currentUserId)
                : undefined;

              return (
                <li
                  key={opt.id}
                  className="rounded-lg border border-neutral-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-neutral-900">{opt.title}</p>
                      {opt.description ? (
                        <p className="mt-1 text-sm text-neutral-600 whitespace-pre-wrap">
                          {opt.description}
                        </p>
                      ) : null}
                      {opt.link ? (
                        <a
                          href={opt.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-sm text-blue-700 hover:underline"
                        >
                          {opt.link}
                        </a>
                      ) : null}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-2">
                      <span className="rounded-md bg-neutral-100 px-2 py-1 text-sm font-semibold tabular-nums text-neutral-900">
                        Score: {score > 0 ? `+${score}` : score}
                      </span>
                      {!isLocked ? (
                        <div className="flex gap-2">
                          <form action={castVote}>
                            <input type="hidden" name="tripId" value={tripId} />
                            <input type="hidden" name="tileId" value={tileId} />
                            <input type="hidden" name="optionId" value={opt.id} />
                            <input type="hidden" name="value" value="1" />
                            <button
                              type="submit"
                              className={`rounded-md border px-2 py-1 text-sm ${
                                myVote?.value === 1
                                  ? "border-green-600 bg-green-50 text-green-900"
                                  : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50"
                              }`}
                            >
                              +1
                            </button>
                          </form>
                          <form action={castVote}>
                            <input type="hidden" name="tripId" value={tripId} />
                            <input type="hidden" name="tileId" value={tileId} />
                            <input type="hidden" name="optionId" value={opt.id} />
                            <input type="hidden" name="value" value="-1" />
                            <button
                              type="submit"
                              className={`rounded-md border px-2 py-1 text-sm ${
                                myVote?.value === -1
                                  ? "border-red-600 bg-red-50 text-red-900"
                                  : "border-neutral-300 bg-white text-neutral-800 hover:bg-neutral-50"
                              }`}
                            >
                              −1
                            </button>
                          </form>
                        </div>
                      ) : (
                        <span className="text-xs text-neutral-400">
                          Voting closed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 border-t border-neutral-100 pt-3">
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      Votes
                    </p>
                    {votes.length === 0 ? (
                      <p className="mt-1 text-sm text-neutral-500">No votes yet.</p>
                    ) : (
                      <ul className="mt-2 space-y-1">
                        {votes.map((v) => {
                          const u = getUser(v.userId);
                          return (
                            <li
                              key={v.id}
                              className="flex justify-between text-sm text-neutral-700"
                            >
                              <span>{u?.name ?? v.userId}</span>
                              <span className="tabular-nums font-medium">
                                {v.value > 0 ? `+${v.value}` : v.value}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>
    </main>
  );
}
