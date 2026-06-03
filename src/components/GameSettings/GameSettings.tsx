import * as React from "react";
import { Palette, Gauge, Sun, Moon } from "lucide-react";
import styles from "./GameSettings.module.scss";
import { DifficultyId, DIFFICULTIES } from "../../data/difficulty";
import { themesForMode } from "../../data/themes";
import { ThemeMode } from "../../services/playerProgress";

interface GameSettingsProps {
  themeMode: ThemeMode;
  paletteId: string;
  difficulty: DifficultyId;
  settingsLocked: boolean;
  onThemeModeChange: (mode: ThemeMode) => void;
  onPaletteChange: (id: string) => void;
  onDifficultyChange: (id: DifficultyId) => void;
}

export const GameSettings = ({
  themeMode,
  paletteId,
  difficulty,
  settingsLocked,
  onThemeModeChange,
  onPaletteChange,
  onDifficultyChange,
}: GameSettingsProps) => {
  const palettes = themesForMode(themeMode);
  const activeDifficulty = DIFFICULTIES.find((d) => d.id === difficulty) ?? DIFFICULTIES[1];

  return (
    <div className={`${styles.settings} ${settingsLocked ? styles.locked : ""}`}>
      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <Palette size={16} />
          <span>Theme</span>
          <div className={styles.modeToggle}>
            <button
              type="button"
              className={themeMode === "dark" ? styles.modeActive : ""}
              disabled={settingsLocked}
              onClick={() => onThemeModeChange("dark")}
              title="Dark themes"
            >
              <Moon size={14} /> Dark
            </button>
            <button
              type="button"
              className={themeMode === "light" ? styles.modeActive : ""}
              disabled={settingsLocked}
              onClick={() => onThemeModeChange("light")}
              title="Light themes"
            >
              <Sun size={14} /> Light
            </button>
          </div>
        </div>
        <div className={styles.paletteGrid}>
          {palettes.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`${styles.paletteSwatch} ${paletteId === t.id ? styles.paletteActive : ""}`}
              disabled={settingsLocked}
              onClick={() => onPaletteChange(t.id)}
              title={t.name}
            >
              <span
                className={styles.swatchPreview}
                style={{ background: t.vars["--gold"], boxShadow: `0 0 12px ${t.vars["--gold"]}` }}
              />
              <span className={styles.swatchName}>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHead}>
          <Gauge size={16} />
          <span>Difficulty</span>
        </div>
        <div className={styles.difficultyRow}>
          {DIFFICULTIES.map((d) => (
            <button
              key={d.id}
              type="button"
              className={`${styles.diffBtn} ${difficulty === d.id ? styles.diffActive : ""}`}
              disabled={settingsLocked}
              onClick={() => onDifficultyChange(d.id)}
              title={d.description}
            >
              {d.label}
            </button>
          ))}
        </div>
        <p className={styles.diffHint}>{activeDifficulty.description}</p>
      </div>
    </div>
  );
};
