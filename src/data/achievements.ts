import type { LucideIcon } from "lucide-react";
import { Award, Crown, Flame, Footprints, KeyRound, Moon, Repeat, Star } from "lucide-react";
import { PlayerProgress } from "../types/game";

export interface Achievement {
  id: string;
  name: string;
  desc: string;
  icon: LucideIcon;
  test: (stats: Pick<PlayerProgress, "best" | "runs">) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first", name: "First Descent", desc: "Clear your first floor", icon: Footprints, test: (s) => s.best >= 1 },
  { id: "f3", name: "Into the Dark", desc: "Reach floor 3", icon: Moon, test: (s) => s.best >= 3 },
  { id: "f5", name: "Cellar Dweller", desc: "Reach floor 5", icon: Flame, test: (s) => s.best >= 5 },
  { id: "f8", name: "Crypt Keeper", desc: "Reach floor 8", icon: KeyRound, test: (s) => s.best >= 8 },
  { id: "f12", name: "Soul of the Mansion", desc: "Reach floor 12", icon: Crown, test: (s) => s.best >= 12 },
  { id: "f16", name: "Eternal Wanderer", desc: "Reach floor 16", icon: Star, test: (s) => s.best >= 16 },
  { id: "r10", name: "Restless Spirit", desc: "Play 10 runs", icon: Repeat, test: (s) => s.runs >= 10 },
  { id: "r25", name: "Mansion Regular", desc: "Play 25 runs", icon: Award, test: (s) => s.runs >= 25 },
];
