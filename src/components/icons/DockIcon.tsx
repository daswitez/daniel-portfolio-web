import type { ReactNode } from "react";
import type { DockIconName } from "@/config/navigation";

/*
 * macOS-style app icons: a squircle with a vertical gradient, a soft top gloss,
 * a hairline inner edge and a white glyph — the language of Home, Mail, Xcode…
 */

interface IconSpec {
  from: string;
  to: string;
  glyph: ReactNode;
}

const W = "#fff";

const ICONS: Record<DockIconName, IconSpec> = {
  // Home app: warm yellow → orange, solid white house.
  home: {
    from: "#FFD84D",
    to: "#FF9500",
    glyph: (
      <path
        fill={W}
        d="M32 15.5 13.8 30.2a2 2 0 0 0 2.5 3.1l1.7-1.4V46a3 3 0 0 0 3 3h7.5v-9.5h7V49H43a3 3 0 0 0 3-3V31.9l1.7 1.4a2 2 0 1 0 2.5-3.1Z"
      />
    ),
  },
  // Contacts / default avatar: graphite with a white silhouette.
  user: {
    from: "#A1A1A6",
    to: "#636366",
    glyph: (
      <>
        <circle cx="32" cy="25" r="8.5" fill={W} />
        <path
          fill={W}
          d="M16.5 48.5c1.6-8.2 8-12.6 15.5-12.6s13.9 4.4 15.5 12.6a1.6 1.6 0 0 1-1.6 1.9H18.1a1.6 1.6 0 0 1-1.6-1.9Z"
        />
      </>
    ),
  },
  // Briefcase: leather brown, cream case.
  briefcase: {
    from: "#C69B72",
    to: "#86603F",
    glyph: (
      <>
        <path
          fill="none"
          stroke="#FFF4E6"
          strokeWidth="3"
          d="M25.5 22v-2.5a3 3 0 0 1 3-3h7a3 3 0 0 1 3 3V22"
        />
        <rect x="14" y="22" width="36" height="25" rx="4.5" fill="#FFF4E6" />
        <path fill="#E7CFB2" d="M14 32.5h36v3H14z" />
        <rect x="29" y="31" width="6" height="6" rx="1.5" fill="#B58A62" />
      </>
    ),
  },
  // App Library: white tile with four coloured app squircles.
  grid: {
    from: "#FFFFFF",
    to: "#E5E5EA",
    glyph: (
      <>
        <rect x="15" y="15" width="15" height="15" rx="4.2" fill="#0A84FF" />
        <rect x="34" y="15" width="15" height="15" rx="4.2" fill="#30D158" />
        <rect x="15" y="34" width="15" height="15" rx="4.2" fill="#FF9F0A" />
        <rect x="34" y="34" width="15" height="15" rx="4.2" fill="#FF375F" />
      </>
    ),
  },
  // Developer tool: indigo → blue with white code brackets.
  code: {
    from: "#6E6BFF",
    to: "#0A6CFF",
    glyph: (
      <path
        fill="none"
        stroke={W}
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M24 22 14 32l10 10M40 22l10 10-10 10M35 17l-6 30"
      />
    ),
  },
  // Mail: sky → blue with a white envelope.
  mail: {
    from: "#5AC8FA",
    to: "#007AFF",
    glyph: (
      <>
        <rect x="12" y="19" width="40" height="27" rx="4.5" fill={W} />
        <path
          fill="none"
          stroke="#2A8CFF"
          strokeWidth="2.6"
          strokeLinejoin="round"
          d="m14 22 18 13 18-13"
        />
      </>
    ),
  },
};

export function DockIcon({ name }: { name: DockIconName }) {
  const { from, to, glyph } = ICONS[name];
  const bg = `dock-${name}-bg`;
  const gloss = `dock-${name}-gloss`;

  return (
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <linearGradient id={bg} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={from} />
          <stop offset="1" stopColor={to} />
        </linearGradient>
        <linearGradient id={gloss} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity=".38" />
          <stop offset=".5" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* ~22.5% corner radius approximates Apple's continuous-corner squircle */}
      <rect width="64" height="64" rx="14.5" fill={`url(#${bg})`} />
      <rect width="64" height="64" rx="14.5" fill={`url(#${gloss})`} />
      {glyph}
      <rect
        x=".5"
        y=".5"
        width="63"
        height="63"
        rx="14"
        fill="none"
        stroke="rgba(0,0,0,.12)"
      />
    </svg>
  );
}
