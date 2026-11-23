"use client";

import { useNow } from "@/hooks/useNow";
import { INTL_LOCALE } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { Widget } from "./Widget";
import styles from "./widgets.module.css";

const TICKS = Array.from({ length: 12 }, (_, i) => i);

/** The clock always shows New York time, whatever the visitor's own time zone. */
const TIME_ZONE = "America/New_York";

const clockParts = new Intl.DateTimeFormat("en-US", {
  timeZone: TIME_ZONE,
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hourCycle: "h23",
});

function timeIn(date: Date) {
  const parts = Object.fromEntries(
    clockParts
      .formatToParts(date)
      .map((part) => [part.type, Number(part.value)]),
  );
  return {
    hours: parts.hour ?? 0,
    minutes: parts.minute ?? 0,
    seconds: parts.second ?? 0,
  };
}

export function ClockWidget() {
  const now = useNow();
  const { t, locale } = useI18n();

  const time = now ? timeIn(now) : { hours: 0, minutes: 0, seconds: 0 };
  const seconds = time.seconds;
  const minutes = time.minutes + seconds / 60;
  const hours = (time.hours % 12) + minutes / 60;

  return (
    <Widget className={styles.clock} aria-label={t.widgets.clock}>
      <svg
        viewBox="0 0 100 100"
        role="img"
        aria-label={
          now
            ? `${t.widgets.clockCity} ${now.toLocaleTimeString(INTL_LOCALE[locale], { timeZone: TIME_ZONE })}`
            : t.widgets.clock
        }
      >
        {TICKS.map((i) => {
          const major = i % 3 === 0;
          return (
            <line
              key={i}
              x1="50"
              y1={major ? 6 : 7}
              x2="50"
              y2={major ? 12 : 10}
              stroke="var(--muted)"
              strokeWidth={major ? 1.6 : 1}
              transform={`rotate(${i * 30} 50 50)`}
            />
          );
        })}
        {now && (
          <>
            <text x="50" y="74" textAnchor="middle">
              {t.widgets.clockCity}
            </text>
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="30"
              stroke="currentColor"
              strokeWidth="3.2"
              strokeLinecap="round"
              transform={`rotate(${hours * 30} 50 50)`}
            />
            <line
              x1="50"
              y1="50"
              x2="50"
              y2="18"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              transform={`rotate(${minutes * 6} 50 50)`}
            />
            <line
              x1="50"
              y1="56"
              x2="50"
              y2="14"
              stroke="var(--orange)"
              strokeWidth="1"
              transform={`rotate(${seconds * 6} 50 50)`}
            />
          </>
        )}
        <circle cx="50" cy="50" r="2.4" fill="var(--orange)" />
      </svg>
    </Widget>
  );
}
