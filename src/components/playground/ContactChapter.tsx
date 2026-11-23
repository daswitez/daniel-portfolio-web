"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, MOTION, useGSAP } from "@/components/story/gsap";
import { useI18n } from "@/i18n/I18nProvider";
import { usePlayground } from "./Playground";
import p from "./playground.module.css";
import s from "./ContactChapter.module.css";

/**
 * "Let's talk": a huge title whose letters hop when the cursor passes over them,
 * and buttons that throw a handful of doodles when pressed.
 */
export function ContactChapter() {
  const { t, profile } = useI18n();
  const { burst } = usePlayground();
  const copy = t.play.contact;
  const root = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const { contextSafe } = useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.any, () => {
        gsap.from("[data-letter]", {
          yPercent: 120,
          rotation: () => gsap.utils.random(-30, 30),
          duration: 0.7,
          stagger: 0.025,
          ease: "back.out(2)",
          scrollTrigger: {
            trigger: "[data-title]",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from("[data-reveal]", {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.1,
          delay: 0.3,
          ease: "power3.out",
          scrollTrigger: {
            trigger: "[data-title]",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const hop = contextSafe((event: React.PointerEvent<HTMLElement>) => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    gsap.fromTo(
      event.currentTarget,
      { y: 0 },
      {
        y: "-0.25em",
        duration: 0.18,
        ease: "power2.out",
        yoyo: true,
        repeat: 1,
        overwrite: true,
      },
    );
  });

  async function copyEmail(event: React.MouseEvent) {
    burst(event.clientX, event.clientY, 6);
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      clearTimeout(resetTimer.current);
      resetTimer.current = setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked: the address is visible right below anyway.
    }
  }

  return (
    <section
      id="contact"
      ref={root}
      className={`${p.chapter} ${s.section}`}
      aria-labelledby="contact-title"
    >
      <div className={`${p.inner} ${s.inner}`}>
        <p className={p.eyebrow}>{copy.eyebrow}</p>
        <h2
          id="contact-title"
          className={s.title}
          data-title
          aria-label={copy.title}
        >
          {copy.title.split(" ").map((word, w) => (
            <span key={w} className={s.wordGroup} aria-hidden="true">
              {[...word].map((letter, i) => (
                <span
                  key={i}
                  className={s.letter}
                  data-letter
                  onPointerEnter={hop}
                >
                  {letter}
                </span>
              ))}
            </span>
          ))}
        </h2>
        <p className={`${p.body} ${s.body}`} data-reveal>
          {copy.body}
        </p>

        <div className={s.actions} data-reveal>
          <a
            href={`mailto:${profile.email}`}
            className={p.button}
            onClick={(event) => burst(event.clientX, event.clientY, 8)}
          >
            {copy.cta} ✉︎
          </a>
          <button
            type="button"
            className={`${p.button} ${p.buttonAlt}`}
            onClick={copyEmail}
            aria-live="polite"
          >
            {copied ? t.content.copied : t.content.copyEmail}
          </button>
        </div>
        <p className={s.email} data-reveal>
          {profile.email}
        </p>

        <ul className={s.links} data-reveal>
          {profile.links.map((link, i) => (
            <li key={link.url} style={{ rotate: `${(i % 2 ? 1 : -1) * 3}deg` }}>
              <a href={link.url} target="_blank" rel="noopener">
                {link.label} ↗
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
