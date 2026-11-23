"use client";

import Image from "next/image";
import type { PreviewPage } from "@/config/safari";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import styles from "./SafariWindow.module.css";

/** The real site when it can be embedded; otherwise a captured screenshot plus a way out to it. */
export function PreviewPageView({ page }: { page: PreviewPage }) {
  const { t } = useI18n();
  const site = { site: page.displayUrl };

  if (page.live) {
    return (
      <div className={styles.live} style={{ background: page.accent }}>
        <iframe
          src={page.href}
          title={page.title}
          className={styles.frame}
          allow="autoplay; clipboard-write; fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <a
          href={page.href}
          target="_blank"
          rel="noopener"
          className={`${styles.previewLink} ${styles.liveLink}`}
        >
          {format(t.safari.openSite, site)}
        </a>
      </div>
    );
  }

  return (
    <div className={styles.preview} style={{ background: page.accent }}>
      <Image
        src={page.image.src}
        width={page.image.width}
        height={page.image.height}
        alt={format(t.safari.screenshotAlt, site)}
        // The window can be maximized, so ask for an image as wide as the screen.
        sizes="100vw"
        className={styles.previewImage}
      />
      <a
        href={page.href}
        target="_blank"
        rel="noopener"
        className={styles.previewLink}
        title={format(t.safari.previewNote, site)}
      >
        {format(t.safari.openSite, site)}
      </a>
    </div>
  );
}
