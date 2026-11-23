"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { useI18n } from "@/i18n/I18nProvider";

export function CopyEmailButton({ email }: { email: string }) {
  const { t } = useI18n();
  // null = the resting label, which follows the current language.
  const [flashLabel, setFlashLabel] = useState<string | null>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(resetTimer.current), []);

  const flash = (text: string) => {
    setFlashLabel(text);
    clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setFlashLabel(null), 1800);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      flash(t.content.copied);
    } catch {
      // Clipboard blocked: show the address so it can be copied by hand.
      flash(email);
    }
  };

  return (
    <Button onClick={copy} aria-live="polite">
      {flashLabel ?? t.content.copyEmail}
    </Button>
  );
}
