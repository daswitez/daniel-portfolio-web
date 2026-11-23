"use client";

import { SAFARI_PAGES } from "@/config/safari";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/text";
import { useWindowActions, useWindowManagerState } from "../WindowManager";
import styles from "./SafariWindow.module.css";

export function SafariTabs() {
  const { safari } = useWindowManagerState();
  const { selectSafariTab, closeSafariTab } = useWindowActions();
  const { t } = useI18n();

  // Like Safari: the tab bar only appears once there's more than one tab.
  if (safari.tabs.length < 2) return null;

  return (
    <div className={styles.tabs} role="tablist" aria-label={t.safari.tabs}>
      {safari.tabs.map((id) => {
        const page = SAFARI_PAGES[id];
        const active = id === safari.active;
        return (
          <div key={id} className={cn(styles.tab, active && styles.activeTab)}>
            <button
              type="button"
              role="tab"
              aria-selected={active}
              className={styles.tabLabel}
              onClick={() => selectSafariTab(id)}
            >
              <span className={styles.favicon} aria-hidden="true">
                {page.title[0]}
              </span>
              {page.title}
            </button>
            <button
              type="button"
              className={styles.tabClose}
              aria-label={format(t.safari.closeTab, { title: page.title })}
              onClick={() => closeSafariTab(id)}
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
