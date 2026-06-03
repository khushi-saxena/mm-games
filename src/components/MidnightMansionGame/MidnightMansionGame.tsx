import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Award,
  Crown,
  Ghost,
  Lock,
  Play,
  RotateCcw,
  Skull,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";
import styles from "./MidnightMansionGame.module.scss";
import { ACHIEVEMENTS } from "../../data/achievements";
import { HAUNTED_COLORS } from "../../data/hauntedColors";
import { themesForMode } from "../../data/themes";
import { useAudio } from "../../hooks/useAudio";
import { useMemoryGame } from "../../hooks/useMemoryGame";
import { fetchLeaderboard, submitRun } from "../../services/leaderboardApi";
import { GameSettings } from "../GameSettings";
import { DifficultyId } from "../../data/difficulty";
import { getTheme, themeToStyle } from "../../data/themes";
import {
  loadDifficulty,
  loadProgress,
  loadThemeSettings,
  saveDifficulty,
  saveProgress,
  saveThemeSettings,
  ThemeMode,
} from "../../services/playerProgress";
import { LeaderboardPlayer, PLAYER_NAME_KEY, PlayerProgress } from "../../types/game";

interface GameResult {
  floor: number;
  newBest: boolean;
  prev: number;
}

interface Toast {
  id: number;
  name: string;
  icon: React.ComponentType<{ size?: number }>;
}

