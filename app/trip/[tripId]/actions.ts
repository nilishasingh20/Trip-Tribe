"use server";

import { redirect } from "next/navigation";
import { joinTripAsMember } from "@/lib/store";

export async function joinTrip(formData: FormData) {
  const tripId = String(formData.get("tripId") ?? "");
  const memberName = String(formData.get("memberName") ?? "").trim();

  if (!tripId || !memberName) return;

  const user = joinTripAsMember({ tripId, memberName });
  if (!user) return;

  redirect(`/trip/${tripId}?toast=joined`);
}
