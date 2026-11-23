"use client";

import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { gsap, useGSAP } from "@/components/story/gsap";
import { useI18n } from "@/i18n/I18nProvider";
import { DOODLES, randomDoodle, type DoodleKind } from "./doodles";
import s from "./playground.module.css";

interface Doodle {
  id: number;
  x: number;
  y: number;
  kind: DoodleKind;
  rotate: number;
  size: number;
}

interface PlaygroundValue {
  /** Drops `count` doodles around a point on screen (e.g. a click). */
  burst: (clientX: number, clientY: number, count?: number) => void;
  /** Doodles made so far. */
  count: number;
}

/** At most this many doodles on screen at once; older ones are dropped. */
const MAX_DOODLES = 40;
/** A friendly message pops up when the visitor reaches these counts. */
const MILESTONES = [5, 15, 30, 50];
/** Clicks on real controls never make doodles. */
const INTERACTIVE =
  "a, button, input, textarea, select, label, [role='slider'], [data-no-doodle]";

const PlaygroundContext = createContext<PlaygroundValue | null>(null);

export function usePlayground(): PlaygroundValue {
  const value = use(PlaygroundContext);
  if (!value) throw new Error("usePlayground must be used inside <Playground>");
  return value;
}

/**
 * The fun half of the page. Wraps the chapters below the desk: clicking any empty
 * spot drops a doodle sticker (often a cat) that pops in and falls away.
 */
export function Playground({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  const zone = useRef<HTMLDivElement>(null);
  const nextId = useRef(0);
  const total = useRef(0);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const [doodles, setDoodles] = useState<Doodle[]>([]);
  const [count, setCount] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  const burst = useCallback(
    (clientX: number, clientY: number, amount = 1) => {
      const box = zone.current?.getBoundingClientRect();
      if (!box) return;
      const spread = amount > 1 ? 1 : 0;
      const fresh = Array.from({ length: amount }, () => ({
        id: nextId.current++,
        x: clientX - box.left + (Math.random() - 0.5) * 220 * spread,
        y: clientY - box.top + (Math.random() - 0.5) * 140 * spread,
        kind: randomDoodle(),
        rotate: (Math.random() - 0.5) * 50,
        size: 52 + Math.random() * 40,
      }));
      setDoodles((current) => [...current, ...fresh].slice(-MAX_DOODLES));

      const before = total.current;
      total.current += amount;
      setCount(total.current);
      const reached = MILESTONES.findIndex(
        (m) => before < m && total.current >= m,
      );
      if (reached >= 0) {
        setToast(t.play.milestones[reached] ?? null);
        clearTimeout(toastTimer.current);
        toastTimer.current = setTimeout(() => setToast(null), 3200);
      }
    },
    [t],
  );

  const remove = useCallback(
    (id: number) => setDoodles((current) => current.filter((d) => d.id !== id)),
    [],
  );

  return (
    <PlaygroundContext value={{ burst, count }}>
      <div
        ref={zone}
        className={s.zone}
        onClick={(event) => {
          if ((event.target as Element).closest(INTERACTIVE)) return;
          burst(event.clientX, event.clientY);
        }}
      >
        {children}

        <div className={s.doodles} aria-hidden="true">
          {doodles.map((doodle) => (
            <DoodleSticker key={doodle.id} doodle={doodle} onDone={remove} />
          ))}
        </div>

        <p
          className={s.toast}
          data-visible={toast ? "true" : "false"}
          role="status"
        >
          {toast}
        </p>
      </div>
    </PlaygroundContext>
  );
}

function DoodleSticker({
  doodle,
  onDone,
}: {
  doodle: Doodle;
  onDone: (id: number) => void;
}) {
  const el = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const node = el.current;
      if (!node) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
      gsap.set(node, { rotation: doodle.rotate });
      const tl = gsap.timeline({ onComplete: () => onDone(doodle.id) });
      if (reduce) {
        tl.from(node, { opacity: 0, duration: 0.2 }).to(node, {
          opacity: 0,
          duration: 0.4,
          delay: 1.4,
        });
      } else {
        tl.from(node, {
          scale: 0,
          rotation: doodle.rotate - 45,
          duration: 0.55,
          ease: "back.out(2.6)",
        }).to(node, {
          y: "+=180",
          rotation: doodle.rotate + (doodle.rotate > 0 ? 70 : -70),
          opacity: 0,
          duration: 0.9,
          ease: "power2.in",
          delay: 1.3,
        });
      }
    },
    { scope: el },
  );

  return (
    <div
      ref={el}
      className={s.doodle}
      style={{
        left: doodle.x,
        top: doodle.y,
        width: doodle.size,
        height: doodle.size,
      }}
    >
      {DOODLES[doodle.kind]}
    </div>
  );
}
