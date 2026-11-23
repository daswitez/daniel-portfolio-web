"use client";

import { useI18n } from "@/i18n/I18nProvider";
import styles from "./TagList.module.css";

export function TagList({ tags }: { tags: readonly string[] }) {
  const { t } = useI18n();

  return (
    <ul className={styles.tags} aria-label={t.content.technologies}>
      {tags.map((tag) => (
        <li key={tag} className={styles.tag}>
          {tag}
        </li>
      ))}
    </ul>
  );
}
