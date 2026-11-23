import type { FolderId, WindowKind } from "@/types/windows";

export interface FolderConfig {
  id: FolderId;
}

/** Desktop folders — shared by the desktop icons, the Finder sidebar and the terminal. Names live in the dictionary (`t.folders`). */
export const FOLDERS: readonly FolderConfig[] = [
  { id: "experience" },
  { id: "projects" },
  { id: "stack" },
  { id: "about" },
  { id: "contact" },
];

export const DEFAULT_FOLDER: FolderId = "experience";

export function getFolder(id: FolderId): FolderConfig {
  return FOLDERS.find((folder) => folder.id === id) ?? FOLDERS[0];
}

export type DockIconName =
  "home" | "user" | "briefcase" | "grid" | "code" | "mail";

export type SectionId =
  "home" | "hi" | "offer" | "process" | "why-me" | "contact";

export interface DockItem {
  sectionId: SectionId;
  icon: DockIconName;
}

/** Page sections, in scroll order. Drives the dock nav and its active state. Labels: `t.nav`. */
export const DOCK_ITEMS: readonly DockItem[] = [
  { sectionId: "home", icon: "home" },
  { sectionId: "hi", icon: "user" },
  { sectionId: "offer", icon: "grid" },
  { sectionId: "process", icon: "code" },
  { sectionId: "why-me", icon: "briefcase" },
  { sectionId: "contact", icon: "mail" },
];

export interface WindowDefaults {
  width: number;
  height: number;
}

export const WINDOW_DEFAULTS: Record<WindowKind, WindowDefaults> = {
  finder: { width: 780, height: 500 },
  terminal: { width: 660, height: 430 },
  safari: { width: 880, height: 560 },
};

/** Below this width the desktop collapses into a stacked layout and windows go full-screen. */
export const COMPACT_BREAKPOINT = 900;
