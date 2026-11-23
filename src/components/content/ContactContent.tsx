"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { OpenWindowButton } from "@/components/windows/OpenWindowButton";
import type { Profile } from "@/types/profile";
import { CopyEmailButton } from "./CopyEmailButton";
import styles from "./content.module.css";

export function ContactContent({
  email,
  links,
}: Pick<Profile, "email" | "links">) {
  const { t } = useI18n();

  return (
    <div>
      <div className={styles.email}>{email}</div>
      <div className={styles.actions}>
        <CopyEmailButton email={email} />
        <OpenWindowButton target={{ kind: "terminal" }} variant="ghost">
          {t.content.askTerminal}
        </OpenWindowButton>
      </div>
      <div className={styles.links}>
        {links.map((link) => (
          <a key={link.url} href={link.url} target="_blank" rel="noopener">
            {link.label}
            <span>{link.handle} ↗</span>
          </a>
        ))}
      </div>
    </div>
  );
}
