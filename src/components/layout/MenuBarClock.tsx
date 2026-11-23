"use client";

import { useNow } from "@/hooks/useNow";
import { INTL_LOCALE } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";

export function MenuBarClock() {
  const now = useNow();
  const { locale } = useI18n();
  if (!now) return <span />;

  const date = now.toLocaleDateString(INTL_LOCALE[locale], {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
  const time = now.toLocaleTimeString(INTL_LOCALE[locale], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <time dateTime={now.toISOString()} style={{ whiteSpace: "pre" }}>
      {date}
      {"  "}
      {time}
    </time>
  );
}
