"use client";

import Image from "next/image";
import { useRef } from "react";
import { gsap, MOTION, useGSAP } from "@/components/story/gsap";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { useI18n } from "@/i18n/I18nProvider";
import p from "./playground.module.css";
import s from "./OfferChapter.module.css";

type OfferId = keyof Dictionary["play"]["offer"]["items"];

const OFFERS: Array<{ id: OfferId; image: string; color: string }> = [
  {
    id: "interfaces",
    image: "/story/offer-interfaces.webp",
    color: "var(--pink)",
  },
  { id: "ai", image: "/story/offer-ai.webp", color: "var(--yellow)" },
  { id: "backend", image: "/story/offer-backend.webp", color: "var(--green)" },
];

/** How far (degrees) a card leans toward the cursor. */
const TILT = 10;

/**
 * "What I offer": three light cards with clay illustrations. They tumble in like
 * stickers being slapped down, and lean toward the cursor with a light glare.
 */
export function OfferChapter() {
  const { t } = useI18n();
  const root = useRef<HTMLElement>(null);
  const copy = t.play.offer;

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.any, () => {
        gsap.from("[data-card]", {
          y: 160,
          rotation: (i) => [-10, 6, -6][i] ?? 0,
          opacity: 0,
          duration: 1,
          stagger: 0.12,
          ease: "back.out(1.4)",
          scrollTrigger: {
            trigger: "[data-cards]",
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const onMove = contextSafe((event: React.PointerEvent<HTMLElement>) => {
    if (
      event.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const card = event.currentTarget;
    const box = card.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width;
    const y = (event.clientY - box.top) / box.height;
    gsap.to(card, {
      rotationY: (x - 0.5) * TILT * 2,
      rotationX: -(y - 0.5) * TILT * 2,
      duration: 0.4,
      ease: "power2.out",
    });
    card.style.setProperty("--glare-x", `${x * 100}%`);
    card.style.setProperty("--glare-y", `${y * 100}%`);
  });
  const onLeave = contextSafe((event: React.PointerEvent<HTMLElement>) => {
    gsap.to(event.currentTarget, {
      rotationX: 0,
      rotationY: 0,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });
  });

  return (
    <section
      id="offer"
      ref={root}
      className={p.chapter}
      aria-labelledby="offer-title"
    >
      <div className={p.inner}>
        <p className={p.eyebrow}>{copy.eyebrow}</p>
        <h2 id="offer-title" className={p.title}>
          {copy.title}
        </h2>

        <div className={s.cards} data-cards>
          {OFFERS.map(({ id, image, color }, i) => (
            <article
              key={id}
              className={s.card}
              data-card
              style={{ "--tag": color } as React.CSSProperties}
              onPointerMove={onMove}
              onPointerLeave={onLeave}
            >
              <div className={s.media}>
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 380px"
                  className={s.image}
                />
                <span className={s.number}>
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className={s.content}>
                <h3>{copy.items[id].title}</h3>
                <p>{copy.items[id].body}</p>
                <p className={s.getsLabel}>{copy.gets}</p>
                <ul className={s.gets}>
                  {copy.items[id].gets.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <span className={s.glare} aria-hidden="true" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
