"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register once, for every chapter. Only client modules import this file.
// Only ScrollTrigger: register more plugins here only when something uses them (each adds bundle weight).
gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Media queries shared by the chapters (gsap.matchMedia reverts animations when they stop matching). */
export const MOTION = {
  /** Wide screens, motion allowed: pinning, horizontal scroll, scrubbed effects. */
  wide: "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
  /** Phones and small tablets, motion allowed: simple reveal-on-enter only. */
  narrow: "(max-width: 900px) and (prefers-reduced-motion: no-preference)",
  /** Any size, motion allowed. */
  any: "(prefers-reduced-motion: no-preference)",
} as const;

export { gsap, ScrollTrigger, useGSAP };
