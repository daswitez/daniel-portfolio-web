"use client";

import { useSyncExternalStore } from "react";
import { MoonIcon, SunIcon } from "@/components/icons/SystemIcons";
import { useI18n } from "@/i18n/I18nProvider";
import { storage, STORAGE_KEYS } from "@/lib/storage";
import type { Theme } from "@/lib/theme";
import styles from "./MenuBar.module.css";

// data-theme on <html> is the source of truth (set before paint by themeInitScript).
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });
  return () => observer.disconnect();
}

const getTheme = () =>
  (document.documentElement.dataset.theme === "dark"
    ? "dark"
    : "light") as Theme;
const getServerTheme = () => null;

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, getServerTheme);
  const { t } = useI18n();

  const toggle = () => {
    const next: Theme = getTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    storage.set(STORAGE_KEYS.theme, next);
  };

  return (
    <button
      type="button"
      className={styles.themeToggle}
      onClick={toggle}
      aria-label={
        theme === "dark" ? t.menubar.themeToLight : t.menubar.themeToDark
      }
    >
      {/* Both icons render; CSS shows the right one, so there's no flash before hydration. */}
      <SunIcon className={styles.sun} />
      <MoonIcon className={styles.moon} />
    </button>
  );
}
