import { LeaderboardPlayer, SubmitRunPayload } from "../types/game";

const LOCAL_LEADERBOARD_KEY = "mm-local-leaderboard";

const readLocal = (): LeaderboardPlayer[] => {
  try {
    const raw = localStorage.getItem(LOCAL_LEADERBOARD_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as LeaderboardPlayer[];
  } catch {
    return [];
  }
};

const writeLocal = (entries: LeaderboardPlayer[]) => {
  localStorage.setItem(LOCAL_LEADERBOARD_KEY, JSON.stringify(entries.slice(0, 50)));
};

const sortPlayers = (entries: LeaderboardPlayer[]) =>
  [...entries].sort(
    (a, b) => b.best - a.best || new Date(b.lastPlayed).getTime() - new Date(a.lastPlayed).getTime()
  );

const upsertLocal = (payload: SubmitRunPayload): LeaderboardPlayer => {
  const key = payload.playerName.toLowerCase().trim();
  const entries = readLocal();
  const idx = entries.findIndex((e) => e.playerName.toLowerCase() === key);
  const now = new Date().toISOString();

  if (idx >= 0) {
    const existing = entries[idx];
    existing.best = Math.max(existing.best, payload.floor);
    existing.games += 1;
    existing.lastPlayed = now;
    writeLocal(entries);
    return existing;
  }

  const entry: LeaderboardPlayer = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    playerName: payload.playerName.trim(),
    best: payload.floor,
    games: 1,
    lastPlayed: now,
  };
  writeLocal(sortPlayers([...entries, entry]));
  return entry;
};

export const fetchLeaderboard = async (): Promise<{
  entries: LeaderboardPlayer[];
  shared: boolean;
}> => {
  try {
    const res = await fetch("/api/leaderboard");
    if (!res.ok) throw new Error("API unavailable");
    const entries = (await res.json()) as LeaderboardPlayer[];
    return { entries: sortPlayers(entries), shared: true };
  } catch {
    return { entries: sortPlayers(readLocal()), shared: false };
  }
};

export const submitRun = async (
  payload: SubmitRunPayload
): Promise<{ entry: LeaderboardPlayer; shared: boolean }> => {
  try {
    const res = await fetch("/api/leaderboard", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("API unavailable");
    const saved = (await res.json()) as LeaderboardPlayer;
    return { entry: saved, shared: true };
  } catch {
    const entry = upsertLocal(payload);
    return { entry, shared: false };
  }
};
