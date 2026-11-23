"use client";

import { StatusDot } from "@/components/ui/StatusDot";
import { useI18n } from "@/i18n/I18nProvider";
import { Widget } from "./Widget";
import styles from "./widgets.module.css";

interface StatusWidgetProps {
  availability: string;
  location: string;
}

export function StatusWidget({ availability, location }: StatusWidgetProps) {
  const { t } = useI18n();

  return (
    <Widget className={styles.status}>
      <div>
        <h4>
          <StatusDot />
          {t.widgets.available}
        </h4>
        <p>{availability}</p>
      </div>
      <div>
        <h4>{location}</h4>
        <p>{t.widgets.location}</p>
      </div>
    </Widget>
  );
}
