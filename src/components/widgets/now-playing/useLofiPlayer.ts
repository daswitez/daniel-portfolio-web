"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export const FEATURED_TRACK = {
  title: "Feel The Rhythm",
  artist: "Orion, Kharmatic",
  src: "/music/feel-the-rhythm.mp3",
  coverSrc: "/img/feel-the-rhythm-cover.jpg",
  /** Printed on the vinyl label (3:28); replaced automatically once metadata loads. */
  durationFallback: 208,
} as const;

export function formatTime(totalSeconds: number): string {
  const safe = Math.max(
    0,
    Math.floor(Number.isFinite(totalSeconds) ? totalSeconds : 0),
  );
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

/**
 * HTML5 Audio controller for the desktop Now Playing widget.
 * Updates the progress fill and scrubber thumb directly via transforms inside
 * requestAnimationFrame (zero React re-render per frame); React state only
 * updates on play/pause or when the displayed integer second changes.
 */
export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayTime, setDisplayTime] = useState(0);
  const [duration, setDuration] = useState<number>(
    FEATURED_TRACK.durationFallback,
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const thumbWrapRef = useRef<HTMLDivElement>(null);
  const durationRef = useRef<number>(FEATURED_TRACK.durationFallback);
  const lastSecondRef = useRef(-1);
  const scrubbingRef = useRef(false);

  const paintProgress = useCallback((ratio: number, seconds: number) => {
    const clamped = clamp01(ratio);
    if (fillRef.current) {
      fillRef.current.style.transform = `scaleX(${clamped})`;
    }
    if (thumbWrapRef.current) {
      thumbWrapRef.current.style.transform = `translateX(${clamped * 100}%)`;
    }
    const floored = Math.floor(seconds);
    if (floored !== lastSecondRef.current) {
      lastSecondRef.current = floored;
      setDisplayTime(floored);
    }
  }, []);

  useEffect(() => {
    const audio = new Audio(encodeURI(FEATURED_TRACK.src));
    audio.preload = "metadata";
    audioRef.current = audio;

    const syncDuration = () => {
      if (Number.isFinite(audio.duration) && audio.duration > 0) {
        durationRef.current = audio.duration;
        setDuration(audio.duration);
      }
    };

    const onTimeUpdate = () => {
      if (scrubbingRef.current) return;
      const total = durationRef.current || 1;
      paintProgress(audio.currentTime / total, audio.currentTime);
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      audio.currentTime = 0;
      paintProgress(0, 0);
      setIsPlaying(false);
    };

    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnded);
      audio.src = "";
      audioRef.current = null;
    };
  }, [paintProgress]);

  // 60fps GPU-composited progress sweep while playing.
  useEffect(() => {
    if (!isPlaying) return;
    let raf = 0;

    const tick = () => {
      const audio = audioRef.current;
      if (audio && !scrubbingRef.current) {
        const total = durationRef.current || 1;
        paintProgress(audio.currentTime / total, audio.currentTime);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [isPlaying, paintProgress]);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, []);

  const restart = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    paintProgress(0, 0);
  }, [paintProgress]);

  const replay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = 0;
    paintProgress(0, 0);
    void audio.play().catch(() => setIsPlaying(false));
  }, [paintProgress]);

  const previewScrub = useCallback(
    (ratio: number) => {
      scrubbingRef.current = true;
      const clamped = clamp01(ratio);
      paintProgress(clamped, clamped * durationRef.current);
    },
    [paintProgress],
  );

  const commitScrub = useCallback(
    (ratio: number) => {
      scrubbingRef.current = false;
      const clamped = clamp01(ratio);
      const targetTime = clamped * durationRef.current;
      if (audioRef.current) {
        audioRef.current.currentTime = targetTime;
      }
      paintProgress(clamped, targetTime);
    },
    [paintProgress],
  );

  const seekBy = useCallback(
    (deltaSeconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const total = durationRef.current || 1;
      const next = Math.min(
        total,
        Math.max(0, audio.currentTime + deltaSeconds),
      );
      audio.currentTime = next;
      paintProgress(next / total, next);
    },
    [paintProgress],
  );

  return {
    isPlaying,
    displayTime,
    duration,
    fillRef,
    thumbWrapRef,
    toggle,
    restart,
    replay,
    previewScrub,
    commitScrub,
    seekBy,
  };
}
