"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { CurrentYear } from "./CurrentYear";
import styles from "./Footer.module.css";

export function Footer() {
  const { t, profile } = useI18n();

  return (
    <footer className={styles.footer}>
      © <CurrentYear /> {profile.name}. {t.footer}
    </footer>
  );
}
