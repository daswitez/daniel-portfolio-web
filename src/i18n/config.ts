export const LOCALES = ["en", "es", "pt"] as const;
export type Locale = (typeof LOCALES)[number];

/** Used when the visitor's device asks for a language we don't have. */
export const DEFAULT_LOCALE: Locale = "en";

/** Set only when the visitor picks a language by hand; it then wins over the device language. */
export const LOCALE_COOKIE = "NEXT_LOCALE";

/** Each language's name written in that language, for the switcher. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  es: "Español",
  pt: "Português",
};

/** BCP 47 tag for Intl formatting (dates, times). */
export const INTL_LOCALE: Record<Locale, string> = {
  en: "en-US",
  es: "es",
  pt: "pt-BR",
};

export function hasLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Picks the best supported locale from an Accept-Language header, honouring q-weights
 * and falling back from a regional tag to its language ("pt-BR" → "pt").
 */
export function matchLocale(acceptLanguage: string | null | undefined): Locale {
  const ranked = (acceptLanguage ?? "")
    .split(",")
    .map((part, index) => {
      const [tag, ...params] = part.trim().toLowerCase().split(";");
      const q = Number(
        params.find((p) => p.trim().startsWith("q="))?.split("=")[1] ?? 1,
      );
      return { language: tag.split("-")[0], q: Number.isNaN(q) ? 0 : q, index };
    })
    .filter((entry) => entry.language && entry.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  return (
    ranked.map((entry) => entry.language).find(hasLocale) ?? DEFAULT_LOCALE
  );
}
