"use client";

import { useId, useRef } from "react";
import { CheckIcon, GlobeIcon } from "@/components/icons/SystemIcons";
import {
  LOCALE_COOKIE,
  LOCALE_NAMES,
  LOCALES,
  type Locale,
} from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/text";
import styles from "./MenuBar.module.css";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Remembers a hand-picked language; proxy.ts reads it before the device language. */
function saveLocale(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=${ONE_YEAR}; samesite=lax`;
}

/**
 * Menubar language picker. The first visit follows the device language (see
 * proxy.ts); picking one here saves it in a cookie so it wins from then on.
 * Uses the native popover API: Esc and clicking outside close it for free.
 */
export function LanguageMenu() {
  const { t, locale } = useI18n();
  const menuId = useId();
  const menuRef = useRef<HTMLDivElement>(null);

  function choose(next: Locale) {
    menuRef.current?.hidePopover();
    if (next === locale) return;
    saveLocale(next);
    // Same page in the other language, keeping the section the visitor is on.
    // A full load (not router.replace): each language is its own root layout, and
    // re-rendering <html> on the client trips React's "<script> in a component" error.
    window.location.replace(`/${next}${window.location.hash}`);
  }

  return (
    <>
      <button
        type="button"
        className={styles.themeToggle}
        popoverTarget={menuId}
        aria-label={`${t.menubar.changeLanguage} (${LOCALE_NAMES[locale]})`}
        aria-haspopup="menu"
      >
        <GlobeIcon />
      </button>
      <div
        ref={menuRef}
        id={menuId}
        popover="auto"
        role="menu"
        aria-label={t.menubar.language}
        className={cn("glass", styles.languageMenu)}
      >
        {LOCALES.map((option) => (
          <button
            key={option}
            type="button"
            role="menuitemradio"
            aria-checked={option === locale}
            lang={option}
            className={styles.languageOption}
            onClick={() => choose(option)}
          >
            <CheckIcon className={styles.languageCheck} />
            {LOCALE_NAMES[option]}
            <span className={styles.languageCode}>{option.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </>
  );
}
