import { Card } from "@/components/ui/Card";
import { getOption, type Tile } from "@/lib/store";
import { getTileIcon } from "@/lib/tile-icons";

type TripDecisionsSummaryProps = {
  tiles: Tile[];
};

function lockedChoice(tile: Tile): { title: string; link?: string } | null {
  if (tile.status !== "locked" || !tile.lockedOptionId) return null;
  const option = getOption(tile.lockedOptionId);
  if (!option) return null;
  return { title: option.title, link: option.link };
}

export function TripDecisionsSummary({ tiles }: TripDecisionsSummaryProps) {
  const allLocked = tiles.length > 0 && tiles.every((t) => t.status === "locked");
  if (!allLocked) return null;

  return (
    <Card className="mb-8 border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-ocean-50/40">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
            Trip locked in
          </p>
          <h2 className="mt-1 text-xl font-bold text-stone-900 sm:text-2xl">
            Your crew decided everything — here&apos;s the plan
          </h2>
        </div>
        <span aria-hidden className="shrink-0 text-3xl sm:text-4xl">
          🎉
        </span>
      </div>

      <dl className="mt-6 divide-y divide-emerald-100/80 rounded-xl border border-emerald-100 bg-white/70">
        {tiles.map((tile) => {
          const choice = lockedChoice(tile);
          return (
            <div
              key={tile.id}
              className="flex flex-col gap-1 px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
            >
              <dt className="flex items-center gap-2.5 text-sm font-semibold text-stone-700">
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-lg ring-1 ring-emerald-100"
                >
                  {getTileIcon(tile.label)}
                </span>
                {tile.label}
              </dt>
              <dd className="min-w-0 pl-11 text-sm text-stone-900 sm:pl-0 sm:text-right">
                {choice ? (
                  <>
                    <span className="font-medium">{choice.title}</span>
                    {choice.link ? (
                      <a
                        href={choice.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-2 inline-flex text-ocean-700 underline-offset-2 hover:underline"
                      >
                        Open link ↗
                      </a>
                    ) : null}
                  </>
                ) : (
                  <span className="text-stone-500">No option recorded</span>
                )}
              </dd>
            </div>
          );
        })}
      </dl>
    </Card>
  );
}
