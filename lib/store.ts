export type User = {
  id: string;
  name: string;
};

export type TripTribe = {
  id: string;
  name: string;
  memberUserIds: string[];
  captainUserId?: string;
  tileIds: string[];
};

export type TileStatus = "pending" | "voting" | "locked";

export type Tile = {
  id: string;
  tripId: string;
  label: string;
  status: TileStatus;
  votingDeadline?: string;
  optionIds: string[];
  /** Winning option when status is "locked" (highest score at lock time). */
  lockedOptionId?: string;
};

export type Option = {
  id: string;
  tileId: string;
  title: string;
  description: string;
  link?: string;
  createdByUserId: string;
};

export type VoteValue = 1 | -1;

export type Vote = {
  id: string;
  optionId: string;
  userId: string;
  value: VoteValue;
};

type MemStore = {
  users: Record<string, User>;
  tripTribes: Record<string, TripTribe>;
  tiles: Record<string, Tile>;
  options: Record<string, Option>;
  votes: Record<string, Vote>;
};

/**
 * Next.js may load `lib/store` in more than one module instance during dev / server actions.
 * A plain module-level object only lives in one instance — the other sees an empty map → 404.
 * `globalThis` keeps one store for the whole Node process.
 */
function mem(): MemStore {
  const g = globalThis as typeof globalThis & { __tripTribeMemStore?: MemStore };
  if (!g.__tripTribeMemStore) {
    g.__tripTribeMemStore = {
      users: {},
      tripTribes: {},
      tiles: {},
      options: {},
      votes: {},
    };
  }
  return g.__tripTribeMemStore;
}

function newId(): string {
  return crypto.randomUUID();
}

function createUser(name: string): User {
  const { users } = mem();
  const user: User = { id: newId(), name };
  users[user.id] = user;
  return user;
}

export function createTripTribe(input: {
  name: string;
  creatorName: string;
}): { trip: TripTribe; creator: User } {
  const { tripTribes } = mem();
  const creator = createUser(input.creatorName);
  const trip: TripTribe = {
    id: newId(),
    name: input.name,
    memberUserIds: [creator.id],
    tileIds: [],
  };
  tripTribes[trip.id] = trip;
  return { trip, creator };
}

export function getTripTribe(tripId: string): TripTribe | undefined {
  return mem().tripTribes[tripId];
}

export function getUser(userId: string): User | undefined {
  return mem().users[userId];
}

export function getOption(optionId: string): Option | undefined {
  return mem().options[optionId];
}

/** One vote per (option, user); calling again updates the same vote. */
export function setVote(input: {
  optionId: string;
  userId: string;
  value: VoteValue;
}): Vote {
  const m = mem();
  const opt = m.options[input.optionId];
  if (!opt) {
    throw new Error(`Unknown option: ${input.optionId}`);
  }
  const tile = m.tiles[opt.tileId];
  if (tile?.status === "locked") {
    throw new Error("Tile is locked");
  }
  if (!m.users[input.userId]) {
    throw new Error(`Unknown user: ${input.userId}`);
  }

  const id = `${input.optionId}:${input.userId}`;
  const existing = m.votes[id];
  if (existing) {
    existing.value = input.value;
    return existing;
  }

  const vote: Vote = {
    id,
    optionId: input.optionId,
    userId: input.userId,
    value: input.value,
  };
  m.votes[id] = vote;
  return vote;
}

export type OptionVoteSummary = {
  option: Option;
  score: number;
  votes: Vote[];
};

/** Options for this tile with scores and vote rows; sorted by score descending. */
export function getTileOptionsWithVotes(tileId: string): OptionVoteSummary[] {
  const options = getOptionsForTile(tileId);
  const { votes } = mem();
  const byOption = new Map<string, Vote[]>();
  for (const v of Object.values(votes)) {
    if (!byOption.has(v.optionId)) {
      byOption.set(v.optionId, []);
    }
    byOption.get(v.optionId)!.push(v);
  }

  return options
    .map((option) => {
      const vs = byOption.get(option.id) ?? [];
      const score = vs.reduce((s, x) => s + x.value, 0);
      return { option, score, votes: vs };
    })
    .sort((a, b) => b.score - a.score);
}

/** Options for this tile ordered by total vote score (highest first). In-memory only. */
export function getRankedOptions(tileId: string): Option[] {
  return getTileOptionsWithVotes(tileId).map((row) => row.option);
}

export type LockTileResult =
  | { ok: true; tile: Tile }
  | { ok: false; reason: string };

