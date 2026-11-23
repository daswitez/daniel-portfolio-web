"use client";

import {
  useCallback,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { COMPACT_BREAKPOINT } from "@/config/navigation";
import { isCompactViewport } from "@/lib/text";

interface DragOptions {
  windowRef: RefObject<HTMLElement | null>;
  boundsRef: RefObject<HTMLElement | null>;
  disabled: boolean;
  onDragEnd: (x: number, y: number) => void;
}

/**
 * Drags a window by its title bar. While dragging it writes CSS variables straight
 * to the element (no React re-render per pointermove) and commits the final
 * position to state once on release.
 */
export function useWindowDrag({
  windowRef,
  boundsRef,
  disabled,
  onDragEnd,
}: DragOptions) {
  return useCallback(
    (event: ReactPointerEvent<HTMLElement>) => {
      const win = windowRef.current;
      const bounds = boundsRef.current;
      if (!win || !bounds || disabled || event.button !== 0) return;
      if ((event.target as HTMLElement).closest("button")) return;
      if (isCompactViewport(COMPACT_BREAKPOINT)) return;

      const bar = event.currentTarget;
      const offsetX = event.clientX - win.offsetLeft;
      const offsetY = event.clientY - win.offsetTop;
      let x = win.offsetLeft;
      let y = win.offsetTop;

      bar.setPointerCapture(event.pointerId);
      bar.dataset.dragging = "true";

      const onMove = (e: PointerEvent) => {
        // Keep at least 90px of the window on screen horizontally, and the bar below the menubar.
        x = Math.min(
          bounds.clientWidth - 90,
          Math.max(90 - win.offsetWidth, e.clientX - offsetX),
        );
        y = Math.min(
          bounds.clientHeight - 60,
          Math.max(32, e.clientY - offsetY),
        );
        win.style.setProperty("--win-x", `${x}px`);
        win.style.setProperty("--win-y", `${y}px`);
      };
      const onUp = () => {
        delete bar.dataset.dragging;
        bar.removeEventListener("pointermove", onMove);
        bar.removeEventListener("pointerup", onUp);
        bar.removeEventListener("pointercancel", onUp);
        onDragEnd(x, y);
      };

      bar.addEventListener("pointermove", onMove);
      bar.addEventListener("pointerup", onUp);
      bar.addEventListener("pointercancel", onUp);
    },
    [windowRef, boundsRef, disabled, onDragEnd],
  );
}
