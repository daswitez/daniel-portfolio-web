"use client";

import { gsap, MOTION, useGSAP } from "./gsap";

/** How small the desk gets: the "screen" of the laptop it turns into. */
const SCREEN_SCALE = 0.74;

/**
 * Chapter 0, the zoom-out. While the visitor scrolls the first stretch, the hero
 * stays pinned and the whole desk shrinks into a MacBook screen (a dark bezel
 * grows around it and the laptop base slides in underneath); then the page moves on.
 * Wide screens with motion allowed only: elsewhere the hero just scrolls.
 */
export function DeskZoom() {
  useGSAP(() => {
    const hero = document.getElementById("home");
    const desk = hero?.querySelector<HTMLElement>("[data-desk]");
    const base = hero?.querySelector<HTMLElement>("[data-laptop-base]");
    if (!hero || !desk || !base) return;

    const mm = gsap.matchMedia();
    mm.add(MOTION.wide, () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "+=75%",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          // Pins above other chapters' triggers, so it must be measured first.
          refreshPriority: 10,
        },
      });

      tl.to(desk, {
        scale: SCREEN_SCALE,
        borderRadius: 22,
        boxShadow:
          "0 0 0 14px #1d1d1f, 0 0 0 15.5px #48484a, 0 50px 90px -30px rgba(0, 0, 0, 0.45)",
        ease: "power2.inOut",
      }).fromTo(
        base,
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, ease: "power2.out" },
        "<35%",
      );
    });

    return () => mm.revert();
  });

  return null;
}
