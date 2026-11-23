"use client";

import dynamic from "next/dynamic";
import { useWindowManagerState } from "./WindowManager";

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

  return (
    <>
      {windows.finder && <FinderWindow />}
      {windows.terminal && <TerminalWindow />}
      {windows.safari && <SafariWindow />}
    </>
  );
}
