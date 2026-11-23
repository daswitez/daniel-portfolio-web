import type { SafariPageId } from "./profile";

export type WindowKind = "finder" | "terminal" | "safari";

export type FolderId =
  "experience" | "projects" | "stack" | "about" | "contact";

/** What a launcher (icon, button, terminal command) asks the window manager to open. */
export type OpenTarget =
  | { kind: "finder"; folder?: FolderId }
  | { kind: "terminal" }
  | { kind: "safari"; page?: SafariPageId };

export interface WindowFrame {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface WindowState {
  isOpen: boolean;
  isMaximized: boolean;
  zIndex: number;
  frame: WindowFrame;
  /** Bumps every time the window is (re)opened, so windows can react (e.g. focus an input). */
  openCount: number;
}
