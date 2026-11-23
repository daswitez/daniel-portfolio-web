"use client";

import Image from "next/image";
import { Fragment, useRef } from "react";
import { gsap, MOTION, ScrollTrigger, useGSAP } from "@/components/story/gsap";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { DOODLES } from "./doodles";
import { usePlayground } from "./Playground";
import p from "./playground.module.css";
import s from "./HelloChapter.module.css";

/**
 * "Hello": two giant marquees that speed up with your scroll,
 * then a sticker of Daniel with a speech bubble inviting you to click around.
 */
export function HelloChapter() {
  const { t, profile } = useI18n();
  const { burst, count } = usePlayground();
  const root = useRef<HTMLElement>(null);
  const copy = t.play.hello;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION.any, () => {
        // Each row holds its words twice, so sliding it by half loops seamlessly.
        const rows = gsap.utils
          .toArray<HTMLElement>("[data-row]")
          .map((row, i) =>
            gsap.fromTo(
              row,
              { xPercent: i % 2 ? -50 : 0 },
              {
                xPercent: i % 2 ? 0 : -50,
                duration: 28,
                ease: "none",
                repeat: -1,
              },
            ),
          );
        // Scrolling fast makes the words rush, then they ease back to cruising speed.
        // One shared speed value + one decay tween (not new timelines every frame).
        /** Endless animations of this chapter: paused whenever it's off screen. */
        const loops: gsap.core.Tween[] = [...rows];
        const speed = { value: 1 };
        const applySpeed = () =>
          rows.forEach((row) => row.timeScale(speed.value));
        const visibility = ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 300, 6);
            if (boost > speed.value) {
              speed.value = boost;
              applySpeed();
            }
            gsap.to(speed, {
              value: 1,
              duration: 1.2,
              ease: "power2.out",
              overwrite: true,
              onUpdate: applySpeed,
            });
          },
          // Off screen the marquees stop entirely, so they cost nothing while you're elsewhere.
          onToggle: (self) =>
            loops.forEach((loop) =>
              self.isActive ? loop.play() : loop.pause(),
            ),
        });

        gsap.from("[data-word]", {
          yPercent: 110,
          rotation: 6,
          duration: 0.8,
          stagger: 0.06,
          ease: "power4.out",
          scrollTrigger: {
            trigger: "[data-headline]",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from("[data-sticker]", {
          scale: 0.4,
          rotation: -30,
          opacity: 0,
          duration: 0.9,
          ease: "elastic.out(1, 0.55)",
          scrollTrigger: {
            trigger: "[data-sticker]",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from("[data-bubble]", {
          scale: 0,
          transformOrigin: "0% 100%",
          duration: 0.6,
          delay: 0.35,
          ease: "back.out(2.2)",
          scrollTrigger: {
            trigger: "[data-sticker]",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        // A gentle idle float, so the sticker always feels alive.
        loops.push(
          gsap.to("[data-float]", {
            y: -10,
            rotation: 2,
            duration: 2.4,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          }),
        );
        if (!visibility.isActive) loops.forEach((loop) => loop.pause());
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  const words = copy.marquee;

  return (
    <section
      id="hi"
      ref={root}
      className={s.section}
      aria-labelledby="hi-title"
    >
      <div className={s.marquee} aria-hidden="true">
        {[0, 1].map((row) => (
          <div key={row} className={s.row} data-row>
            {[...words, ...words].map((word, i) => (
              <span key={i} className={s.word}>
                {word}
                <span className={s.star}>
                  {
                    DOODLES[
                      i % 3 === 0 ? "star" : i % 3 === 1 ? "sparkle" : "heart"
                    ]
                  }
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <div className={`${p.inner} ${s.grid}`}>
        <div>
          <h2 id="hi-title" className={p.title} data-headline>
            {copy.title.split(" ").map((word, i) => (
              <Fragment key={i}>
                <span className={s.mask}>
                  <span data-word className={s.wordInner}>
                    {word}
                  </span>
                </span>{" "}
              </Fragment>
            ))}
          </h2>
          <p className={p.body}>{copy.body}</p>
          <p className={s.hint}>
            <span className={s.hintDot} />
            {count > 0 ? format(t.play.count, { count }) : t.play.hint}
          </p>
        </div>

        <div className={s.stickerWrap} data-float>
          {profile.photo && (
            <button
              type="button"
              className={s.sticker}
              data-sticker
              aria-label={copy.photoAlt}
              onClick={(event) => burst(event.clientX, event.clientY, 8)}
            >
              <Image
                src={profile.photo.src}
                alt=""
                fill
                sizes="(max-width: 900px) 70vw, 380px"
                className={s.photo}
              />
            </button>
          )}
          <p className={s.bubble} data-bubble>
            {copy.bubble}
          </p>
        </div>
      </div>
    </section>
  );
}
