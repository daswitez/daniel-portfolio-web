import type { ReactNode } from "react";

/*
 * Hand-drawn-looking stickers that pop up wherever the visitor clicks in the
 * playground. Thick dark outline + flat fill, like a sticker sheet.
 */

const OUTLINE = {
  stroke: "#1d1d1f",
  strokeWidth: 3,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

export type DoodleKind =
  | "cat"
  | "coffee"
  | "rocket"
  | "heart"
  | "star"
  | "bug"
  | "bolt"
  | "smile"
  | "sparkle";

export const DOODLES: Record<DoodleKind, ReactNode> = {
  cat: (
    <svg viewBox="0 0 64 64">
      <path
        d="M12 26 10 8l14 10a26 26 0 0 1 16 0L54 8l-2 18c3 4 4 8 4 12 0 12-11 20-24 20S8 50 8 38c0-4 1-8 4-12Z"
        fill="#ffb347"
        {...OUTLINE}
      />
      <circle cx="24" cy="36" r="3" fill="#1d1d1f" />
      <circle cx="40" cy="36" r="3" fill="#1d1d1f" />
      <path d="m29 43 3 2 3-2" fill="none" {...OUTLINE} strokeWidth={2.5} />
      <path
        d="M6 40h10M7 46l9-3M58 40H48M57 46l-9-3"
        fill="none"
        {...OUTLINE}
        strokeWidth={2}
      />
    </svg>
  ),
  coffee: (
    <svg viewBox="0 0 64 64">
      <path
        d="M12 26h34v14a14 14 0 0 1-14 14h-6a14 14 0 0 1-14-14Z"
        fill="#c98b5a"
        {...OUTLINE}
      />
      <path d="M46 30h4a6 6 0 0 1 0 12h-5" fill="none" {...OUTLINE} />
      <path
        d="M22 8c-3 4 3 6 0 10M32 8c-3 4 3 6 0 10"
        fill="none"
        {...OUTLINE}
        strokeWidth={2.5}
      />
    </svg>
  ),
  rocket: (
    <svg viewBox="0 0 64 64">
      <path
        d="M32 6c10 8 14 20 12 34H20C18 26 22 14 32 6Z"
        fill="#e9eef5"
        {...OUTLINE}
      />
      <circle
        cx="32"
        cy="24"
        r="5"
        fill="#2997ff"
        {...OUTLINE}
        strokeWidth={2.5}
      />
      <path d="m20 32-8 10 9-1M44 32l8 10-9-1" fill="#ff5f57" {...OUTLINE} />
      <path d="M26 44c0 6 3 10 6 14 3-4 6-8 6-14" fill="#ffd60a" {...OUTLINE} />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 64 64">
      <path
        d="M32 54S8 40 8 24a12 12 0 0 1 24-4 12 12 0 0 1 24 4c0 16-24 30-24 30Z"
        fill="#ff5fa2"
        {...OUTLINE}
      />
      <path
        d="M18 22a6 6 0 0 1 6-5"
        fill="none"
        stroke="#fff"
        strokeWidth={3}
        strokeLinecap="round"
      />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 64 64">
      <path
        d="m32 6 7.6 16.4L57 24.6 44 37l3.2 18L32 46.4 16.8 55 20 37 7 24.6l17.4-2.2Z"
        fill="#ffd60a"
        {...OUTLINE}
      />
    </svg>
  ),
  bug: (
    <svg viewBox="0 0 64 64">
      <path
        d="M14 24 6 18M14 36H4M14 46l-8 6M50 24l8-6M50 36h10M50 46l8 6"
        fill="none"
        {...OUTLINE}
      />
      <ellipse cx="32" cy="38" rx="18" ry="20" fill="#30d158" {...OUTLINE} />
      <path d="M32 18v40" fill="none" {...OUTLINE} strokeWidth={2.5} />
      <circle cx="32" cy="16" r="8" fill="#1d1d1f" />
      <circle cx="24" cy="34" r="3" fill="#1d1d1f" />
      <circle cx="40" cy="44" r="3" fill="#1d1d1f" />
    </svg>
  ),
  bolt: (
    <svg viewBox="0 0 64 64">
      <path d="M36 4 12 36h16l-4 24 26-34H34Z" fill="#ffd60a" {...OUTLINE} />
    </svg>
  ),
  smile: (
    <svg viewBox="0 0 64 64">
      <circle cx="32" cy="32" r="24" fill="#5ac8fa" {...OUTLINE} />
      <circle cx="24" cy="27" r="3" fill="#1d1d1f" />
      <circle cx="40" cy="27" r="3" fill="#1d1d1f" />
      <path d="M21 37c6 8 16 8 22 0" fill="none" {...OUTLINE} />
    </svg>
  ),
  sparkle: (
    <svg viewBox="0 0 64 64">
      <path
        d="M32 4c2 14 6 22 24 28-18 6-22 14-24 28-2-14-6-22-24-28 18-6 22-14 24-28Z"
        fill="#bf5af2"
        {...OUTLINE}
      />
    </svg>
  ),
};

/** The cat shows up more often than the rest — it's the mascot. */
const WEIGHTED: DoodleKind[] = [
  "cat",
  "cat",
  "cat",
  "coffee",
  "rocket",
  "heart",
  "star",
  "bug",
  "bolt",
  "smile",
  "sparkle",
];

export function randomDoodle(): DoodleKind {
  return WEIGHTED[Math.floor(Math.random() * WEIGHTED.length)];
}
