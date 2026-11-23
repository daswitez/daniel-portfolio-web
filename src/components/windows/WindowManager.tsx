"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import {
  COMPACT_BREAKPOINT,
  DEFAULT_FOLDER,
  WINDOW_DEFAULTS,
} from "@/config/navigation";
import { DEFAULT_SAFARI_PAGE } from "@/config/safari";
import { isCompactViewport } from "@/lib/text";
import type { SafariPageId } from "@/types/profile";
import type {
  FolderId,
  OpenTarget,
  WindowFrame,
  WindowKind,
  WindowState,
} from "@/types/windows";

/* ------------------------------------------------------------------ state */

interface WindowManagerState {
  windows: Partial<Record<WindowKind, WindowState>>;
  topZ: number;
  folder: FolderId;
  /** Desktop folder icon shown as selected (mirrors the last launcher used). */
  selectedFolder: FolderId | null;
  safari: { tabs: SafariPageId[]; active: SafariPageId };
}

type Action =
  | { type: "open"; target: OpenTarget; initialFrame: WindowFrame }
  | { type: "close"; kind: WindowKind }
  | { type: "focus"; kind: WindowKind }
  | { type: "toggleMaximize"; kind: WindowKind }
  | { type: "move"; kind: WindowKind; x: number; y: number }
  | { type: "setFolder"; folder: FolderId }
  | { type: "selectTab"; page: SafariPageId }
  | { type: "closeTab"; page: SafariPageId };

const initialState: WindowManagerState = {
  windows: {},
  topZ: 20,
  folder: DEFAULT_FOLDER,
  selectedFolder: null,
  safari: { tabs: [], active: DEFAULT_SAFARI_PAGE },
};

/** Opens (or focuses) a Safari tab, like Safari does for an already-open URL. */
function withSafariTab(
  state: WindowManagerState,
  page: SafariPageId,
): WindowManagerState {
  const tabs = state.safari.tabs.includes(page)
    ? state.safari.tabs
    : [...state.safari.tabs, page];
  return { ...state, safari: { tabs, active: page } };
}

function updateWindow(
  state: WindowManagerState,
  kind: WindowKind,
  patch: (w: WindowState) => Partial<WindowState>,
): WindowManagerState {
  const current = state.windows[kind];
  if (!current) return state;
  return {
    ...state,
    windows: { ...state.windows, [kind]: { ...current, ...patch(current) } },
  };
}

function reducer(
  state: WindowManagerState,
  action: Action,
): WindowManagerState {
  switch (action.type) {
    case "open": {
      const { kind } = action.target;
      const existing = state.windows[kind];
      const topZ = state.topZ + 1;
      const next: WindowState = existing
        ? {
            ...existing,
            isOpen: true,
            zIndex: topZ,
            openCount: existing.openCount + 1,
          }
        : {
            isOpen: true,
            isMaximized: false,
            zIndex: topZ,
            frame: action.initialFrame,
            openCount: 1,
          };
      const folder =
        action.target.kind === "finder"
          ? (action.target.folder ?? DEFAULT_FOLDER)
          : null;
      const opened: WindowManagerState = {
        ...state,
        topZ,
        windows: { ...state.windows, [kind]: next },
        folder: folder ?? state.folder,
        selectedFolder: folder,
      };
      if (action.target.kind !== "safari") return opened;
      // Reopening a closed window starts fresh; reopening an open one adds/focuses a tab.
      const base = existing?.isOpen
        ? opened
        : { ...opened, safari: { ...opened.safari, tabs: [] } };
      return withSafariTab(base, action.target.page ?? DEFAULT_SAFARI_PAGE);
    }
    case "selectTab":
      return withSafariTab(state, action.page);
    case "closeTab": {
      const { tabs, active } = state.safari;
      const index = tabs.indexOf(action.page);
      const remaining = tabs.filter((tab) => tab !== action.page);
      // Closing the last tab closes the window, as in Safari.
      if (remaining.length === 0) {
        return updateWindow(
          { ...state, safari: { ...state.safari, tabs: [] } },
          "safari",
          () => ({
            isOpen: false,
          }),
        );
      }
      const nextActive =
        active === action.page ? remaining[Math.max(0, index - 1)] : active;
      return { ...state, safari: { tabs: remaining, active: nextActive } };
    }
    case "close":
      return updateWindow(state, action.kind, () => ({ isOpen: false }));
    case "focus": {
      const current = state.windows[action.kind];
      if (!current || current.zIndex === state.topZ) return state;
      const topZ = state.topZ + 1;
      return {
        ...updateWindow(state, action.kind, () => ({ zIndex: topZ })),
        topZ,
      };
    }
    case "toggleMaximize":
      return updateWindow(state, action.kind, (w) => ({
        isMaximized: !w.isMaximized,
      }));
    case "move":
      return updateWindow(state, action.kind, (w) => ({
        frame: { ...w.frame, x: action.x, y: action.y },
      }));
    case "setFolder":
      return { ...state, folder: action.folder };
  }
}

