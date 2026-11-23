import type { SVGProps } from "react";

interface FolderIconProps extends SVGProps<SVGSVGElement> {
  /** Adds the subtle highlight line used on the large desktop icon. */
  highlight?: boolean;
}

export function FolderIcon({ highlight = false, ...props }: FolderIconProps) {
  return (
    <svg viewBox="0 0 64 52" aria-hidden="true" {...props}>
      <path
        className="folder-tab"
        d="M4 8a4 4 0 0 1 4-4h14l5 5h29a4 4 0 0 1 4 4v3H4z"
      />
      <rect
        className="folder-body"
        x="4"
        y="13"
        width="56"
        height="35"
        rx="4"
      />
      {highlight && (
        <rect x="4" y="13" width="56" height="1.5" fill="#fff" opacity=".45" />
      )}
    </svg>
  );
}
