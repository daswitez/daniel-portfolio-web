"use client";

import Image from "next/image";
import { LockIcon } from "@/components/icons/SystemIcons";
import { useWindowActions } from "@/components/windows/WindowManager";
import { SAFARI_PAGES } from "@/config/safari";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/text";
import type { SafariPageId } from "@/types/profile";
import styles from "./SitePreviewCard.module.css";

/** Mini browser thumbnail; clicking it opens the site as a tab in the desktop Safari. */
export function SitePreviewCard({
  page: pageId,
  wide = false,
}: {
  page: SafariPageId;
  /** Fill the container (case-study hero) instead of the compact inline size. */
  wide?: boolean;
}) {
  const { open } = useWindowActions();
  const { t } = useI18n();
  const page = SAFARI_PAGES[pageId];
  if (page.type !== "preview") return null;

  return (
    <button
      type="button"
      className={cn(styles.card, wide && styles.wide)}
      onClick={() => open({ kind: "safari", page: pageId })}
      aria-label={format(t.content.openSiteInSafari, { site: page.displayUrl })}
    >
      <span className={styles.chrome} aria-hidden="true">
        <span className={styles.lights}>
          <i />
          <i />
          <i />
        </span>
        <span className={styles.address}>
          <LockIcon />
          {page.displayUrl}
        </span>
      </span>
      <span className={styles.shot}>
        <Image
          src={page.image.src}
          width={page.image.width}
          height={page.image.height}
          alt=""
          sizes={wide ? "(max-width: 900px) 100vw, 760px" : "(max-width: 900px) 100vw, 520px"}
        />
        <span className={styles.cta}>{t.content.openInSafari}</span>
      </span>
    </button>
  );
}
