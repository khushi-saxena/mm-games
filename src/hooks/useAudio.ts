import { useCallback, useEffect, useRef } from "react";
import { COLOR_FREQ } from "../data/hauntedColors";
import { HauntedColorId } from "../types/game";

type PadSoundKind = "show" | "tap";

const PAD_TIMBRE: Record<
  HauntedColorId,
  { type: OscillatorType; harmonic: number; harmonicGain: number; noiseGain: number }
> = {
  crimson: { type: "square", harmonic: 1.5, harmonicGain: 0.1, noiseGain: 0.14 },
  emerald: { type: "triangle", harmonic: 2, harmonicGain: 0.08, noiseGain: 0.1 },
  sapphire: { type: "sine", harmonic: 2.5, harmonicGain: 0.07, noiseGain: 0.11 },
  amber: { type: "sawtooth", harmonic: 1.25, harmonicGain: 0.09, noiseGain: 0.13 },
};

export const useAudio = (muted: boolean) => {
  const mutedRef = useRef(muted);
  const audioRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    mutedRef.current = muted;
  }, [muted]);

  const ensureAudio = () => {
    try {
      if (!audioRef.current) {
        const Ctx =
          window.AudioContext ||
          (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioRef.current = new Ctx();
      }
      if (audioRef.current.state === "suspended") void audioRef.current.resume();
      return audioRef.current;
    } catch {
      return null;
    }
  };

  const note = useCallback(
    (freq: number, { dur = 0.3, type = "sine", gain = 0.2, when = 0 } = {}) => {
      if (mutedRef.current) return;
      const ctx = ensureAudio();
      if (!ctx) return;
      try {
        const t = ctx.currentTime + when;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = type as OscillatorType;
        osc.frequency.value = freq;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(gain, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
        osc.connect(g);
        g.connect(ctx.destination);
        osc.start(t);
        osc.stop(t + dur + 0.02);
      } catch {
        /* */
      }
    },
    []
  );

  const playNoiseThump = useCallback((ctx: AudioContext, freq: number, gain: number, dur: number) => {
    try {
      const len = Math.floor(ctx.sampleRate * dur);
      const buffer = ctx.createBuffer(1, len, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < len; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.12));
      }
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = freq;
      filter.Q.value = 1.2;
      const g = ctx.createGain();
      const t = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      src.connect(filter);
      filter.connect(g);
      g.connect(ctx.destination);
      src.start(t);
      src.stop(t + dur + 0.02);
    } catch {
      /* */
    }
  }, []);

  const pad = useCallback(
    (id: HauntedColorId, dur = 0.32, kind: PadSoundKind = "show") => {
      if (mutedRef.current) return;
      const ctx = ensureAudio();
      if (!ctx) return;

      const f = COLOR_FREQ[id];
      const timbre = PAD_TIMBRE[id];
      const isTap = kind === "tap";
      const mainDur = isTap ? 0.16 : dur;
      const mainGain = isTap ? 0.28 : 0.24;

      note(f, { dur: mainDur, type: timbre.type, gain: mainGain });
      note(f * timbre.harmonic, {
        dur: mainDur * 0.65,
        type: "triangle",
        gain: timbre.harmonicGain * (isTap ? 1.4 : 1),
        when: 0.01,
      });

      playNoiseThump(ctx, f * 1.2, timbre.noiseGain * (isTap ? 1.35 : 1), isTap ? 0.06 : 0.08);

      if (!isTap) {
        note(f * 0.5, { dur: 0.08, type: "sine", gain: 0.06, when: 0.02 });
      }
    },
    [note, playNoiseThump]
  );

  const arpUp = useCallback(
    () => [392, 494, 587, 784].forEach((f, i) => note(f, { dur: 0.18, type: "triangle", gain: 0.18, when: i * 0.07 })),
    [note]
  );

  const fanfare = useCallback(
    () => [523, 659, 784, 1046, 1318].forEach((f, i) => note(f, { dur: 0.28, type: "square", gain: 0.14, when: i * 0.09 })),
    [note]
  );

  const startSweep = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      const t = ctx.currentTime;
      o.type = "sawtooth";
      o.frequency.setValueAtTime(90, t);
      o.frequency.exponentialRampToValueAtTime(280, t + 0.5);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
      o.connect(g);
      g.connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.6);
    } catch {
      /* */
    }
  }, []);

  const buzz = useCallback(() => {
    if (mutedRef.current) return;
    const ctx = ensureAudio();
    if (!ctx) return;
    try {
      [130, 80].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        const t = ctx.currentTime + i * 0.18;
        o.type = "sawtooth";
        o.frequency.value = f;
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
        o.connect(g);
        g.connect(ctx.destination);
        o.start(t);
        o.stop(t + 0.36);
      });
    } catch {
      /* */
    }
  }, []);

  const tick = useCallback(() => note(900, { dur: 0.04, type: "square", gain: 0.05 }), [note]);

  const vibrate = (ms: number | number[]) => {
    try {
      navigator.vibrate?.(ms);
    } catch {
      /* */
    }
  };

  return { pad, arpUp, fanfare, startSweep, buzz, tick, vibrate, ensureAudio };
};
