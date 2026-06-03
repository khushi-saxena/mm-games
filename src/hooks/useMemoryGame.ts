import { useCallback, useRef, useState } from "react";
import { DifficultyId, getDifficulty } from "../data/difficulty";
import { GamePhase, HauntedColorId, randomHauntedColor } from "../types/game";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export interface UseMemoryGameOptions {
  difficulty: DifficultyId;
  onColorLit?: (id: HauntedColorId, durationSec: number) => void;
}

export const useMemoryGame = ({ difficulty, onColorLit }: UseMemoryGameOptions) => {
  const [sequence, setSequence] = useState<HauntedColorId[]>([]);
  const [inputIndex, setInputIndex] = useState(0);
  const [phase, setPhase] = useState<GamePhase>("idle");
  const [active, setActive] = useState<HauntedColorId | null>(null);
  const [floor, setFloor] = useState(0);
  const [message, setMessage] = useState("Press start to enter the mansion");

  const tokenRef = useRef(0);
  const phaseRef = useRef(phase);
  const sequenceRef = useRef(sequence);
  const inputIndexRef = useRef(0);
  const floorRef = useRef(0);
  const difficultyRef = useRef(difficulty);

  difficultyRef.current = difficulty;
  phaseRef.current = phase;
  sequenceRef.current = sequence;
  floorRef.current = floor;

  const playSequence = useCallback(
    async (seq: HauntedColorId[]) => {
      const d = getDifficulty(difficultyRef.current);
      const myToken = ++tokenRef.current;
      setPhase("showing");
      setActive(null);
      setMessage("Watch the lights…");
      await sleep(d.introDelayMs);

      const flash = Math.max(d.flashMinMs, d.flashBaseMs - seq.length * d.flashDecayPerStep);
      const gap = Math.max(d.gapMinMs, d.gapBaseMs - seq.length * d.gapDecayPerStep);

      for (let i = 0; i < seq.length; i++) {
        if (tokenRef.current !== myToken) return;
        const c = seq[i];
        setActive(c);
        onColorLit?.(c, (flash / 1000) * 0.9);
        await sleep(flash);
        if (tokenRef.current !== myToken) return;
        setActive(null);
        await sleep(gap);
      }

      if (tokenRef.current !== myToken) return;
      setPhase("input");
      setInputIndex(0);
      inputIndexRef.current = 0;
      setMessage("Your turn — repeat the sequence");
    },
    [onColorLit]
  );

  const startGame = useCallback(() => {
    tokenRef.current++;
    setFloor(0);
    floorRef.current = 0;
    const seq = [randomHauntedColor()];
    setSequence(seq);
    sequenceRef.current = seq;
    void playSequence(seq);
  }, [playSequence]);

  const advanceFloor = useCallback(
    (currentSeq: HauntedColorId[]) => {
      const d = getDifficulty(difficultyRef.current);
      const newFloor = currentSeq.length;
      setFloor(newFloor);
      floorRef.current = newFloor;
      setPhase("showing");
      setMessage("Climbing higher…");
      const grown: HauntedColorId[] = [...currentSeq, randomHauntedColor()];
      setSequence(grown);
      sequenceRef.current = grown;
      setTimeout(() => void playSequence(grown), d.advanceDelayMs);
    },
    [playSequence]
  );

  const failGame = useCallback(() => {
    tokenRef.current++;
    setPhase("gameover");
    setActive(null);
    setMessage("The mansion claims you");
    return floorRef.current;
  }, []);

  const handlePress = useCallback(
    (id: HauntedColorId): "wrong" | "partial" | "cleared" => {
      if (phaseRef.current !== "input") return "wrong";

      const expected = sequenceRef.current[inputIndexRef.current];
      if (id !== expected) {
        failGame();
        return "wrong";
      }

      const next = inputIndexRef.current + 1;
      inputIndexRef.current = next;
      setInputIndex(next);

      if (next === sequenceRef.current.length) {
        advanceFloor(sequenceRef.current);
        return "cleared";
      }
      return "partial";
    },
    [advanceFloor, failGame]
  );

  const flashPress = useCallback((id: HauntedColorId) => {
    setActive(id);
    setTimeout(() => setActive((a) => (a === id ? null : a)), 170);
  }, []);

  return {
    sequence,
    inputIndex,
    phase,
    active,
    floor,
    message,
    startGame,
    handlePress,
    flashPress,
    failGame,
  };
};
