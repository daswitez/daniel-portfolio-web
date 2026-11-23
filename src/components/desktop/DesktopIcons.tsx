"use client";

import { FigmaFileIcon } from "@/components/icons/FigmaFileIcon";
import { FolderIcon } from "@/components/icons/FolderIcon";
import {
  useWindowActions,
  useWindowManagerState,
} from "@/components/windows/WindowManager";
import { FOLDERS, type FolderConfig } from "@/config/navigation";
import { useDesktopDrag } from "@/hooks/useDesktopDrag";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/text";
import styles from "./Desktop.module.css";

export function DesktopIcons() {
  const { selectedFolder } = useWindowManagerState();
  const { t } = useI18n();

  return (
    <nav className={styles.icons} aria-label={t.desktop.folders}>
      {FOLDERS.map((folder) => (
        <DesktopFolder
          key={folder.id}
          folder={folder}
          selected={folder.id === selectedFolder}
        />
      ))}
      <FigmaFile />
    </nav>
  );
}

/** The portfolio's own design file: opens the Figma Community post in a new tab. */
function FigmaFile() {
  const { deskRef } = useWindowActions();
  const onDragStart = useDesktopDrag<HTMLAnchorElement>(deskRef);
  const { t, profile } = useI18n();

  return (
    <a
      className={cn("desk-item", styles.icon)}
      href={profile.figmaUrl}
      target="_blank"
      rel="noopener"
      title={t.desktop.figmaOpen}
      aria-label={t.desktop.figmaOpen}
      draggable={false}
      onPointerDown={onDragStart}
    >
      <FigmaFileIcon />
      <span>{t.desktop.figmaFile}</span>
    </a>
  );
}

/** A folder on the desk: click opens it in Finder, drag moves it. */
function DesktopFolder({
  folder,
  selected,
}: {
  folder: FolderConfig;
  selected: boolean;
}) {
  const { open, deskRef } = useWindowActions();
  const onDragStart = useDesktopDrag<HTMLButtonElement>(deskRef);
  const { t } = useI18n();

  return (
    <button
      type="button"
      className={cn("desk-item", styles.icon, selected && styles.selected)}
      onPointerDown={onDragStart}
      onClick={() => open({ kind: "finder", folder: folder.id })}
    >
      <FolderIcon highlight />
      <span>{t.folders[folder.id]}</span>
    </button>
  );
}
