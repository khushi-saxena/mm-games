import { HauntedColorId } from "../types/game";

export interface HauntedColor {
  id: HauntedColorId;
  base: string;
  lit: string;
  glow: string;
  freq: number;
  radius: string;
}

export const HAUNTED_COLORS: HauntedColor[] = [
  {
    id: "crimson",
    base: "#9e1b1b",
    lit: "#ff5c4d",
    glow: "rgba(255,92,77,.85)",
    freq: 261.63,
    radius: "100% 8px 8px 8px",
  },
  {
    id: "emerald",
    base: "#0f6b43",
    lit: "#39ffa0",
    glow: "rgba(57,255,160,.85)",
    freq: 329.63,
    radius: "8px 100% 8px 8px",
  },
  {
    id: "sapphire",
    base: "#1c3aa0",
    lit: "#6aa0ff",
    glow: "rgba(106,160,255,.85)",
    freq: 392.0,
    radius: "8px 8px 8px 100%",
  },
  {
    id: "amber",
    base: "#9c7300",
    lit: "#ffd24d",
    glow: "rgba(255,210,77,.85)",
    freq: 466.16,
    radius: "8px 8px 100% 8px",
  },
];

export const COLOR_FREQ: Record<HauntedColorId, number> = {
  crimson: 261.63,
  emerald: 329.63,
  sapphire: 392.0,
  amber: 466.16,
};
