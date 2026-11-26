import type { MetadataRoute } from "next";
import { LOCALES } from "@/i18n/config";
import { SITE_URL } from "@/lib/site";

/** One entry per language, each listing the others so search engines link them. */
export default function sitemap(): MetadataRoute.Sitemap {
  const languages = Object.fromEntries(
    LOCALES.map((locale) => [locale, `${SITE_URL}/${locale}`]),
  );
  return LOCALES.map((locale) => ({
    url: `${SITE_URL}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 1,
    alternates: { languages },
  }));
}