/* ---------------------------------------------------------------- context */

interface WindowActions {
  open: (target: OpenTarget) => void;
  close: (kind: WindowKind) => void;
  focus: (kind: WindowKind) => void;
  toggleMaximize: (kind: WindowKind) => void;
  move: (kind: WindowKind, x: number, y: number) => void;
  setFolder: (folder: FolderId) => void;
  selectSafariTab: (page: SafariPageId) => void;
  closeSafariTab: (page: SafariPageId) => void;
  /** The desktop element windows are positioned and constrained within. */
  deskRef: RefObject<HTMLDivElement | null>;
}

// State and actions live in separate contexts so components that only open windows
// (buttons, icons) don't re-render whenever a window moves or gains focus.
const StateContext = createContext<WindowManagerState | null>(null);
const ActionsContext = createContext<WindowActions | null>(null);

function computeInitialFrame(
  kind: WindowKind,
  desk: HTMLElement | null,
  index: number,
): WindowFrame {
  const defaults = WINDOW_DEFAULTS[kind];
  const deskWidth = desk?.clientWidth ?? window.innerWidth;
  const deskHeight = desk?.clientHeight ?? window.innerHeight;
  const width = Math.min(defaults.width, deskWidth - 40);
  const height = Math.min(defaults.height, deskHeight - 160);
  return {
    width,
    height,
    // Cascade each new window slightly so they don't stack perfectly.
    x: Math.max(12, (deskWidth - width) / 2 + index * 30 - 30),
    y: Math.max(44, (deskHeight - height) / 2 - 30 + index * 24),
  };
}

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const deskRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const open = useCallback((target: OpenTarget) => {
    const desk = deskRef.current;
    if (!isCompactViewport(COMPACT_BREAKPOINT) && window.scrollY > 40) {
      desk?.scrollIntoView({ behavior: "smooth" });
    }
    const createdCount = Object.keys(stateRef.current.windows).length;
    dispatch({
      type: "open",
      target,
      initialFrame: computeInitialFrame(target.kind, desk, createdCount),
    });
  }, []);

  const actions = useMemo<WindowActions>(
    () => ({
      open,
      close: (kind) => dispatch({ type: "close", kind }),
      focus: (kind) => dispatch({ type: "focus", kind }),
      toggleMaximize: (kind) => dispatch({ type: "toggleMaximize", kind }),
      move: (kind, x, y) => dispatch({ type: "move", kind, x, y }),
      setFolder: (folder) => dispatch({ type: "setFolder", folder }),
      selectSafariTab: (page) => dispatch({ type: "selectTab", page }),
      closeSafariTab: (page) => dispatch({ type: "closeTab", page }),
      deskRef,
    }),
    [open],
  );

  // ⌘K / Ctrl+K opens the terminal from anywhere.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        open({ kind: "terminal" });
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <ActionsContext.Provider value={actions}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </ActionsContext.Provider>
  );
}

export function useWindowActions(): WindowActions {
  const ctx = useContext(ActionsContext);
  if (!ctx)
    throw new Error(
      "useWindowActions must be used inside <WindowManagerProvider>",
    );
  return ctx;
}

export function useWindowManagerState(): WindowManagerState {
  const ctx = useContext(StateContext);
  if (!ctx)
    throw new Error(
      "useWindowManagerState must be used inside <WindowManagerProvider>",
    );
  return ctx;
}

export function useWindowState(kind: WindowKind): WindowState | undefined {
  return useWindowManagerState().windows[kind];
}
