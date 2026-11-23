import type { SVGProps } from "react";

/** A .fig document (white page, folded corner) with the Figma logo, sized like FolderIcon. */
export function FigmaFileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 52" aria-hidden="true" {...props}>
      <path
        d="M16 1h22l12 12v36a2 2 0 0 1-2 2H16a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2z"
        fill="#fff"
        stroke="rgba(0,0,0,.18)"
      />
      <path
        d="M38 1v10a2 2 0 0 0 2 2h10"
        fill="#ececf0"
        stroke="rgba(0,0,0,.18)"
        strokeLinejoin="round"
      />
      <g transform="translate(23.3 15.5) scale(0.46)">
        <path d="M19 0H9.5a9.5 9.5 0 0 0 0 19H19z" fill="#F24E1E" />
        <path d="M19 0h9.5a9.5 9.5 0 0 1 0 19H19z" fill="#FF7262" />
        <path d="M9.5 19a9.5 9.5 0 0 0 0 19H19V19z" fill="#A259FF" />
        <circle cx="28.5" cy="28.5" r="9.5" fill="#1ABCFE" />
        <path d="M9.5 38a9.5 9.5 0 1 0 9.5 9.5V38z" fill="#0ACF83" />
      </g>
    </svg>
  );
}
