import { createTripTribe } from "@/lib/store";
import { redirect } from "next/navigation";

const MOCK_CREATOR_NAME = "Mock User";

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
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8">
      <h1 className="text-3xl font-semibold tracking-tight text-neutral-900">
        Trip Tribe
      </h1>
      <form
        action={createTrip}
        className="flex w-full max-w-sm flex-col gap-3"
      >
        <label htmlFor="tripName" className="text-sm font-medium text-neutral-700">
          Trip name
        </label>
        <input
          id="tripName"
          name="tripName"
          type="text"
          required
          autoComplete="off"
          placeholder="e.g. Summer in Lisbon"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none ring-neutral-900 focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/20"
        />
        <button
          type="submit"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
        >
          Create Trip
        </button>
      </form>
    </main>
  );
}
