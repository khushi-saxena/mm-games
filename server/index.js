const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(__dirname, "leaderboard.json");
const PORT = process.env.LEADERBOARD_PORT || 3001;
const MAX_PLAYERS = 100;

const app = express();
app.use(cors());
app.use(express.json());

const readPlayers = () => {
  try {
    if (!fs.existsSync(DATA_FILE)) return [];
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    const data = JSON.parse(raw);
    if (Array.isArray(data)) return normalizePlayers(data);
    return [];
  } catch {
    return [];
  }
};

const normalizePlayers = (entries) =>
  entries.map((e) => ({
    id: e.id || `${Date.now()}`,
    playerName: e.playerName || e.name || "Unknown",
    best: typeof e.best === "number" ? e.best : Math.max(0, e.level ?? e.score ?? 0),
    games: typeof e.games === "number" ? e.games : 1,
    lastPlayed: e.lastPlayed || e.playedAt || new Date().toISOString(),
  }));

const writePlayers = (players) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2));
};

const sortPlayers = (players) =>
  [...players].sort(
    (a, b) => b.best - a.best || new Date(b.lastPlayed) - new Date(a.lastPlayed)
  );

app.get("/api/leaderboard", (_req, res) => {
  res.json(sortPlayers(readPlayers()).slice(0, 50));
});

app.post("/api/leaderboard", (req, res) => {
  const { playerName, floor } = req.body ?? {};
  if (!playerName || typeof playerName !== "string" || !playerName.trim()) {
    return res.status(400).json({ error: "playerName is required" });
  }
  if (typeof floor !== "number") {
    return res.status(400).json({ error: "floor must be a number" });
  }

  const key = playerName.toLowerCase().trim();
  const players = readPlayers();
  const idx = players.findIndex((p) => p.playerName.toLowerCase() === key);
  const now = new Date().toISOString();
  const clearedFloor = Math.max(0, Math.floor(floor));

  let entry;
  if (idx >= 0) {
    entry = players[idx];
    entry.best = Math.max(entry.best, clearedFloor);
    entry.games += 1;
    entry.lastPlayed = now;
  } else {
    entry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      playerName: playerName.trim().slice(0, 24),
      best: clearedFloor,
      games: 1,
      lastPlayed: now,
    };
    players.push(entry);
  }

  writePlayers(sortPlayers(players).slice(0, MAX_PLAYERS));
  res.status(201).json(entry);
});

app.listen(PORT, () => {
  console.log(`Leaderboard API running at http://localhost:${PORT}`);
});
