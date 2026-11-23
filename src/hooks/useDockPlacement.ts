"use client";

import { useEffect, useState } from "react";

export type DockPlacement = "bottom" | "top";

/**
 * "bottom" (MacBook dock) while the hero desktop is on screen, "top" (nav bar)
 * once the visitor is reading the sections below. Two thresholds give the switch
 * hysteresis, so it never flickers when the scroll rests near the boundary.
 */
export function useDockPlacement(heroId: string): {
  placement: DockPlacement;
  settled: boolean;
} {
  const [placement, setPlacement] = useState<DockPlacement>("bottom");
  // false until the first measurement, so a page loaded mid-scroll doesn't animate in.
  const [settled, setSettled] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);
    if (!hero) return;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.intersectionRatio;
        setPlacement((current) => {
          if (current === "bottom" && visible < 0.3) return "top";
          if (current === "top" && visible > 0.4) return "bottom";
          return current;
        });
        cancelAnimationFrame(frame);
        frame = requestAnimationFrame(() => setSettled(true));
      },
      { threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.8, 1] },
    );
    observer.observe(hero);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [heroId]);

  return { placement, settled };
}
