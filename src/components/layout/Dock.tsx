"use client";

import {
  AnimatePresence,
  LayoutGroup,
  LazyMotion,
  m,
  MotionConfig,
  type Transition,
} from "motion/react";
import { DockIcon } from "@/components/icons/DockIcon";
import { DOCK_ITEMS } from "@/config/navigation";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useDockPlacement } from "@/hooks/useDockPlacement";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/text";
import styles from "./Dock.module.css";

const SECTION_IDS = DOCK_ITEMS.map((item) => item.sectionId);

/*
 * Springs, not durations: interruptible and they start from the current on-screen
 * value, so scrolling back mid-flight just re-targets the motion.
 * No bounce for the repositioning (nothing was flicked); a touch of life on the lens.
 */
const MOVE: Transition = { type: "spring", bounce: 0, visualDuration: 0.5 };
const LENS: Transition = { type: "spring", bounce: 0.15, visualDuration: 0.35 };
const LABEL: Transition = { type: "spring", bounce: 0, visualDuration: 0.25 };
const INSTANT: Transition = { duration: 0 };

const loadFeatures = () => import("./dockMotionFeatures").then((mod) => mod.default);

/**
 * Liquid-glass dock. Sits at the bottom like a MacBook dock over the hero, then
 * glides up to become the top navigation bar for the sections below.
 */
export function Dock() {
  const active = useActiveSection(SECTION_IDS);
  const { t } = useI18n();
  const { placement, settled } = useDockPlacement("home");
  const isNav = placement === "top";
  const move = settled ? MOVE : INSTANT;

  return (
    // LazyMotion + `m`: the animation engine (~30 KB) downloads after the page loads
    // instead of blocking it. Until then the dock renders normally, just without motion.
    <LazyMotion features={loadFeatures} strict>
      <MotionConfig reducedMotion="user">
        <div className={styles.layer} data-placement={placement}>
          <LayoutGroup id="dock">
            <m.nav
              layout
              transition={move}
              className={cn("liquid-glass", styles.dock)}
              style={{ borderRadius: 26 }}
              aria-label={t.nav.label}
            >
              {DOCK_ITEMS.map((item) => {
                const isActive = item.sectionId === active;
                const label = t.nav[item.sectionId];
                return (
                  <m.a
                    key={item.sectionId}
                    layout
                    transition={move}
                    href={`#${item.sectionId}`}
                    className={cn(styles.item, isActive && styles.active)}
                    style={{ borderRadius: 18 }}
                    aria-current={isActive ? "location" : undefined}
                    aria-label={label}
                  >
                    {isActive && (
                      <m.span
                        layoutId="dock-lens"
                        className={styles.lens}
                        style={{ borderRadius: 18 }}
                        transition={settled ? LENS : INSTANT}
                      />
                    )}
                    <m.span layout transition={move} className={styles.icon}>
                      <DockIcon name={item.icon} />
                    </m.span>
                    <AnimatePresence initial={false} mode="popLayout">
                      {isNav && (
                        <m.span
                          key="label"
                          layout="position"
                          className={styles.label}
                          initial={{ opacity: 0, filter: "blur(4px)" }}
                          animate={{ opacity: 1, filter: "blur(0px)" }}
                          exit={{ opacity: 0, filter: "blur(4px)" }}
                          transition={LABEL}
                        >
                          {label}
                        </m.span>
                      )}
                    </AnimatePresence>
                    {!isNav && (
                      <span className={styles.tooltip} aria-hidden="true">
                        {label}
                      </span>
                    )}
                  </m.a>
                );
              })}
            </m.nav>
          </LayoutGroup>
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}
