"use client";

import { StatusDot } from "@/components/ui/StatusDot";
import { useI18n } from "@/i18n/I18nProvider";
import { LanguageMenu } from "./LanguageMenu";
import { MenuBarClock } from "./MenuBarClock";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./MenuBar.module.css";

export function MenuBar() {
  const { t, profile } = useI18n();

  return (
    <header className={`glass ${styles.menubar}`}>
      <span className={styles.monogram} aria-hidden="true">
        {profile.initials}
      </span>
      <b>{profile.name}</b>
      <span className={styles.role}>{profile.role}</span>
      <span className={styles.right}>
        <span className={styles.availability}>
          <StatusDot />
          {t.menubar.available}
        </span>
        <MenuBarClock />
        <LanguageMenu />
        <ThemeToggle />
      </span>
    </header>
  );
}
