"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { gsap, MOTION, useGSAP } from "@/components/story/gsap";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { DOODLES, type DoodleKind } from "./doodles";
import p from "./playground.module.css";
import s from "./WhyChapter.module.css";

const LOOKS: Array<{ color: string; ink: string; doodle: DoodleKind }> = [
  { color: "var(--blue)", ink: "#fff", doodle: "bolt" },
  { color: "var(--pink)", ink: "#1d1d1f", doodle: "sparkle" },
  { color: "var(--yellow)", ink: "#1d1d1f", doodle: "rocket" },
  { color: "var(--green)", ink: "#1d1d1f", doodle: "coffee" },
  { color: "var(--purple)", ink: "#fff", doodle: "cat" },
];

/** Drag past this (px) and the card goes, even if released slowly. */
const THROW_DISTANCE = 120;
/** …or flick faster than this (px/ms), even over a short distance. */
const FLICK_SPEED = 0.55;
/** How far the drag must travel for the next card to be fully lifted into place. */
const LIFT_DISTANCE = 180;

interface Sample {
  x: number;
  y: number;
  t: number;
}

interface Drag {
  id: number;
  startX: number;
  startY: number;
  /** Where the card already was (grabbing it mid-animation continues from there). */
  fromX: number;
  fromY: number;
  /** Grabbed on its top half: it pivots like a real card held from that point. */
  grabTop: boolean;
  samples: Sample[];
}

const reduceMotion = () =>
  matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * "Why me": a deck of colourful cards. Grab the top one and throw it: it keeps the
 * speed of your hand, the next card rises into place as you drag, and the thrown
 * one slides back in at the bottom of the deck. The button throws one for you.
 */
