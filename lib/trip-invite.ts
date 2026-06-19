/** Relative invite path — append to site origin for full URL. */
export function tripInvitePath(tripId: string): string {
  return `/trip/${tripId}?invite=1`;
}

export function buildTripInviteUrl(tripId: string, origin: string): string {
  return `${origin.replace(/\/$/, "")}${tripInvitePath(tripId)}`;
}
