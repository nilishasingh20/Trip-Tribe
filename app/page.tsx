import { Card } from "@/components/ui/Card";
import { buttonClassName } from "@/components/ui/Button";
import { createTripTribe } from "@/lib/store";
import { redirect } from "next/navigation";

const MOCK_CREATOR_NAME = "Mock User";

const inputClassName =
  "w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm shadow-sm transition-colors placeholder:text-stone-400 focus:border-ocean-500 focus:outline-none focus:ring-2 focus:ring-ocean-500/20";

async function createTrip(formData: FormData) {
  "use server";
  const raw = String(formData.get("tripName") ?? "").trim();
  const name = raw.length > 0 ? raw : "Untitled trip";
  const { trip } = createTripTribe({
    name,
    creatorName: MOCK_CREATOR_NAME,
  });
  redirect(`/trip/${trip.id}`);
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-16">
      <section className="mb-10 text-center sm:mb-14">
        <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-ocean-600">
          Plan together
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-stone-900 sm:text-4xl">
          Your next adventure,
          <span className="block text-ocean-700">with your crew.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-md text-base text-stone-600">
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
          <button type="submit" className={buttonClassName("primary", "w-full")}>
            Create trip
          </button>
        </form>
      </Card>
    </main>
  );
}