export function WhyChapter() {
  const { t } = useI18n();
  const copy = t.play.why;
  const reasons = copy.reasons;
  const root = useRef<HTMLElement>(null);
  const deck = useRef<HTMLDivElement>(null);
  const [order, setOrder] = useState(() => reasons.map((_, i) => i));
  const [seen, setSeen] = useState(0);
  const busy = useRef(false);
  const drag = useRef<Drag | null>(null);
  /** The card that was just thrown and its direction, to slide it back in. */
  const recycled = useRef<{ card: HTMLElement; direction: number } | null>(
    null,
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.any, () => {
        // Animate the cards, not the slots: slots hold the deck offsets in CSS.
        gsap.from("[data-card]", {
          y: 200,
          rotation: (i) => (i % 2 ? 20 : -20),
          opacity: 0,
          duration: 0.9,
          stagger: { each: 0.08, from: "end" },
          ease: "back.out(1.3)",
          clearProps: "transform,opacity",
          scrollTrigger: {
            trigger: "[data-deck]",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  // After the deck re-orders: settle the lift in the same frame (no jump), then
  // slide the thrown card back in underneath.
  useLayoutEffect(() => {
    const el = deck.current;
    const thrown = recycled.current;
    if (!el || !thrown) return;
    recycled.current = null;
    el.style.setProperty("--lift", "0");
    requestAnimationFrame(() => delete el.dataset.dragging);
    if (reduceMotion()) {
      gsap.set(thrown.card, { clearProps: "x,y,rotation,opacity" });
      busy.current = false;
      return;
    }
    gsap.fromTo(
      thrown.card,
      {
        x: thrown.direction * 240,
        y: 30,
        rotation: thrown.direction * 14,
        opacity: 0,
      },
      {
        x: 0,
        y: 0,
        rotation: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        onComplete: () => {
          gsap.set(thrown.card, { clearProps: "x,y,rotation,opacity" });
        },
      },
    );
    busy.current = false;
  }, [order]);

  const topCard = () =>
    root.current?.querySelector<HTMLElement>("[data-top] [data-card]") ?? null;

  function setLift(value: number) {
    deck.current?.style.setProperty(
      "--lift",
      String(Math.min(1, Math.max(0, value))),
    );
  }

  /** Sends the top card off-screen, carrying the speed of the throw (px/ms). */
  function fly(card: HTMLElement, direction: 1 | -1, vx: number, vy: number) {
    if (busy.current) return;
    busy.current = true;
    deck.current?.setAttribute("data-dragging", "");

    const finish = () => {
      recycled.current = { card, direction };
      setOrder((current) => [...current.slice(1), current[0]]);
      setSeen((n) => n + 1);
    };
    if (reduceMotion()) {
      finish();
      return;
    }

    const x = Number(gsap.getProperty(card, "x"));
    const y = Number(gsap.getProperty(card, "y"));
    const rotation = Number(gsap.getProperty(card, "rotation"));
    const distance = window.innerWidth * 0.55 + 360;
    // Faster throws leave faster; a gentle release still leaves briskly.
    const speed = Math.max(Math.abs(vx), 1.6);
    const duration = Math.min(0.6, Math.max(0.28, distance / speed / 1000));

    gsap.to(card, {
      x: x + direction * distance,
      y: y + vy * duration * 600 + 40,
      rotation: rotation + direction * 28,
      duration,
      ease: "power1.out",
      onComplete: finish,
    });
    gsap.to(card, {
      opacity: 0,
      duration: duration * 0.4,
      delay: duration * 0.6,
      ease: "power1.in",
    });
    // The next card finishes rising into place while this one leaves.
    gsap.to(deck.current, {
      "--lift": 1,
      duration: duration * 0.8,
      ease: "power2.out",
    });
  }

  function onPointerDown(event: React.PointerEvent<HTMLElement>) {
    if (busy.current) return;
    const card = event.currentTarget;
    card.setPointerCapture(event.pointerId);
    // Catch it mid-spring: continue from wherever it is right now.
    gsap.killTweensOf(card);
    gsap.killTweensOf(deck.current);
    deck.current?.setAttribute("data-dragging", "");
    const box = card.getBoundingClientRect();
    drag.current = {
      id: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      fromX: Number(gsap.getProperty(card, "x")),
      fromY: Number(gsap.getProperty(card, "y")),
      grabTop: event.clientY - box.top < box.height / 2,
      samples: [{ x: event.clientX, y: event.clientY, t: event.timeStamp }],
    };
  }

  function onPointerMove(event: React.PointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    const x = d.fromX + event.clientX - d.startX;
    const y = d.fromY + event.clientY - d.startY;
    // Held from the top it tips one way, from the bottom the other — like a real card.
    const rotation = gsap.utils.clamp(-22, 22, x * 0.07 * (d.grabTop ? 1 : -1));
    gsap.set(event.currentTarget, { x, y, rotation });
    setLift(Math.abs(x) / LIFT_DISTANCE);
    d.samples.push({ x: event.clientX, y: event.clientY, t: event.timeStamp });
    if (d.samples.length > 6) d.samples.shift();
  }

  function onPointerUp(event: React.PointerEvent<HTMLElement>) {
    const d = drag.current;
    if (!d || d.id !== event.pointerId) return;
    drag.current = null;
    const card = event.currentTarget;
    const x = Number(gsap.getProperty(card, "x"));

    // Release velocity from the last ~100 ms of movement.
    const last = d.samples[d.samples.length - 1];
    const first =
      d.samples.find((sample) => last.t - sample.t < 100) ?? d.samples[0];
    const dt = Math.max(1, last.t - first.t);
    const vx = (last.x - first.x) / dt;
    const vy = (last.y - first.y) / dt;

    const flicked = Math.abs(vx) > FLICK_SPEED;
    if (Math.abs(x) > THROW_DISTANCE || flicked) {
      const direction = (flicked ? Math.sign(vx) : Math.sign(x)) as 1 | -1;
      fly(card, direction || 1, vx, vy);
      return;
    }

    // Not far enough: spring home and let the next card settle back down.
    gsap.to(card, {
      x: 0,
      y: 0,
      rotation: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.55)",
    });
    gsap.to(deck.current, {
      "--lift": 0,
      duration: 0.4,
      ease: "power2.out",
      onComplete: () => {
        if (deck.current) delete deck.current.dataset.dragging;
      },
    });
  }

  function throwNext() {
    const card = topCard();
    if (!card) return;
    // A little lift and tilt first, as if picked up, then off it goes.
    if (reduceMotion()) return fly(card, 1, 2, 0);
    deck.current?.setAttribute("data-dragging", "");
    gsap.to(card, {
      y: -14,
      rotation: 4,
      duration: 0.14,
      ease: "power2.out",
      onComplete: () => fly(card, 1, 2.2, -0.2),
    });
  }

  return (
    <section
      id="why-me"
      ref={root}
      className={p.chapter}
      aria-labelledby="why-me-title"
    >
      <div className={`${p.inner} ${s.layout}`}>
        <div>
          <p className={p.eyebrow}>{copy.eyebrow}</p>
          <h2 id="why-me-title" className={p.title}>
            {copy.title}
          </h2>
          <p className={p.body}>{copy.body}</p>
          <div className={s.controls}>
            <button type="button" className={p.button} onClick={throwNext}>
              {copy.next} →
            </button>
            <span className={s.counter} aria-live="polite">
              {format(copy.counter, {
                n: (seen % reasons.length) + 1,
                total: reasons.length,
              })}
            </span>
          </div>
        </div>

        <div ref={deck} className={s.deck} data-deck data-no-doodle>
          {reasons.map((reason, i) => {
            const depth = order.indexOf(i);
            const look = LOOKS[i % LOOKS.length];
            const isTop = depth === 0;
            return (
              <div
                key={reason.title}
                className={s.slot}
                data-slot
                data-top={isTop ? "" : undefined}
                aria-hidden={!isTop}
                style={
                  {
                    "--depth": depth,
                    "--side": i % 2 ? 1 : -1,
                    zIndex: reasons.length - depth,
                  } as React.CSSProperties
                }
              >
                <article
                  className={s.card}
                  data-card
                  style={{ background: look.color, color: look.ink }}
                  onPointerDown={isTop ? onPointerDown : undefined}
                  onPointerMove={isTop ? onPointerMove : undefined}
                  onPointerUp={isTop ? onPointerUp : undefined}
                  onPointerCancel={isTop ? onPointerUp : undefined}
                >
                  <span className={s.cardNumber}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className={s.cardDoodle}>{DOODLES[look.doodle]}</span>
                  <h3>{reason.title}</h3>
                  <p>{reason.body}</p>
                </article>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
