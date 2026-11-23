"use client";

import { useMemo, useState } from "react";
import { LockIcon } from "@/components/icons/SystemIcons";
import { SAFARI_PAGES } from "@/config/safari";
import { useI18n } from "@/i18n/I18nProvider";
import { Window } from "../Window/Window";
import { useWindowManagerState, useWindowState } from "../WindowManager";
import { ClawdRun } from "./clawd-run/ClawdRun";
import { useClawdRun } from "./clawd-run/useClawdRun";
import { PreviewPageView } from "./PreviewPageView";
import { SafariTabs } from "./SafariTabs";
import styles from "./SafariWindow.module.css";

export function SafariWindow() {
  const state = useWindowState("safari");
  const { safari } = useWindowManagerState();
  const { t, profile } = useI18n();
  const activePage = SAFARI_PAGES[safari.active];
  const gameOpen = safari.tabs.includes("game");
  // Bumping a page's counter remounts its iframe: that's "reload" for a live site.
  const [reloads, setReloads] = useState<Partial<Record<string, number>>>({});
  const canReload = activePage.type === "game" || activePage.live;

  function reload() {
    if (activePage.type === "game") game.start();
    else
      setReloads((r) => ({
        ...r,
        [activePage.id]: (r[activePage.id] ?? 0) + 1,
      }));
  }

  // The game only runs while its tab is the one on screen.
  const gameLabels = useMemo(
    () => ({ shield: t.game.shield, shieldLost: t.game.shieldLost }),
    [t],
  );
  const game = useClawdRun({
    active: (state?.isOpen ?? false) && safari.active === "game",
    mounted: gameOpen,
    labels: gameLabels,
  });

  return (
    <Window kind="safari" title={activePage.title}>
      <div className={styles.safari}>
        <div className={styles.toolbar}>
          <div className={styles.nav}>
            <button type="button" disabled aria-label={t.safari.back}>
              ‹
            </button>
            <button type="button" disabled aria-label={t.safari.forward}>
              ›
            </button>
          </div>
          <div className={styles.url}>
            <LockIcon />
            {activePage.displayUrl}
          </div>
          <div className={styles.nav}>
            <button
              type="button"
              aria-label={t.safari.reload}
              disabled={!canReload}
              onClick={reload}
            >
              ↻
            </button>
          </div>
        </div>

        <SafariTabs />

        <nav className={styles.favorites} aria-label={t.safari.favorites}>
          {profile.links.map((link) => (
            <a key={link.url} href={link.url} target="_blank" rel="noopener">
              {link.label}
            </a>
          ))}
        </nav>

        {/* Pages stay mounted while their tab exists, so switching tabs keeps their state. */}
        {gameOpen && (
          <div className={styles.page} hidden={safari.active !== "game"}>
            <ClawdRun game={game} />
          </div>
        )}
        {safari.tabs.map((id) => {
          const page = SAFARI_PAGES[id];
          if (page.type !== "preview") return null;
          return (
            <div key={id} className={styles.page} hidden={safari.active !== id}>
              <PreviewPageView key={reloads[id] ?? 0} page={page} />
            </div>
          );
        })}
      </div>
    </Window>
  );
}
