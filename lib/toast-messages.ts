export const TOAST_MESSAGES: Record<string, string> = {
  vote: "Your vote was saved.",
  option: "Option added — let the group decide!",
  date: "Date added to the poll.",
  locked: "Decision locked. You're one step closer!",
  joined: "Welcome to the tribe — happy planning!",
  created: "Trip created. Time to plan with your crew!",
  copied: "Invite link copied!",
};

export function getToastMessage(key?: string): string | null {
  if (!key) return null;
  return TOAST_MESSAGES[key] ?? null;
}
