import { SavedTripsList } from "@/components/home/SavedTripsList";
import { Card } from "@/components/ui/Card";
import { buttonClassName } from "@/components/ui/Button";
import { createTripTribe } from "@/lib/store";
import { inputClassName } from "@/lib/ui-classes";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const MOCK_CREATOR_NAME = "Mock User";

async function createTrip(formData: FormData) {
  "use server";
  const raw = String(formData.get("tripName") ?? "").trim();
  const name = raw.length > 0 ? raw : "Untitled trip";
  const { trip } = createTripTribe({
    name,
    creatorName: MOCK_CREATOR_NAME,
  });
  redirect(`/trip/${trip.id}?toast=created`);
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <section className="relative mb-12 overflow-hidden rounded-3xl border border-ocean-100 bg-gradient-to-br from-ocean-50 via-white to-coral-50 px-6 py-12 text-center shadow-card sm:mb-16 sm:px-10 sm:py-16">
        <div
          aria-hidden
          className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-ocean-200/40 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-10 -right-6 h-48 w-48 rounded-full bg-coral-500/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-8 top-8 hidden text-5xl opacity-30 sm:block"
        >
          ✈️
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute bottom-10 left-10 hidden text-4xl opacity-25 sm:block"
        >
          🗺️
        </div>
        <p className="relative mb-3 text-sm font-semibold uppercase tracking-wider text-ocean-600">
          Plan together
        </p>
        <h1 className="relative text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Your next adventure,
          <span className="block text-ocean-700">with your crew.</span>
        </h1>
        <p className="relative mx-auto mt-4 max-w-md text-base text-stone-600">
          Vote on destinations, dates, and plans — then lock decisions and travel
          without the group-chat chaos.
        </p>
      </section>

      <Card className="mx-auto max-w-md">
        <h2 className="text-lg font-bold text-stone-900">Start a new trip</h2>
        <p className="mt-1 text-sm text-stone-500">
          Name it something you&apos;ll recognize later.
        </p>
        <form action={createTrip} className="mt-5 flex flex-col gap-4">
          <div>
            <label
              htmlFor="tripName"
              className="mb-1.5 block text-sm font-medium text-stone-700"
            >
              Trip name
            </label>
            <input
              id="tripName"
              name="tripName"
              type="text"
              required
              autoComplete="off"
              placeholder="e.g. Summer in Lisbon"
              className={inputClassName}
            />
          </div>
          <button
            type="submit"
            className={buttonClassName("primary", "w-full active:scale-[0.98]")}
          >
            Create trip
          </button>
        </form>
      </Card>

      <section className="mx-auto mt-12 max-w-md">
        <h2 className="mb-4 text-lg font-bold text-stone-900">Your trips</h2>
        <SavedTripsList />
      </section>
    </main>
  );
}