const MidnightMansionGame = () => {
  const [name, setName] = useState(() => {
    const saved = localStorage.getItem(PLAYER_NAME_KEY) ?? localStorage.getItem("mm-player-name");
    return saved ?? "";
  });
  const [hasName, setHasName] = useState(() => {
    const saved = localStorage.getItem(PLAYER_NAME_KEY) ?? localStorage.getItem("mm-player-name");
    return !!saved;
  });
  const [nameDraft, setNameDraft] = useState("");
  const [themeSettings, setThemeSettings] = useState(loadThemeSettings);
  const [difficulty, setDifficulty] = useState<DifficultyId>(loadDifficulty);
  const [muted, setMuted] = useState(false);
  const [shake, setShake] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [burst, setBurst] = useState(0);
  const [board, setBoard] = useState<LeaderboardPlayer[]>([]);
  const [boardShared, setBoardShared] = useState(false);
  const [progress, setProgress] = useState<PlayerProgress>(loadProgress);
  const [result, setResult] = useState<GameResult | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const endGuardRef = useRef(false);
  const { pad, arpUp, fanfare, startSweep, buzz, tick, vibrate, ensureAudio } = useAudio(muted);

  const {
    phase,
    active,
    floor,
    message,
    startGame: startRound,
    handlePress,
    flashPress,
  } = useMemoryGame({
    difficulty,
    onColorLit: (id, dur) => pad(id, dur, "show"),
  });

  const activeTheme = getTheme(themeSettings.paletteId, themeSettings.mode);
  const settingsLocked = phase !== "idle" && phase !== "gameover";

  const loadBoard = useCallback(async () => {
    const { entries, shared } = await fetchLeaderboard();
    setBoard(entries);
    setBoardShared(shared);
  }, []);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  const addToast = (t: Omit<Toast, "id">) => {
    const id = Date.now() + Math.random();
    setToasts((ts) => [...ts, { ...t, id }]);
    setTimeout(() => setToasts((ts) => ts.filter((x) => x.id !== id)), 4200);
  };

  const setThemeMode = (mode: ThemeMode) => {
    const available = themesForMode(mode);
    const keep = available.find((t) => t.id === themeSettings.paletteId);
    const paletteId = keep?.id ?? available[0]?.id ?? (mode === "light" ? "manor" : "midnight");
    const next = { mode, paletteId };
    setThemeSettings(next);
    saveThemeSettings(next);
  };

  const setPalette = (paletteId: string) => {
    const next = { mode: themeSettings.mode, paletteId };
    setThemeSettings(next);
    saveThemeSettings(next);
  };

  const setDiff = (id: DifficultyId) => {
    setDifficulty(id);
    saveDifficulty(id);
  };

  const saveName = () => {
    const n = nameDraft.trim().slice(0, 18);
    if (!n) return;
    localStorage.setItem(PLAYER_NAME_KEY, n);
    setName(n);
    setHasName(true);
  };

  const endGame = useCallback(
    async (finalFloor: number) => {
      if (endGuardRef.current) return;
      endGuardRef.current = true;

      buzz();
      vibrate([60, 40, 90]);
      setShake(true);
      setTimeout(() => setShake(false), 500);

      const newRuns = progress.runs + 1;
      const newBest = Math.max(progress.best, finalFloor);
      const setIds = new Set(progress.achievements);
      const newly = ACHIEVEMENTS.filter((a) => !setIds.has(a.id) && a.test({ best: newBest, runs: newRuns }));
      newly.forEach((a) => setIds.add(a.id));
      const np: PlayerProgress = { best: newBest, runs: newRuns, achievements: [...setIds] };
      setProgress(np);
      saveProgress(np);

      if (name.trim()) {
        await submitRun({ playerName: name.trim(), floor: finalFloor });
        await loadBoard();
      }

      const isRunBest = finalFloor > progress.best && finalFloor > 0;
      if (isRunBest) {
        setBurst((b) => b + 1);
        fanfare();
      }
      newly.forEach((a, i) =>
        setTimeout(() => {
          addToast({ name: a.name, icon: a.icon });
          fanfare();
        }, 450 + i * 550)
      );

      setResult({ floor: finalFloor, newBest: isRunBest, prev: progress.best });
    },
    [buzz, fanfare, loadBoard, name, progress, vibrate]
  );

  useEffect(() => {
    if (phase !== "gameover") {
      endGuardRef.current = false;
      return;
    }
    void endGame(floor);
  }, [phase, floor, endGame]);

  const startGame = () => {
    endGuardRef.current = false;
    setResult(null);
    ensureAudio();
    startSweep();
    startRound();
  };

  const press = (id: (typeof HAUNTED_COLORS)[number]["id"]) => {
    if (phase !== "input") return;
    flashPress(id);
    pad(id, 0.2, "tap");
    vibrate(25);
    const outcome = handlePress(id);
    if (outcome === "cleared") {
      setPulse(true);
      setTimeout(() => setPulse(false), 350);
      arpUp();
    }
  };

  const myRank = board.findIndex((p) => p.playerName.toLowerCase() === name.toLowerCase()) + 1;
  const floorLabel = phase === "idle" ? "—" : floor;
  const unlocked = new Set(progress.achievements);

  return (
    <div className={styles.root} style={themeToStyle(activeTheme)}>
      <div className={styles.fog} />
      {[...Array(14)].map((_, i) => (
        <span
          key={i}
          className={styles.dust}
          style={{
            left: `${(i * 7 + 5) % 100}%`,
            bottom: 0,
            animationDuration: `${7 + (i % 5) * 2}s`,
            animationDelay: `${i * 1.3}s`,
          }}
        />
      ))}

      <div className={styles.wrap}>
        <div className={styles.topbar}>
          <button type="button" className={styles.iconbtn} onClick={() => setMuted((m) => !m)} title={muted ? "Unmute" : "Mute"}>
            {muted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>

        <h1 className={styles.title}>Midnight Mansion</h1>
        <p className={styles.sub}>Memorize the haunted lights. Climb floor by floor. Don&apos;t wake the dead.</p>

        <GameSettings
          themeMode={themeSettings.mode}
          paletteId={themeSettings.paletteId}
          difficulty={difficulty}
          settingsLocked={settingsLocked}
          onThemeModeChange={setThemeMode}
          onPaletteChange={setPalette}
          onDifficultyChange={setDiff}
        />
        {!boardShared && hasName && (
          <p className={styles.sub} style={{ marginTop: -12, fontSize: 14 }}>
            Run <code>npm run dev</code> for a shared Hall of Souls with coworkers.
          </p>
        )}

        <div className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.status}>{message}</div>
            <div className={`${styles.boardWrap} ${shake ? styles.shake : ""}`}>
              <div className={styles.pads}>
                {HAUNTED_COLORS.map((c) => {
                  const on = active === c.id;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      className={`${styles.pad} ${on ? styles.on : ""}`}
                      disabled={phase !== "input"}
                      onClick={() => press(c.id)}
                      onMouseEnter={() => phase === "input" && tick()}
                      style={{
                        background: on ? c.lit : c.base,
                        borderRadius: c.radius,
                        boxShadow: on
                          ? `0 0 38px 6px ${c.glow}, inset 0 0 30px rgba(255,255,255,.35)`
                          : "inset 0 0 30px rgba(0,0,0,.5)",
                      }}
                      aria-label={c.id}
                    />
                  );
                })}
              </div>
              <div className={`${styles.hub} ${pulse ? styles.pulse : ""}`}>
                <span className={styles.hubLabel}>Floor</span>
                <span className={styles.hubScore}>{floorLabel}</span>
              </div>
              {burst > 0 && (
                <div className={styles.emberWrap} key={burst}>
                  {[...Array(18)].map((_, i) => {
                    const a = (i / 18) * Math.PI * 2;
                    const d = 60 + Math.random() * 70;
                    return (
                      <span
                        key={i}
                        className={styles.ember}
                        style={
                          {
                            "--tx": `${Math.cos(a) * d}px`,
                            "--ty": `${Math.sin(a) * d}px`,
                          } as React.CSSProperties
                        }
                      />
                    );
                  })}
                </div>
              )}
            </div>

            <div className={styles.center}>
              {phase === "idle" || phase === "gameover" ? (
                <button type="button" className={styles.btn} onClick={startGame}>
                  {phase === "gameover" ? (
                    <>
                      <RotateCcw size={17} /> Descend again
                    </>
                  ) : (
                    <>
                      <Play size={17} /> Enter the mansion
                    </>
                  )}
                </button>
              ) : (
                <div className={styles.phaseHint}>
                  {phase === "showing" ? "The spirits are showing the way…" : "Repeat what you saw"}
                </div>
              )}
            </div>

            <div className={styles.pb}>
              Your deepest descent: <b>Floor {progress.best}</b>
              {myRank > 0 ? ` · ranked #${myRank}` : ""} · {progress.runs} run{progress.runs === 1 ? "" : "s"}
            </div>
          </div>

          <div className={styles.card}>
            <h3 className={styles.lbHead}>
              <Trophy size={20} /> Hall of Souls
            </h3>
            <p className={styles.lbNote}>
              {boardShared
                ? "Shared with everyone who plays — best floors visible to all your coworkers."
                : "Local only — start the API with npm run dev for a shared board."}
            </p>
            {board.length === 0 ? (
              <div className={styles.empty}>
                <Ghost size={26} style={{ opacity: 0.6 }} />
                <br />
                No souls recorded yet.
                <br />
                Be the first to descend.
              </div>
            ) : (
              board.slice(0, 12).map((p, i) => {
                const me = p.playerName.toLowerCase() === name.toLowerCase();
                const medal = i === 0 ? "#e8c45c" : i === 1 ? "#c8c8d0" : i === 2 ? "#cd7f32" : null;
                return (
                  <div key={p.id} className={`${styles.row} ${me ? styles.me : ""}`}>
                    <span className={styles.rank} style={medal ? { color: medal } : undefined}>
                      {i === 0 ? <Crown size={16} style={{ color: medal ?? undefined }} /> : i + 1}
                    </span>
                    <span className={styles.pname}>
                      {p.playerName}
                      {me ? " (you)" : ""}
                    </span>
                    <span className={styles.pgames}>
                      {p.games} {p.games === 1 ? "run" : "runs"}
                    </span>
                    <span className={styles.pscore}>Fl. {p.best}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className={`${styles.card} ${styles.relics}`}>
          <h3 className={styles.lbHead}>
            <Award size={20} /> Relics Unearthed
            <span className={styles.relicCount}>
              {unlocked.size}/{ACHIEVEMENTS.length}
            </span>
          </h3>
          <div className={styles.relicGrid}>
            {ACHIEVEMENTS.map((a) => {
              const got = unlocked.has(a.id);
              const Icon = got ? a.icon : Lock;
              return (
                <div key={a.id} className={`${styles.relic} ${got ? styles.got : ""}`} title={a.desc}>
                  <div className={styles.relicIcon}>
                    <Icon size={19} />
                  </div>
                  <div>
                    <div className={styles.relicName}>{a.name}</div>
                    <div className={styles.relicDesc}>{a.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className={styles.toasts}>
        {toasts.map((t) => {
          const Icon = t.icon;
          return (
            <div className={styles.toast} key={t.id}>
              <div className={styles.ti}>
                <Icon size={18} />
              </div>
              <div>
                <small>Relic unearthed</small>
                <b>{t.name}</b>
              </div>
            </div>
          );
        })}
      </div>

      {!hasName && (
        <div className={styles.overlay}>
          <div className={`${styles.modal} ${styles.card}`}>
            <Skull size={44} style={{ color: "var(--gold)", opacity: 0.9 }} />
            <h2>Who dares enter?</h2>
            <p>Your name is etched into the Hall of Souls.</p>
            <input
              className={styles.input}
              placeholder="Your name…"
              value={nameDraft}
              maxLength={18}
              autoFocus
              onChange={(e) => setNameDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") saveName();
              }}
            />
            <button type="button" className={styles.btn} onClick={saveName} style={{ width: "100%", justifyContent: "center" }}>
              Cross the threshold
            </button>
          </div>
        </div>
      )}

      {result && (
        <div className={styles.overlay} onClick={() => setResult(null)} role="presentation">
          <div className={`${styles.modal} ${styles.card}`} onClick={(e) => e.stopPropagation()} role="dialog">
            <Skull size={44} style={{ color: "#ff5c4d" }} />
            <div className={styles.ribbon} style={{ marginTop: 10 }}>
              {result.newBest ? "A new deepest descent" : "The mansion claims you"}
            </div>
            <div className={styles.big}>Floor {result.floor}</div>
            {result.newBest && <p style={{ color: "var(--gold)" }}>You sank deeper than ever before.</p>}
            <p style={{ marginTop: 4 }}>
              {myRank > 0 ? `You're ranked #${myRank} in the Hall of Souls.` : "Your name joins the Hall of Souls."}
            </p>
            <button
              type="button"
              className={styles.btn}
              onClick={() => {
                setResult(null);
                startGame();
              }}
              style={{ width: "100%", justifyContent: "center", marginTop: 14 }}
            >
              <RotateCcw size={17} /> Descend again
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MidnightMansionGame;
