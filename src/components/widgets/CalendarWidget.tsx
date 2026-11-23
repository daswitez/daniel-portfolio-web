"use client";

import { useMemo } from "react";
import { useNow } from "@/hooks/useNow";
import { INTL_LOCALE } from "@/i18n/config";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/text";
import { Widget } from "./Widget";
import styles from "./widgets.module.css";

function buildMonth(year: number, month: number) {
  // Monday-first offset of the 1st of the month.
  const leadingBlanks = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return {
    leadingBlanks,
    days: Array.from({ length: daysInMonth }, (_, i) => i + 1),
  };
}

export function CalendarWidget() {
  const now = useNow();
  const { t, locale } = useI18n();
  const year = now?.getFullYear();
  const month = now?.getMonth();
  const today = now?.getDate();

  const grid = useMemo(
    () =>
      year === undefined || month === undefined
        ? null
        : buildMonth(year, month),
    [year, month],
  );

  return (
    <Widget className={styles.calendar} aria-label={t.widgets.calendar}>
      <div className={styles.weekday}>
        {now?.toLocaleDateString(INTL_LOCALE[locale], { weekday: "long" })}
      </div>
      <div className={styles.day}>{today}</div>
      <div className={styles.monthGrid}>
        {t.widgets.weekdays.map((d, i) => (
          <b key={i}>{d}</b>
        ))}
        {grid && (
          <>
            {Array.from({ length: grid.leadingBlanks }, (_, i) => (
              <span key={`blank-${i}`} />
            ))}
            {grid.days.map((d) => (
              <span key={d} className={cn(d === today && styles.today)}>
                {d}
              </span>
            ))}
          </>
        )}
      </div>
    </Widget>
  );
}
