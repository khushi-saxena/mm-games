import { DifficultyId } from "../data/difficulty";
import { PlayerProgress, PROGRESS_KEY, THEME_KEY } from "../types/game";

const DIFFICULTY_KEY = "mm_difficulty";
const THEME_PALETTE_KEY = "mm_theme_palette";

const DEFAULT_PROGRESS: PlayerProgress = { best: 0, runs: 0, achievements: [] };

export type ThemeMode = "dark" | "light";

export interface ThemeSettings {
  mode: ThemeMode;
  paletteId: string;
}

export const loadProgress = (): PlayerProgress => {
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS };
    return { ...DEFAULT_PROGRESS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_PROGRESS };
  }
};

export const saveProgress = (progress: PlayerProgress) => {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

export const loadThemeSettings = (): ThemeSettings => {
  try {
    const raw = localStorage.getItem(THEME_KEY);
    if (!raw) return { mode: "dark", paletteId: "midnight" };
    try {
      const parsed = JSON.parse(raw) as ThemeSettings;
      if (parsed.mode && parsed.paletteId) return parsed;
    } catch {
      if (raw === "light" || raw === "dark") {
        return { mode: raw, paletteId: raw === "light" ? "manor" : "midnight" };
      }
    }
  } catch {
    /* */
  }
  return { mode: "dark", paletteId: "midnight" };
};

export const saveThemeSettings = (settings: ThemeSettings) => {
  localStorage.setItem(THEME_KEY, JSON.stringify(settings));
};

export const loadDifficulty = (): DifficultyId => {
  const d = localStorage.getItem(DIFFICULTY_KEY);
  if (d === "easy" || d === "medium" || d === "hard") return d;
  return "medium";
};

export const saveDifficulty = (id: DifficultyId) => {
  localStorage.setItem(DIFFICULTY_KEY, id);
};
