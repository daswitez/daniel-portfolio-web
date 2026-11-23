"use client";

import type { ReactNode } from "react";
import { WindowLayer } from "@/components/windows/WindowLayer";
import { useWindowActions } from "@/components/windows/WindowManager";
import styles from "./Desktop.module.css";

/**
 * The desktop area of the hero. Client boundary only because the window manager
 * needs a ref to it; its children can stay server components.
 */
export function DesktopSurface({ children }: { children: ReactNode }) {
  const { deskRef } = useWindowActions();

  return (
    <div ref={deskRef} className={styles.desk} data-desk>
      {children}
      <WindowLayer />
    </div>
  );
}
