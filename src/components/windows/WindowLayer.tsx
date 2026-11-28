"use client";

import dynamic from "next/dynamic";
import type { WindowKind } from "@/types/windows";
import windowStyles from "./Window/Window.module.css";
import { useWindowActions, useWindowManagerState } from "./WindowManager";

// Windows are code-split: their JS (terminal, canvas game) only loads the first
// time a visitor opens them.
const FinderWindow = dynamic(() =>
  import("./finder/FinderWindow").then((m) => m.FinderWindow),
);
const TerminalWindow = dynamic(() =>
  import("./terminal/TerminalWindow").then((m) => m.TerminalWindow),
);
const SafariWindow = dynamic(() =>
  import("./safari/SafariWindow").then((m) => m.SafariWindow),
);

export function WindowLayer() {
  const { windows } = useWindowManagerState();
  const { close } = useWindowActions();

  // The front-most open window: tapping the scrim closes it, like a sheet.
  let top: WindowKind | null = null;
  for (const [kind, state] of Object.entries(windows) as Array<
    [WindowKind, NonNullable<(typeof windows)[WindowKind]>]
  >) {
    if (state.isOpen && (!top || state.zIndex > windows[top]!.zIndex))
      top = kind;
  }

  return (
    <>
      {/* Phones only (see CSS): dims the desk so the open window reads as the one thing on screen. */}
      {top && (
        <div
          className={windowStyles.scrim}
          aria-hidden="true"
          onClick={() => top && close(top)}
        />
      )}
      {windows.finder && <FinderWindow />}
      {windows.terminal && <TerminalWindow />}
      {windows.safari && <SafariWindow />}
    </>
  );
}
