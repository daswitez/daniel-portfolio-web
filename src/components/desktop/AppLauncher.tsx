"use client";

import type { ReactNode } from "react";
import {
  CodeAppIcon,
  FilesAppIcon,
  MailAppIcon,
  NotesAppIcon,
  SafariAppIcon,
  TerminalAppIcon,
} from "@/components/icons/AppIcons";
import { useWindowActions } from "@/components/windows/WindowManager";
import { useDesktopDrag } from "@/hooks/useDesktopDrag";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { useI18n } from "@/i18n/I18nProvider";
import type { OpenTarget } from "@/types/windows";
import styles from "./Desktop.module.css";

type AppName = keyof Dictionary["desktop"]["appNames"];

interface App {
  name: AppName;
  icon: ReactNode;
  target: OpenTarget;
}

const APPS: App[] = [
  {
    name: "files",
    icon: <FilesAppIcon />,
    target: { kind: "finder", folder: "experience" },
  },
  { name: "terminal", icon: <TerminalAppIcon />, target: { kind: "terminal" } },
  { name: "safari", icon: <SafariAppIcon />, target: { kind: "safari" } },
  {
    name: "notes",
    icon: <NotesAppIcon />,
    target: { kind: "finder", folder: "about" },
  },
  {
    name: "mail",
    icon: <MailAppIcon />,
    target: { kind: "finder", folder: "contact" },
  },
];

/** The app panel moves as one block; the apps inside it stay in place. */
export function AppLauncher() {
  const { open, deskRef } = useWindowActions();
  const onDragStart = useDesktopDrag<HTMLElement>(deskRef);
  const { t, profile } = useI18n();
  const codeUrl = profile.repoUrl;

  return (
    <nav
      onPointerDown={onDragStart}
      className={`liquid-glass desk-item ${styles.apps}`}
      aria-label={t.desktop.apps}
    >
      {APPS.map((app) => (
        <button
          key={app.name}
          type="button"
          className={styles.app}
          onClick={() => open(app.target)}
        >
          {app.icon}
          {t.desktop.appNames[app.name]}
        </button>
      ))}
      {codeUrl && (
        <a className={styles.app} href={codeUrl} target="_blank" rel="noopener">
          <CodeAppIcon />
          {t.desktop.appNames.code}
        </a>
      )}
    </nav>
  );
}
