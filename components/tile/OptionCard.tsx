import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import type { Option, Vote } from "@/lib/store";
import { getUser } from "@/lib/store";
import { castVote } from "@/app/trip/[tripId]/tile/[tileId]/actions";

type VoteButtonsProps = {
  tripId: string;
  tileId: string;
  optionId: string;
  myVote?: Vote;
};

export function VoteButtons({
  tripId,
  tileId,
  optionId,
  myVote,
}: VoteButtonsProps) {
  const upActive = myVote?.value === 1;
  const downActive = myVote?.value === -1;

  const base =
    "flex h-11 min-w-11 items-center justify-center rounded-xl border text-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-offset-2";
  const idle = "border-stone-200 bg-white hover:bg-stone-50";
  const upOn = "border-emerald-500 bg-emerald-50 text-emerald-800";
  const downOn = "border-rose-400 bg-rose-50 text-rose-800";

  return (
    <div className="flex gap-2">
      <form action={castVote}>
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="tileId" value={tileId} />
        <input type="hidden" name="optionId" value={optionId} />
        <input type="hidden" name="value" value="1" />
        <button
          type="submit"
          aria-label="Vote up"
          aria-pressed={upActive}
          className={`${base} ${upActive ? upOn : idle}`}
        >
          👍
        </button>
      </form>
      <form action={castVote}>
        <input type="hidden" name="tripId" value={tripId} />
        <input type="hidden" name="tileId" value={tileId} />
        <input type="hidden" name="optionId" value={optionId} />
        <input type="hidden" name="value" value="-1" />
        <button
          type="submit"
          aria-label="Vote down"
          aria-pressed={downActive}
          className={`${base} ${downActive ? downOn : idle}`}
        >
          👎
        </button>
      </form>
    </div>
  );
}

type OptionCardProps = {
  tripId: string;
  tileId: string;
  option: Option;
  score: number;
  votes: Vote[];
  currentUserId?: string;
  isLocked: boolean;
  isLeading: boolean;
};

export function OptionCard({
  tripId,
  tileId,
  option,
  score,
  votes,
  currentUserId,
  isLocked,
  isLeading,
}: OptionCardProps) {
  const myVote = currentUserId
    ? votes.find((v) => v.userId === currentUserId)
    : undefined;
  const creator = getUser(option.createdByUserId);

  return (
    <Card
      className={
        isLeading
          ? "ring-2 ring-ocean-300 ring-offset-2 ring-offset-stone-50"
          : undefined
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-semibold text-stone-900">{option.title}</h3>
            {isLeading ? (
              <Badge className="bg-ocean-100 text-ocean-800">Leading</Badge>
            ) : null}
          </div>
          {creator ? (
            <p className="mt-1 text-xs text-stone-500">
              Added by {creator.name}
            </p>
          ) : null}
          {option.description ? (
            <p className="mt-2 text-sm text-stone-600 whitespace-pre-wrap">
              {option.description}
            </p>
          ) : null}
          {option.link ? (
            <a
              href={option.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 rounded-lg bg-stone-100 px-2.5 py-1 text-xs font-medium text-ocean-700 hover:bg-stone-200"
            >
              Open link ↗
            </a>
          ) : null}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-3">
          <div className="rounded-xl bg-stone-100 px-3 py-1.5 text-center">
            <p className="text-xs font-medium uppercase tracking-wide text-stone-500">
              Score
            </p>
            <p className="text-xl font-bold tabular-nums text-stone-900">
              {score > 0 ? `+${score}` : score}
            </p>
          </div>
          {!isLocked ? (
            <VoteButtons
              tripId={tripId}
              tileId={tileId}
              optionId={option.id}
              myVote={myVote}
            />
          ) : (
            <span className="text-xs font-medium text-stone-400">
              Voting closed
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 border-t border-stone-100 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-stone-500">
          Who voted
        </p>
        {votes.length === 0 ? (
          <p className="mt-2 text-sm text-stone-500">No votes yet — be first!</p>
        ) : (
          <ul className="mt-2 space-y-2">
            {votes.map((v) => {
              const u = getUser(v.userId);
              return (
                <li
                  key={v.id}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="flex items-center gap-2 text-stone-700">
                    {u ? <Avatar name={u.name} size="sm" /> : null}
                    <span>{u?.name ?? v.userId}</span>
                  </span>
                  <span
                    className={`tabular-nums font-semibold ${
                      v.value > 0 ? "text-emerald-700" : "text-rose-600"
                    }`}
                  >
                    {v.value > 0 ? "👍" : "👎"}{" "}
                    {v.value > 0 ? `+${v.value}` : v.value}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </Card>
  );
}
