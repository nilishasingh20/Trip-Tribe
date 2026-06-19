"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  formatDateOptionTitle,
  isDatesTileLabel,
  isYmdInRange,
  maxTripDateLocalYMD,
  parseLocalYMD,
  todayLocalYMD,
} from "@/lib/dates-tile";
import {
  createOption,
  getOption,
  getTile,
  getTripTribe,
  lockTile,
  setVote,
} from "@/lib/store";

function tilePath(tripId: string, tileId: string, toast?: string) {
  const base = `/trip/${tripId}/tile/${tileId}`;
  return toast ? `${base}?toast=${toast}` : base;
}

export async function addOption(formData: FormData) {
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
  if (!title) return;

  const createdByUserId = trip.memberUserIds[0];
  if (!createdByUserId) return;

  createOption({
    tileId,
    title,
    description,
    link: linkRaw ? linkRaw : undefined,
    createdByUserId,
  });

  redirect(tilePath(tripId, tileId, "option"));
}

export async function addDateOption(formData: FormData) {
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
  if (!isYmdInRange(ymd, minY, maxY)) return;

  const d = parseLocalYMD(ymd);
  if (!d) return;

  const createdByUserId = trip.memberUserIds[0];
  if (!createdByUserId) return;

  createOption({
    tileId,
    title: formatDateOptionTitle(d),
    description: `Calendar date: ${ymd}`,
    createdByUserId,
  });

  redirect(tilePath(tripId, tileId, "date"));
}

export async function castVote(formData: FormData) {
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
  if (!userId || !trip.memberUserIds.includes(userId)) return;

  setVote({ optionId, userId, value });

  redirect(tilePath(tripId, tileId, "vote"));
}

export async function lockDecision(formData: FormData) {
  const tripId = String(formData.get("tripId") ?? "");
  const tileId = String(formData.get("tileId") ?? "");

  const trip = getTripTribe(tripId);
  const tile = getTile(tileId);
  if (!trip || !tile || tile.tripId !== tripId) return;

  const userId = trip.memberUserIds[0];
  if (!userId) return;

  const result = lockTile({ tripId, tileId, userId });
  if (result.ok) {
    revalidatePath(`/trip/${tripId}`);
    redirect(tilePath(tripId, tileId, "locked"));
  }
}
