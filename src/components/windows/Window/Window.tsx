"use client";

import { useCallback, useRef, type CSSProperties, type ReactNode } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/text";
import type { WindowKind } from "@/types/windows";
import { useWindowActions, useWindowState } from "../WindowManager";
import { useWindowDrag } from "./useWindowDrag";
import styles from "./Window.module.css";

interface WindowProps {
  kind: WindowKind;
  title: string;
  /** Dark chrome (terminal). */
  tone?: "default" | "dark";
  children: ReactNode;
}

/**
 * macOS-style window chrome: traffic lights, draggable title bar, maximize on
 * double-click. Stays mounted once created so its content keeps its state
 * (terminal history, game score) between open/close.
 */
export function Window({
  kind,
  title,
  tone = "default",
  children,
}: WindowProps) {
  const state = useWindowState(kind);
  const { close, focus, toggleMaximize, move, deskRef } = useWindowActions();
  const windowRef = useRef<HTMLElement>(null);
  const { t } = useI18n();

  const onDragEnd = useCallback(
    (x: number, y: number) => move(kind, x, y),
    [kind, move],
  );
  const onBarPointerDown = useWindowDrag({
    windowRef,
    boundsRef: deskRef,
    disabled: state?.isMaximized ?? false,
    onDragEnd,
  });

  if (!state) return null;

  const { frame } = state;
  const style = {
    "--win-x": `${frame.x}px`,
    "--win-y": `${frame.y}px`,
    "--win-w": `${frame.width}px`,
    "--win-h": `${frame.height}px`,
    zIndex: state.zIndex,
  } as CSSProperties;

  return (
    <section
      ref={windowRef}
      role="dialog"
      aria-label={title}
      hidden={!state.isOpen}
      className={cn(
        styles.window,
        tone === "dark" && styles.dark,
        state.isMaximized && styles.maximized,
      )}
      style={style}
      onPointerDown={() => focus(kind)}
    >
      <header
        className={styles.bar}
        onPointerDown={onBarPointerDown}
        onDoubleClick={(event) => {
          if (!(event.target as HTMLElement).closest("button"))
            toggleMaximize(kind);
        }}
      >
        <div className={styles.lights}>
          <button
            type="button"
            className={styles.close}
            aria-label={t.window.close}
            onClick={() => close(kind)}
          />
          <button
            type="button"
            className={styles.minimize}
            aria-label={t.window.minimize}
            onClick={() => close(kind)}
          />
          <button
            type="button"
            className={styles.zoom}
            aria-label={state.isMaximized ? t.window.restore : t.window.zoom}
            onClick={() => toggleMaximize(kind)}
          />
        </div>
        <span className={styles.title}>{title}</span>
      </header>
      <div className={styles.body}>{children}</div>
    </section>
  );
}
