"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export interface Track {
  title: string;
  artist: string;
  src: string;
  coverSrc: string;
  /** Shown until the file's real duration loads (seconds). */
  durationFallback: number;
}

/** The desktop player's playlist, in order. ⏮ / ⏭ move through it; it loops. */
export const TRACKS: readonly Track[] = [
  {
    title: "Feel The Rhythm",
    artist: "Orion, Kharmatic",
    src: "/music/feel-the-rhythm.mp3",
    coverSrc: "/img/feel-the-rhythm-cover.jpg",
    durationFallback: 208,
  },
  {
    title: "malibU",
    artist: "rusowsky",
    src: "/music/malibu.mp3",
    coverSrc: "/img/malibu-cover.jpg",
    durationFallback: 200,
  },
];

/** Pressing ⏮ after this many seconds restarts the song (like Apple Music) instead of going back. */
const RESTART_THRESHOLD = 3;

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
 * HTML5 Audio controller for the desktop Now Playing widget, with a small playlist.
 * Updates the progress fill and scrubber thumb directly via transforms inside
 * requestAnimationFrame (zero React re-render per frame); React state only
 * updates on play/pause, track change, or when the displayed second changes.
 */
export function useAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);
  const [displayTime, setDisplayTime] = useState(0);
  const [duration, setDuration] = useState<number>(TRACKS[0].durationFallback);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const thumbWrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef(0);
  const durationRef = useRef<number>(TRACKS[0].durationFallback);
  const lastSecondRef = useRef(-1);
  const scrubbingRef = useRef(false);

  const paintProgress = useCallback((ratio: number, seconds: number) => {
    const clamped = clamp01(ratio);
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${clamped})`;
    if (thumbWrapRef.current)
      thumbWrapRef.current.style.transform = `translateX(${clamped * 100}%)`;
    const floored = Math.floor(seconds);
    if (floored !== lastSecondRef.current) {
      lastSecondRef.current = floored;
      setDisplayTime(floored);
    }
  }, []);

  /** Switches to another song; keeps playing if `autoplay` (e.g. it was already playing). */
  const loadTrack = useCallback(
    (index: number, autoplay: boolean) => {
      const audio = audioRef.current;
      if (!audio) return;
      const next = (index + TRACKS.length) % TRACKS.length;
      trackRef.current = next;
      setTrackIndex(next);
      durationRef.current = TRACKS[next].durationFallback;
      setDuration(TRACKS[next].durationFallback);
      audio.src = TRACKS[next].src;
      audio.load();
      lastSecondRef.current = -1;
      paintProgress(0, 0);
      if (autoplay) void audio.play().catch(() => setIsPlaying(false));
    },
    [paintProgress],
  );

  useEffect(() => {
    const audio = new Audio(TRACKS[trackRef.current].src);
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
    // When a song ends, the next one starts (the playlist loops).
    const onEnded = () => loadTrack(trackRef.current + 1, true);

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
  }, [paintProgress, loadTrack]);

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
    if (audio.paused) void audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, []);

  /** ⏮: restart the song if it's a few seconds in, otherwise go to the previous one. */
  const previous = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.currentTime > RESTART_THRESHOLD) {
      audio.currentTime = 0;
      paintProgress(0, 0);
      return;
    }
    loadTrack(trackRef.current - 1, !audio.paused);
  }, [loadTrack, paintProgress]);

  /** ⏭: next song, keeping play/pause as it was. */
  const next = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    loadTrack(trackRef.current + 1, !audio.paused);
  }, [loadTrack]);

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
      if (audioRef.current) audioRef.current.currentTime = targetTime;
      paintProgress(clamped, targetTime);
    },
    [paintProgress],
  );

  const seekBy = useCallback(
    (deltaSeconds: number) => {
      const audio = audioRef.current;
      if (!audio) return;
      const total = durationRef.current || 1;
      const target = Math.min(
        total,
        Math.max(0, audio.currentTime + deltaSeconds),
      );
      audio.currentTime = target;
      paintProgress(target / total, target);
    },
    [paintProgress],
  );

  return {
    track: TRACKS[trackIndex],
    isPlaying,
    displayTime,
    duration,
    fillRef,
    thumbWrapRef,
    toggle,
    previous,
    next,
    previewScrub,
    commitScrub,
    seekBy,
  };
}
