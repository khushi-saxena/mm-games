import { ThemeMode } from "../services/playerProgress";

export interface GameTheme {
  id: string;
  name: string;
  mode: ThemeMode;
  vars: Record<string, string>;
  background: string;
  overlayShadow: string;
  fogA: string;
  fogB: string;
}

export const GAME_THEMES: GameTheme[] = [
  {
    id: "midnight",
    name: "Midnight Mansion",
    mode: "dark",
    vars: {
      "--ink": "#ece6da",
      "--muted": "#9a8fb0",
      "--gold": "#e8c45c",
      "--card": "linear-gradient(180deg, rgba(28,20,40,.72), rgba(14,10,22,.82))",
      "--cardBorder": "rgba(232,196,92,.22)",
      "--overlay": "rgba(6,4,12,.82)",
      "--rowBg": "rgba(255,255,255,.02)",
      "--rowBorder": "rgba(255,255,255,.05)",
      "--hub": "radial-gradient(circle at 35% 30%, #1b1326, #0a0712)",
      "--titleColor": "#f3ead4",
      "--titleShadow": "0 0 18px rgba(232,196,92,.35), 0 2px 0 #000",
      "--inputBg": "rgba(0,0,0,.4)",
      "--dust": "rgba(232,196,92,.5)",
      "--btnTop": "#e8c45c",
      "--btnBottom": "#b8902f",
      "--btnText": "#1a1206",
    },
    background:
      "radial-gradient(900px 500px at 50% -10%, rgba(120,70,180,.18), transparent 60%), radial-gradient(700px 600px at 85% 110%, rgba(40,90,200,.12), transparent 55%), radial-gradient(600px 500px at 10% 100%, rgba(200,60,60,.1), transparent 55%), #0a0712",
    overlayShadow: "inset 0 0 220px 60px rgba(0,0,0,.7)",
    fogA: "rgba(150,120,190,.10)",
    fogB: "rgba(90,140,210,.08)",
  },
  {
    id: "crypt",
    name: "Crypt Depths",
    mode: "dark",
    vars: {
      "--ink": "#d8f5ee",
      "--muted": "#6a9a8e",
      "--gold": "#5ee4c4",
      "--card": "linear-gradient(180deg, rgba(12,32,28,.78), rgba(6,16,14,.9))",
      "--cardBorder": "rgba(94,228,196,.25)",
      "--overlay": "rgba(4,14,12,.85)",
      "--rowBg": "rgba(94,228,196,.04)",
      "--rowBorder": "rgba(94,228,196,.08)",
      "--hub": "radial-gradient(circle at 35% 30%, #143028, #061210)",
      "--titleColor": "#e8fff8",
      "--titleShadow": "0 0 20px rgba(94,228,196,.4), 0 2px 0 #000",
      "--inputBg": "rgba(0,20,16,.5)",
      "--dust": "rgba(94,228,196,.45)",
      "--btnTop": "#5ee4c4",
      "--btnBottom": "#2a9a82",
      "--btnText": "#041210",
    },
    background:
      "radial-gradient(900px 500px at 50% -10%, rgba(40,160,130,.2), transparent 60%), radial-gradient(700px 600px at 85% 110%, rgba(20,80,120,.15), transparent 55%), #061210",
    overlayShadow: "inset 0 0 200px 55px rgba(0,20,16,.75)",
    fogA: "rgba(60,180,150,.12)",
    fogB: "rgba(40,100,140,.1)",
  },
  {
    id: "bloodmoon",
    name: "Blood Moon",
    mode: "dark",
    vars: {
      "--ink": "#f5e0e0",
      "--muted": "#a87878",
      "--gold": "#ff7a5c",
      "--card": "linear-gradient(180deg, rgba(40,12,16,.78), rgba(18,6,8,.9))",
      "--cardBorder": "rgba(255,122,92,.28)",
      "--overlay": "rgba(20,4,6,.85)",
      "--rowBg": "rgba(255,100,80,.04)",
      "--rowBorder": "rgba(255,100,80,.1)",
      "--hub": "radial-gradient(circle at 35% 30%, #2a1014, #120608)",
      "--titleColor": "#ffe8e4",
      "--titleShadow": "0 0 22px rgba(255,90,70,.45), 0 2px 0 #000",
      "--inputBg": "rgba(30,8,10,.55)",
      "--dust": "rgba(255,120,90,.5)",
      "--btnTop": "#ff8a6a",
      "--btnBottom": "#c04030",
      "--btnText": "#1a0806",
    },
    background:
      "radial-gradient(900px 500px at 50% -10%, rgba(180,40,40,.22), transparent 60%), radial-gradient(600px 500px at 10% 100%, rgba(120,20,60,.18), transparent 55%), #120608",
    overlayShadow: "inset 0 0 220px 60px rgba(40,0,10,.7)",
    fogA: "rgba(200,60,60,.12)",
    fogB: "rgba(140,40,80,.1)",
  },
  {
    id: "manor",
    name: "Sunlit Manor",
    mode: "light",
    vars: {
      "--ink": "#3a2a1a",
      "--muted": "#8a7560",
      "--gold": "#9c6f1e",
      "--card": "linear-gradient(180deg, rgba(255,251,242,.94), rgba(244,235,219,.96))",
      "--cardBorder": "rgba(156,111,30,.32)",
      "--overlay": "rgba(60,42,20,.5)",
      "--rowBg": "rgba(120,90,40,.05)",
      "--rowBorder": "rgba(120,90,40,.1)",
      "--hub": "radial-gradient(circle at 35% 30%, #fffaef, #ead9bd)",
      "--titleColor": "#4a2f12",
      "--titleShadow": "0 0 12px rgba(210,160,70,.4), 0 1px 0 #fff",
      "--inputBg": "rgba(255,255,255,.7)",
      "--dust": "rgba(180,120,40,.4)",
      "--btnTop": "#e8c45c",
      "--btnBottom": "#b8902f",
      "--btnText": "#1a1206",
    },
    background:
      "radial-gradient(900px 520px at 50% -10%, rgba(255,210,130,.5), transparent 60%), radial-gradient(700px 600px at 85% 110%, rgba(220,180,120,.35), transparent 55%), #f3e9d6",
    overlayShadow: "inset 0 0 200px 50px rgba(120,80,30,.18)",
    fogA: "rgba(255,200,120,.25)",
    fogB: "rgba(220,160,100,.2)",
  },
  {
    id: "mist",
    name: "Morning Mist",
    mode: "light",
    vars: {
      "--ink": "#2a3548",
      "--muted": "#6a7a92",
      "--gold": "#4a7ab8",
      "--card": "linear-gradient(180deg, rgba(248,252,255,.96), rgba(228,236,248,.98))",
      "--cardBorder": "rgba(74,122,184,.28)",
      "--overlay": "rgba(40,55,80,.45)",
      "--rowBg": "rgba(74,122,184,.06)",
      "--rowBorder": "rgba(74,122,184,.12)",
      "--hub": "radial-gradient(circle at 35% 30%, #f8fcff, #dce8f4)",
      "--titleColor": "#1e3048",
      "--titleShadow": "0 0 14px rgba(120,170,220,.35), 0 1px 0 #fff",
      "--inputBg": "rgba(255,255,255,.85)",
      "--dust": "rgba(120,170,220,.35)",
      "--btnTop": "#6aa0e8",
      "--btnBottom": "#3a68a8",
      "--btnText": "#0e1828",
    },
    background:
      "radial-gradient(900px 520px at 50% -10%, rgba(180,210,255,.55), transparent 60%), radial-gradient(600px 500px at 10% 100%, rgba(200,220,240,.4), transparent 55%), #e8f0f8",
    overlayShadow: "inset 0 0 180px 45px rgba(80,120,180,.12)",
    fogA: "rgba(180,210,255,.3)",
    fogB: "rgba(140,180,220,.25)",
  },
  {
    id: "rose",
    name: "Rose Gallery",
    mode: "light",
    vars: {
      "--ink": "#4a2838",
      "--muted": "#9a7088",
      "--gold": "#c45a88",
      "--card": "linear-gradient(180deg, rgba(255,248,252,.96), rgba(248,232,240,.98))",
      "--cardBorder": "rgba(196,90,136,.3)",
      "--overlay": "rgba(60,30,45,.45)",
      "--rowBg": "rgba(196,90,136,.06)",
      "--rowBorder": "rgba(196,90,136,.1)",
      "--hub": "radial-gradient(circle at 35% 30%, #fff8fc, #f0dce8)",
      "--titleColor": "#5a2040",
      "--titleShadow": "0 0 14px rgba(220,120,170,.35), 0 1px 0 #fff",
      "--inputBg": "rgba(255,255,255,.8)",
      "--dust": "rgba(220,120,170,.4)",
      "--btnTop": "#e88ab0",
      "--btnBottom": "#b04878",
      "--btnText": "#2a0818",
    },
    background:
      "radial-gradient(900px 520px at 50% -10%, rgba(255,180,210,.45), transparent 60%), radial-gradient(700px 600px at 85% 110%, rgba(240,180,200,.35), transparent 55%), #faf0f4",
    overlayShadow: "inset 0 0 180px 45px rgba(160,80,120,.14)",
    fogA: "rgba(255,180,210,.28)",
    fogB: "rgba(220,140,180,.22)",
  },
];

export const getTheme = (id: string, mode: ThemeMode): GameTheme => {
  const found = GAME_THEMES.find((t) => t.id === id && t.mode === mode);
  if (found) return found;
  return GAME_THEMES.find((t) => t.mode === mode) ?? GAME_THEMES[0];
};

export const themesForMode = (mode: ThemeMode) => GAME_THEMES.filter((t) => t.mode === mode);

export const themeToStyle = (theme: GameTheme): Record<string, string> => ({
  ...theme.vars,
  background: theme.background,
  "--overlayShadow": theme.overlayShadow,
  "--fogA": theme.fogA,
  "--fogB": theme.fogB,
});
