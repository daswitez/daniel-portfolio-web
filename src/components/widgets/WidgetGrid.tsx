"use client";

import { useI18n } from "@/i18n/I18nProvider";
import { CalendarWidget } from "./CalendarWidget";
import { ClockWidget } from "./ClockWidget";
import { NowPlayingWidget } from "./now-playing/NowPlayingWidget";
import { ProfileWidget } from "./ProfileWidget";
import { StatusWidget } from "./StatusWidget";
import styles from "./widgets.module.css";

export function WidgetGrid() {
  const { t, profile } = useI18n();

  return (
    <section className={styles.grid} aria-label={t.desktop.widgets}>
      <ClockWidget />
      <CalendarWidget />
      <NowPlayingWidget />
      <ProfileWidget
        name={profile.name}
        initials={profile.initials}
        photo={profile.photo}
      />
      <StatusWidget
        availability={profile.availability}
        location={profile.location}
      />
    </section>
  );
}
