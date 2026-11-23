"use client";

import { OpenWindowButton } from "@/components/windows/OpenWindowButton";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./Desktop.module.css";

export function Hero() {
  const { t, profile } = useI18n();
  const [beforeKeys, afterKeys] = t.hero.shortcutHint.split("{keys}");

  return (
    <div className={styles.hero}>
      <h1>
        {format(t.hero.greeting, { name: profile.name })}
        <br />
        {t.hero.tagline}
      </h1>
      <p>{t.hero.body}</p>
      <div className={styles.heroActions}>
        {/* Experience lives in its desktop folder, not in a section below. */}
        <OpenWindowButton
          target={{ kind: "finder", folder: "experience" }}
          className={styles.pill}
        >
          {t.hero.cta}
        </OpenWindowButton>
        <OpenWindowButton
          target={{ kind: "terminal" }}
          className={styles.textLink}
        >
          {t.hero.askTerminal}
        </OpenWindowButton>
      </div>
      {/* Keyboard hint: matches the ⌘K / Ctrl+K handler in WindowManager. */}
      <p className={styles.shortcutHint}>
        {beforeKeys}
        {/* Shown Mac-style; the shortcut also works with Ctrl+K on Windows/Linux. */}
        <kbd aria-label="Command">
          <span className={styles.cmdGlyph} aria-hidden="true">
            ⌘
          </span>{" "}
          cmd
        </kbd>
        <span className={styles.plus}>+</span>
        <kbd>K</kbd>
        {afterKeys}
      </p>
    </div>
  );
}
