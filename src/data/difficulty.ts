export type DifficultyId = "easy" | "medium" | "hard";

export interface DifficultySettings {
  id: DifficultyId;
  label: string;
  description: string;
  introDelayMs: number;
  advanceDelayMs: number;
  flashBaseMs: number;
  flashDecayPerStep: number;
  flashMinMs: number;
  gapBaseMs: number;
  gapDecayPerStep: number;
  gapMinMs: number;
}

export const DIFFICULTIES: DifficultySettings[] = [
  {
    id: "easy",
    label: "Easy",
    description: "Slower lights, longer gaps — learn the mansion.",
    introDelayMs: 650,
    advanceDelayMs: 900,
    flashBaseMs: 640,
    flashDecayPerStep: 18,
    flashMinMs: 320,
    gapBaseMs: 300,
    gapDecayPerStep: 8,
    gapMinMs: 140,
  },
  {
    id: "medium",
    label: "Medium",
    description: "Balanced pace for most explorers.",
    introDelayMs: 550,
    advanceDelayMs: 780,
    flashBaseMs: 560,
    flashDecayPerStep: 26,
    flashMinMs: 190,
    gapBaseMs: 250,
    gapDecayPerStep: 11,
    gapMinMs: 95,
  },
  {
    id: "hard",
    label: "Hard",
    description: "Fast flashes — only the bold survive.",
    introDelayMs: 420,
    advanceDelayMs: 620,
    flashBaseMs: 460,
    flashDecayPerStep: 34,
    flashMinMs: 140,
    gapBaseMs: 190,
    gapDecayPerStep: 15,
    gapMinMs: 70,
  },
];

export const getDifficulty = (id: DifficultyId): DifficultySettings =>
  DIFFICULTIES.find((d) => d.id === id) ?? DIFFICULTIES[1];