/**
 * Lock tile: pick highest-scored option, set status locked.
 * If Trip Captain is set → only they may lock; otherwise any trip member may lock.
 */
export function lockTile(input: {
  tripId: string;
  tileId: string;
  userId: string;
}): LockTileResult {
  const m = mem();
  const trip = m.tripTribes[input.tripId];
  const tile = m.tiles[input.tileId];
  if (!trip || !tile || tile.tripId !== input.tripId) {
    return { ok: false, reason: "invalid_tile" };
  }
  if (tile.status === "locked") {
    return { ok: false, reason: "already_locked" };
  }

  if (trip.captainUserId !== undefined && trip.captainUserId !== "") {
    if (input.userId !== trip.captainUserId) {
      return { ok: false, reason: "captain_only" };
    }
  } else if (!trip.memberUserIds.includes(input.userId)) {
    return { ok: false, reason: "not_member" };
  }

  const ranked = getRankedOptions(input.tileId);
  const winner = ranked[0];

  tile.status = "locked";
  tile.lockedOptionId = winner?.id;

  return { ok: true, tile };
}

/** Whether this user may lock this tile (captain-only rule when a captain exists). */
export function canUserLockTile(
  trip: TripTribe,
  userId: string | undefined,
): boolean {
  if (!userId) return false;
  if (trip.captainUserId !== undefined && trip.captainUserId !== "") {
    return userId === trip.captainUserId;
  }
  return trip.memberUserIds.includes(userId);
}

export function createTile(input: {
  tripId: string;
  label: string;
  status?: TileStatus;
  votingDeadline?: string;
}): Tile {
  const { tripTribes, tiles } = mem();
  const trip = tripTribes[input.tripId];
  if (!trip) {
    throw new Error(`Unknown trip: ${input.tripId}`);
  }

  const tile: Tile = {
    id: newId(),
    tripId: input.tripId,
    label: input.label,
    status: input.status ?? "pending",
    votingDeadline: input.votingDeadline,
    optionIds: [],
  };

  tiles[tile.id] = tile;
  trip.tileIds.push(tile.id);
  return tile;
}

export function getTile(tileId: string): Tile | undefined {
  return mem().tiles[tileId];
}

export function getOptionsForTile(tileId: string): Option[] {
  const { tiles, options } = mem();
  const tile = tiles[tileId];
  if (!tile) return [];
  return tile.optionIds.map((id) => options[id]).filter(Boolean);
}

export function createOption(input: {
  tileId: string;
  title: string;
  description: string;
  link?: string;
  createdByUserId: string;
}): Option {
  const { tiles, users, options } = mem();
  const tile = tiles[input.tileId];
  if (!tile) {
    throw new Error(`Unknown tile: ${input.tileId}`);
  }
  if (tile.status === "locked") {
    throw new Error("Tile is locked");
  }
  if (!users[input.createdByUserId]) {
    throw new Error(`Unknown user: ${input.createdByUserId}`);
  }

  const option: Option = {
    id: newId(),
    tileId: input.tileId,
    title: input.title,
    description: input.description,
    link: input.link,
    createdByUserId: input.createdByUserId,
  };

  options[option.id] = option;
  tile.optionIds.push(option.id);
  return option;
}

export const DEFAULT_TILE_LABELS = [
  "Destination",
  "Dates",
  "Accommodation",
  "Activities",
  "Itinerary",
  "Transport",
] as const;

/** Creates any missing default tiles and returns this trip’s tiles in default order. */
export function ensureDefaultTiles(tripId: string): Tile[] {
  const { tripTribes, tiles } = mem();
  const trip = tripTribes[tripId];
  if (!trip) {
    throw new Error(`Unknown trip: ${tripId}`);
  }

  const existingLabels = new Set(
    trip.tileIds
      .map((id) => tiles[id]?.label)
      .filter((l): l is string => Boolean(l)),
  );

  for (const label of DEFAULT_TILE_LABELS) {
    if (!existingLabels.has(label)) {
      createTile({ tripId, label });
      existingLabels.add(label);
    }
  }

  const order = new Map<string, number>(
    DEFAULT_TILE_LABELS.map((label, index) => [label, index]),
  );

  return trip.tileIds
    .map((id) => tiles[id])
    .filter((t): t is Tile => Boolean(t))
    .sort(
      (a, b) =>
        (order.get(a.label) ?? 999) - (order.get(b.label) ?? 999),
    );
}
