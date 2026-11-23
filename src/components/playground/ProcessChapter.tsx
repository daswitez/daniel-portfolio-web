"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, MOTION, useGSAP } from "@/components/story/gsap";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/text";
import p from "./playground.module.css";
import { ProductMock } from "./ProductMock";
import s from "./ProcessChapter.module.css";

/** Where each step's callout points on the screen (percent of the image), one per step. */
const CALLOUTS = [
  { x: 16, y: 40 },
  { x: 47, y: 31 },
  { x: 57, y: 52 },
  { x: 69, y: 78 },
];

/** Share of the scroll at which the wipe is complete (the rest holds the finished product). */
const WIPE_END = 0.85;

/**
 * "How I work": one screen as a sketch and as the finished product.
 * - Wide screens with motion: the chapter pins and scrolling builds the product,
 *   left to right, while the four steps advance and a callout marks what's
 *   happening on screen.
 * - Phones / reduced motion: drag the handle to compare, same steps and callouts.
 */
export function ProcessChapter() {
  const { t } = useI18n();
  const copy = t.play.process;
  const total = copy.steps.length;
  const root = useRef<HTMLElement>(null);
  const compare = useRef<HTMLDivElement>(null);
  /** Share of the image still showing the sketch, 0–100. */
  const position = useRef(100);
  const [step, setStep] = useState(0);
  const [value, setValue] = useState(100);

  // The coded product is laid out at 1376 px wide; scale it to the screen's real width.
  useEffect(() => {
    const box = compare.current;
    if (!box) return;
    const observer = new ResizeObserver(([entry]) =>
      box.style.setProperty("--k", String(entry.contentRect.width / 1376)),
    );
    observer.observe(box);
    return () => observer.disconnect();
  }, []);

  const setPosition = useCallback(
    (next: number) => {
      const clamped = Math.min(100, Math.max(0, next));
      position.current = clamped;
      const built = 1 - clamped / 100;
      root.current?.style.setProperty("--pos", `${clamped}%`);
      root.current?.style.setProperty("--built", String(built));
      setStep(Math.min(total - 1, Math.floor(built * total * 0.999)));
      setValue(Math.round(clamped));
    },
    [total],
  );

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION.wide, () => {
        // The screen zooms up to full size as the chapter arrives…
        gsap.fromTo(
          compare.current,
          { scale: 0.88, rotation: -1.5 },
          {
            scale: 1,
            rotation: 0,
            ease: "none",
            scrollTrigger: {
              trigger: root.current,
              start: "top 90%",
              end: "top top",
              scrub: true,
            },
          },
        );
        // …then stays pinned while scrolling turns the sketch into the product.
        gsap.timeline({
          scrollTrigger: {
            trigger: root.current,
            start: "top top",
            end: "+=260%",
            pin: true,
            scrub: 0.5,
            onUpdate: (self) =>
              setPosition(100 - Math.min(1, self.progress / WIPE_END) * 100),
          },
        });
      });

      mm.add(MOTION.narrow, () => {
        // On phones: one teaser sweep when it arrives, then it's yours to drag.
        const sweep = { pos: 100 };
        gsap
          .timeline({
            scrollTrigger: {
              trigger: compare.current,
              start: "top 70%",
              toggleActions: "play none none none",
            },
          })
          .to(sweep, {
            pos: 0,
            duration: 1.6,
            ease: "power2.inOut",
            onUpdate: () => setPosition(sweep.pos),
          })
          .to(sweep, {
            pos: 50,
            duration: 0.9,
            ease: "back.out(1.6)",
            onUpdate: () => setPosition(sweep.pos),
          });
      });

      // Reduced motion: start half and half, so both versions are visible right away.
      mm.add("(prefers-reduced-motion: reduce)", () => setPosition(50));

      return () => mm.revert();
    },
    { scope: root },
  );

  function positionFromPointer(event: React.PointerEvent) {
    const box = compare.current?.getBoundingClientRect();
    if (!box) return;
    setPosition(((event.clientX - box.left) / box.width) * 100);
  }

  return (
    <section
      id="process"
      ref={root}
      className={s.section}
      style={{ "--pos": "100%", "--built": 0 } as React.CSSProperties}
      aria-labelledby="process-title"
    >
      <div className={s.stage}>
        <div className={s.side}>
          <p className={p.eyebrow}>{copy.eyebrow}</p>
          <h2 id="process-title" className={s.title}>
            {copy.title}
          </h2>
          <p className={s.body}>{copy.body}</p>

          <div className={s.progress} aria-hidden="true">
            <span className={s.progressTrack}>
              <span className={s.progressFill} />
            </span>
            <span className={s.progressLabel}>
              {format(copy.progress, { n: step + 1, total })}
            </span>
          </div>

          <ol className={s.steps}>
            {copy.steps.map((item, i) => (
              <li
                key={item.title}
                className={s.step}
                data-state={i < step ? "done" : i === step ? "active" : "todo"}
                aria-current={i === step ? "step" : undefined}
              >
                <span className={s.stepNumber}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3>{item.title}</h3>
                  <div className={s.stepDetail}>
                    <div>
                      <p>{item.body}</p>
                      <ul className={s.deliverables}>
                        {item.deliverables.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ol>

          <p className={cn(s.hint, s.hintScroll)}>{copy.scrollHint} ↓</p>
          <p className={cn(s.hint, s.hintDrag)}>{copy.handle} ↔</p>
        </div>

        <div className={s.visual}>
          <div
            ref={compare}
            className={s.compare}
            data-no-doodle
            onPointerDown={(event) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              positionFromPointer(event);
            }}
            onPointerMove={(event) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId))
                positionFromPointer(event);
            }}
          >
            {/* The finished product, built in code (sharp at any size, with live details). */}
            <ProductMock />
            <div className={s.sketch}>
              <Image
                src="/story/craft-sketch.jpg"
                alt=""
                fill
                sizes="(max-width: 900px) 100vw, 70vw"
                className={s.image}
              />
            </div>

            <span className={cn(s.label, s.labelBefore)}>{copy.before}</span>
            <span className={cn(s.label, s.labelAfter)}>{copy.after}</span>

            {CALLOUTS.map((spot, i) => (
              <span
                key={i}
                className={s.callout}
                data-active={i === step ? "true" : "false"}
                data-side={spot.x > 80 ? "left" : "right"}
                style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                aria-hidden={i !== step}
              >
                <span className={s.calloutDot} />
                <span className={s.calloutLabel}>{copy.callouts[i]}</span>
              </span>
            ))}

            <div
              className={s.handle}
              role="slider"
              tabIndex={0}
              aria-label={copy.handle}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={value}
              onKeyDown={(event) => {
                if (event.key === "ArrowLeft")
                  setPosition(position.current - 5);
                else if (event.key === "ArrowRight")
                  setPosition(position.current + 5);
                else return;
                event.preventDefault();
              }}
            >
              <span className={s.knob} aria-hidden="true">
                <svg viewBox="0 0 24 24" width="22" height="22">
                  <path
                    d="m9 7-5 5 5 5M15 7l5 5-5 5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
