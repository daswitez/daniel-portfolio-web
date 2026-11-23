"use client";

import { createContext, use, type ReactNode } from "react";
import type { Profile } from "@/types/profile";
import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/es";

interface I18nValue {
  locale: Locale;
  /** UI strings for the current language. */
  t: Dictionary;
  /** Portfolio content in the current language. */
  profile: Profile;
}

const I18nContext = createContext<I18nValue | null>(null);

/**
 * Hands the server-loaded dictionary and profile to client components. Only the
 * current language is serialized to the browser.
 */
export function I18nProvider({
  children,
  ...value
}: I18nValue & { children: ReactNode }) {
  return <I18nContext value={value}>{children}</I18nContext>;
}

export function useI18n(): I18nValue {
  const value = use(I18nContext);
  if (!value) throw new Error("useI18n must be used inside <I18nProvider>");
  return value;
}
