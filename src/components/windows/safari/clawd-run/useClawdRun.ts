"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import {
  ClawdRunEngine,
  type EngineLabels,
  type HudState,
  type RunResult,
} from "./engine";

export type RunPhase = "idle" | "playing" | "paused" | "ended";

export interface ClawdRunController {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  hud: HudState;
  phase: RunPhase;
  result: RunResult | null;
  start: () => void;
  resume: () => void;
  /** Keyboard handler for the focusable game area (keys only work while it has focus). */
  onKeyDown: (event: React.KeyboardEvent) => void;
  onKeyUp: (event: React.KeyboardEvent) => void;
  /** Pointer on the canvas: press = jump (or start), release = end of a held jump. */
  onPointerDown: (event: React.PointerEvent) => void;
  onPointerUp: () => void;
  setDuck: (on: boolean) => void;
  /** Pause when the game area loses focus. */
  onBlur: () => void;
}

interface Options {
  /** The game tab is the one on screen and the window is open. */
  active: boolean;
  /** The game tab exists (so the canvas is in the DOM). */
  mounted: boolean;
  labels: EngineLabels;
}

const JUMP_KEYS = new Set([" ", "ArrowUp", "w", "W"]);
const DUCK_KEYS = new Set(["ArrowDown", "s", "S"]);

/** Wires the Clawd Run engine to React: lifecycle, resize, input, HUD and best score. */
export function useClawdRun({
  active,
  mounted,
  labels,
}: Options): ClawdRunController {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<ClawdRunEngine | null>(null);
  const phaseRef = useRef<RunPhase>("idle");
  const [hud, setHud] = useState<HudState>({
    score: 0,
    best: 0,
    tokens: 0,
    combo: 0,
    shield: false,
  });
  const [phase, setPhaseState] = useState<RunPhase>("idle");
  const [result, setResult] = useState<RunResult | null>(null);

  const setPhase = useCallback((next: RunPhase) => {
    phaseRef.current = next;
    setPhaseState(next);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const engine = new ClawdRunEngine(
      canvas,
      Number(storage.get(STORAGE_KEYS.clawdRunBest)) || 0,
      {
        onHud: setHud,
        onEnd: (run) => {
          storage.set(STORAGE_KEYS.clawdRunBest, String(run.best));
          setResult(run);
          setPhase("ended");
        },
      },
    );
    engineRef.current = engine;

    const observer = new ResizeObserver(([entry]) => {
      engine.resize(entry.contentRect.width, entry.contentRect.height);
    });
    observer.observe(container);

    return () => {
      observer.disconnect();
      engine.destroy();
      engineRef.current = null;
      if (phaseRef.current === "playing" || phaseRef.current === "paused")
        setPhase("idle");
    };
    // Re-runs when the game tab (and so the canvas) appears or disappears.
  }, [mounted, setPhase]);

  // Texts drawn on the canvas follow the current language.
  useEffect(() => {
    if (engineRef.current) engineRef.current.labels = labels;
  }, [labels, mounted]);

  const pause = useCallback(() => {
    if (phaseRef.current !== "playing") return;
    engineRef.current?.pause();
    setPhase("paused");
  }, [setPhase]);

  // Pause when the tab is switched or the window closed.
  useEffect(() => {
    if (!active) pause();
  }, [active, pause]);

  const start = useCallback(() => {
    setResult(null);
    engineRef.current?.start();
    setPhase("playing");
  }, [setPhase]);

  const resume = useCallback(() => {
    engineRef.current?.resume();
    setPhase("playing");
  }, [setPhase]);

  const onKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      const current = phaseRef.current;
      const engine = engineRef.current;
      if (!engine) return;
      if (JUMP_KEYS.has(event.key) || event.key === "Enter") {
        event.preventDefault();
        if (event.repeat) return;
        if (current === "playing") engine.jumpPress();
        else if (current === "paused") resume();
        else start();
      } else if (DUCK_KEYS.has(event.key)) {
        event.preventDefault();
        if (current === "playing") engine.setDuck(true);
      } else if (
        event.key === "p" ||
        event.key === "P" ||
        event.key === "Escape"
      ) {
        event.preventDefault();
        if (current === "playing") pause();
        else if (current === "paused") resume();
      }
    },
    [pause, resume, start],
  );

  const onKeyUp = useCallback((event: React.KeyboardEvent) => {
    const engine = engineRef.current;
    if (!engine) return;
    if (JUMP_KEYS.has(event.key)) engine.jumpRelease();
    else if (DUCK_KEYS.has(event.key)) engine.setDuck(false);
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent) => {
      if (event.button !== 0) return;
      const current = phaseRef.current;
      if (current === "playing") engineRef.current?.jumpPress();
      else if (current === "paused") resume();
      else start();
    },
    [resume, start],
  );

  const onPointerUp = useCallback(() => engineRef.current?.jumpRelease(), []);
  const setDuck = useCallback(
    (on: boolean) => engineRef.current?.setDuck(on),
    [],
  );

  return {
    canvasRef,
    hud,
    phase,
    result,
    start,
    resume,
    onKeyDown,
    onKeyUp,
    onPointerDown,
    onPointerUp,
    setDuck,
    onBlur: pause,
  };
}
