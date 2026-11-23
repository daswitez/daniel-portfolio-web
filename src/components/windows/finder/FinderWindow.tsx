"use client";

import { useEffect, useRef } from "react";
import { FolderContent } from "@/components/content/FolderContent";
import { FolderIcon } from "@/components/icons/FolderIcon";
import { FOLDERS, getFolder } from "@/config/navigation";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/text";
import { Window } from "../Window/Window";
import { useWindowActions, useWindowManagerState } from "../WindowManager";
import styles from "./FinderWindow.module.css";

export function FinderWindow() {
  const { folder: folderId } = useWindowManagerState();
  const { setFolder } = useWindowActions();
  const mainRef = useRef<HTMLDivElement>(null);
  const { t, profile } = useI18n();
  const folder = getFolder(folderId);
  const folderName = t.folders[folder.id];

  // Each folder starts scrolled to the top.
  useEffect(() => {
    mainRef.current?.scrollTo({ top: 0 });
  }, [folderId]);

  return (
    <Window kind="finder" title={folderName}>
      <div className={styles.finder}>
        <nav className={styles.sidebar} aria-label={t.finder.favorites}>
          <small>{t.finder.favorites}</small>
          {FOLDERS.map((item) => (
            <button
              key={item.id}
              type="button"
              aria-label={t.folders[item.id]}
              aria-current={item.id === folderId ? "true" : undefined}
              className={cn(item.id === folderId && styles.active)}
              onClick={() => setFolder(item.id)}
            >
              <FolderIcon />
              <span className={styles.name}>{t.folders[item.id]}</span>
            </button>
          ))}
        </nav>
        <div ref={mainRef} className={styles.main}>
          <div className={styles.crumb}>
            {profile.name} › {t.finder.desktop} › {folderName}
          </div>
          <h2>{folderName}</h2>
          <FolderContent folder={folderId} />
        </div>
      </div>
    </Window>
  );
}
