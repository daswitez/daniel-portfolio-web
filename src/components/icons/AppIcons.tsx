/* macOS-style app icons used by the desktop app launcher. */

const appFrame = (
  <>
    <rect width="52" height="52" rx="12" fill="#fff" />
    <rect
      x=".5"
      y=".5"
      width="51"
      height="51"
      rx="11.5"
      fill="none"
      stroke="rgba(0,0,0,.1)"
    />
  </>
);

export function FilesAppIcon() {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true">
      {appFrame}
      <path
        className="folder-tab"
        d="M10 17a3 3 0 0 1 3-3h9l3 3h14a3 3 0 0 1 3 3v2H10z"
      />
      <rect
        className="folder-body"
        x="10"
        y="20"
        width="32"
        height="20"
        rx="3"
      />
    </svg>
  );
}

/**
 * macOS Terminal: brushed-silver frame, black bezel, dark grey screen and a white
 * ">_" prompt in the top-left corner (matches the Sonoma icon).
 */
export function TerminalAppIcon() {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true">
      <defs>
        <linearGradient id="terminal-frame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f2f4f6" />
          <stop offset=".55" stopColor="#c4c8cd" />
          <stop offset="1" stopColor="#8b8f95" />
        </linearGradient>
        <linearGradient id="terminal-screen" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#333335" />
          <stop offset="1" stopColor="#262628" />
        </linearGradient>
      </defs>
      <rect width="52" height="52" rx="12" fill="url(#terminal-frame)" />
      <rect x="2" y="2" width="48" height="48" rx="10.5" fill="#050506" />
      <rect
        x="5.5"
        y="5.5"
        width="41"
        height="41"
        rx="7.5"
        fill="url(#terminal-screen)"
      />
      <path
        d="M11.5 12.5 18 16.6l-6.5 4.1"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="19.5" y="22.2" width="8" height="2.5" rx="1" fill="#fff" />
    </svg>
  );
}

export function SafariAppIcon() {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true">
      {appFrame}
      <circle cx="26" cy="26" r="19" fill="#0a84ff" />
      <circle
        cx="26"
        cy="26"
        r="16"
        fill="none"
        stroke="#fff"
        strokeWidth=".8"
        strokeDasharray="1 3"
        opacity=".8"
      />
      <path d="M33 19 28 28 19 33l5-9z" fill="#fff" />
      <path d="M33 19 24 24l4 4z" fill="#ff3b30" />
    </svg>
  );
}

export function NotesAppIcon() {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true">
      {appFrame}
      <path
        d="M0 12A12 12 0 0 1 12 0h28a12 12 0 0 1 12 12v4H0z"
        fill="#ffd60a"
      />
      <g stroke="#d6d6db" strokeWidth="1.4">
        <path d="M9 25h34M9 32h34M9 39h22" />
      </g>
    </svg>
  );
}

export function MailAppIcon() {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true">
      <rect width="52" height="52" rx="12" fill="#0a84ff" />
      <rect x="9" y="15" width="34" height="23" rx="3" fill="#fff" />
      <path
        d="M10 17l16 11 16-11"
        fill="none"
        stroke="#0a84ff"
        strokeWidth="2"
      />
    </svg>
  );
}

export function CodeAppIcon() {
  return (
    <svg viewBox="0 0 52 52" aria-hidden="true">
      <rect width="52" height="52" rx="12" fill="#1d1d1f" />
      <path
        d="M20 18l-8 8 8 8M32 18l8 8-8 8M28 15l-4 22"
        fill="none"
        stroke="#fff"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
