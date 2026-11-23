"use client";

import {
  useCallback,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from "react";
import { COMPACT_BREAKPOINT } from "@/config/navigation";
import { isCompactViewport } from "@/lib/text";

/** Pixels the pointer must travel before a press becomes a drag (so clicks still work). */
const DRAG_THRESHOLD = 4;
/** Keeps dragged items under the menubar. */
const TOP_INSET = 34;
/** Windows start stacking at z-index 21; desktop items always stay below them. */
const MAX_DESKTOP_Z = 19;

let topDesktopZ = 1;

/** Where each item has been dragged to, so the next drag continues from there. */
const offsets = new WeakMap<HTMLElement, { x: number; y: number }>();

/**
 * Lets a desktop item (widget, folder, app panel) be moved freely inside the desk,
 * like on a Mac. The offset is written straight to CSS variables while dragging
 * (no re-render per pointermove) and kept for the rest of the visit.
 * A press that never passes the threshold is left alone and still clicks.
 * Returns the `onPointerDown` handler for the item.
 */
export function useDesktopDrag<T extends HTMLElement>(
  boundsRef: RefObject<HTMLElement | null>,
) {
  return useCallback(
    (event: ReactPointerEvent<T>) => {
      const el = event.currentTarget;
      const bounds = boundsRef.current;
      if (!bounds || event.button !== 0 || event.pointerType === "touch")
        return;
      if (isCompactViewport(COMPACT_BREAKPOINT)) return;

      const startX = event.clientX;
      const startY = event.clientY;
      const origin = offsets.get(el) ?? { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      const area = bounds.getBoundingClientRect();
      // How far the item can travel from where it is now, keeping it fully inside the desk.
      const min = {
        x: area.left - rect.left,
        y: area.top + TOP_INSET - rect.top,
      };
      const max = { x: area.right - rect.right, y: area.bottom - rect.bottom };
      let dragging = false;

      const onMove = (e: PointerEvent) => {
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        if (!dragging) {
          if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return;
          dragging = true;
          el.setPointerCapture(e.pointerId);
          el.dataset.dragging = "true";
          if (getComputedStyle(el).position === "static")
            el.style.position = "relative";
          topDesktopZ = Math.min(topDesktopZ + 1, MAX_DESKTOP_Z);
          el.style.zIndex = String(topDesktopZ);
        }
        const next = {
          x: origin.x + Math.min(max.x, Math.max(min.x, dx)),
          y: origin.y + Math.min(max.y, Math.max(min.y, dy)),
        };
        offsets.set(el, next);
        el.style.setProperty("--drag-x", `${next.x}px`);
        el.style.setProperty("--drag-y", `${next.y}px`);
      };

      const onUp = () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
        if (!dragging) return;
        delete el.dataset.dragging;
        // The release would otherwise "click" whatever was under the pointer.
        window.addEventListener("click", swallowClick, {
          capture: true,
          once: true,
        });
        setTimeout(
          () =>
            window.removeEventListener("click", swallowClick, {
              capture: true,
            }),
          0,
        );
      };

      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
    },
    [boundsRef],
  );
}

function swallowClick(event: MouseEvent) {
  event.stopPropagation();
  event.preventDefault();
}
