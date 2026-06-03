export type HauntedColorId = "crimson" | "emerald" | "sapphire" | "amber";

export type GamePhase = "idle" | "showing" | "input" | "gameover";

export interface LeaderboardPlayer {
  id: string;
  playerName: string;
  best: number;
  games: number;
  lastPlayed: string;
}

export interface SubmitRunPayload {
  playerName: string;
  floor: number;
}

export interface PlayerProgress {
  best: number;
  runs: number;
  achievements: string[];
}

export const PLAYER_NAME_KEY = "mm_myname";
export const PROGRESS_KEY = "mm_progress";
export const THEME_KEY = "mm_theme";

export const HAUNTED_COLOR_IDS: HauntedColorId[] = ["crimson", "emerald", "sapphire", "amber"];

export const randomHauntedColor = (): HauntedColorId =>
  HAUNTED_COLOR_IDS[Math.floor(Math.random() * HAUNTED_COLOR_IDS.length)];
