/* Small UI glyphs: theme toggle, media controls, padlock. */

export function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </svg>
  );
}

export function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M20.5 14.6A8.5 8.5 0 0 1 9.4 3.5a8.5 8.5 0 1 0 11.1 11.1z" />
    </svg>
  );
}

/** SF Symbols "backward.fill": two rounded triangles. */
export function PreviousIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <path
        d="M9.2 1.6 1.9 6.2a1 1 0 0 0 0 1.6l7.3 4.6c.7.4 1.5 0 1.5-.8V2.4c0-.8-.8-1.2-1.5-.8Zm8.9 0-7.3 4.6a1 1 0 0 0 0 1.6l7.3 4.6c.7.4 1.5 0 1.5-.8V2.4c0-.8-.8-1.2-1.5-.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** SF Symbols "forward.fill": two rounded triangles. */
export function NextIcon() {
  return (
    <svg width="20" height="14" viewBox="0 0 20 14" aria-hidden="true">
      <path
        d="m10.8 1.6 7.3 4.6a1 1 0 0 1 0 1.6l-7.3 4.6c-.7.4-1.5 0-1.5-.8V2.4c0-.8.8-1.2 1.5-.8Zm-8.9 0 7.3 4.6a1 1 0 0 1 0 1.6l-7.3 4.6c-.7.4-1.5 0-1.5-.8V2.4c0-.8.8-1.2 1.5-.8Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** SF Symbols "play.fill". */
export function PlayIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true">
      <path
        d="M3.5 1.6c-1-.6-2.2.1-2.2 1.3v14.2c0 1.2 1.2 1.9 2.2 1.3l12-7.1c1-.6 1-2 0-2.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** SF Symbols "pause.fill". */
export function PauseIcon() {
  return (
    <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true">
      <rect x="2" y="1.5" width="5" height="17" rx="1.4" fill="currentColor" />
      <rect x="11" y="1.5" width="5" height="17" rx="1.4" fill="currentColor" />
    </svg>
  );
}

export function LockIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 10 12" aria-hidden="true" {...props}>
      <rect x="1" y="5" width="8" height="7" rx="1.5" fill="currentColor" />
      <path
        d="M3 5V3.5a2 2 0 0 1 4 0V5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
      />
    </svg>
  );
}

export function GlobeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      aria-hidden="true"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </svg>
  );
}

export function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      <path d="M3.5 8.5l3 3 6-7" />
    </svg>
  );
}
