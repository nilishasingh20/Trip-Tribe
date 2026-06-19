import { joinTrip } from "@/app/trip/[tripId]/actions";
import { buttonClassName } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { inputClassName } from "@/lib/ui-classes";

type JoinTripBannerProps = {
  tripId: string;
};

export function JoinTripBanner({ tripId }: JoinTripBannerProps) {
  return (
    <Card className="mb-8 border-ocean-200 bg-ocean-50/50">
      <p className="font-semibold text-stone-900">You&apos;ve been invited!</p>
      <p className="mt-1 text-sm text-stone-600">
        Join this Trip Tribe to add ideas and vote with the group.
      </p>
      <form action={joinTrip} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
        <input type="hidden" name="tripId" value={tripId} />
        <div className="min-w-0 flex-1">
          <label htmlFor="memberName" className="mb-1.5 block text-sm font-medium text-stone-700">
            Your name
          </label>
          <input
            id="memberName"
            name="memberName"
            type="text"
            required
            placeholder="e.g. Alex"
            className={inputClassName}
          />
        </div>
        <button
          type="submit"
          className={buttonClassName("primary", "shrink-0 active:scale-95")}
        >
          Join tribe
        </button>
      </form>
    </Card>
  );
}
