# Midnight Mansion Games

A Simon-style memory challenge for the office. Watch the mansion light up, repeat the sequence, and compete on a shared leaderboard.

## Quick start (shared leaderboard)

Coworkers need the **shared API** running so everyone sees the same scores.

```bash
npm install
npm run dev
```

This starts:

- **Web app** — Vite dev server (default port 5173)
- **Leaderboard API** — `http://localhost:3001` (proxied as `/api` from the frontend)

Open the app URL, enter your name, and play. Scores are saved automatically when a run ends.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Frontend + shared leaderboard API |
| `npm start` | Frontend only (leaderboard falls back to browser local storage) |
| `npm run server` | Leaderboard API only |
| `npm run build` | Production build |

## Settings

- **Themes** — Pick **Dark** or **Light**, then choose a palette (e.g. Midnight Mansion, Crypt Depths, Sunlit Manor).
- **Difficulty** — **Easy** (slower flashes), **Medium**, or **Hard** (faster). Change only before starting a run.
- **Sound** — Each colored pad has its own tone plus a click thump; use the speaker icon to mute.

## How scoring works

- **Floor** = how many steps you cleared in your best run (complete round 1 → Floor 1, then 2, etc.).
- The **Hall of Souls** ranks everyone by their **deepest floor** (one row per player, run count tracked).
- Sequences speed up as you climb.
- **Relics** unlock from personal milestones (floors reached and total runs).

## Deploying for your team

1. Build the frontend: `npm run build`
2. Host the `dist` folder and run `node server/index.js` on a machine everyone can reach (or deploy API + static site together).
3. Point the frontend at the API (Vite proxy is dev-only; in production, serve both from one origin or set your host’s reverse proxy to forward `/api` to the Node server).

Leaderboard data is stored in `server/leaderboard.json` (gitignored).

## Project layout

Primary game code lives in `src/components/MidnightMansionGame`.

Built with [nano-react-app](https://github.com/nano-react-app/nano-react-app) + Vite.
