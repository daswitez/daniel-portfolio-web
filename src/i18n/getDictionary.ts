import type { Locale } from "./config";
import type { Dictionary } from "./dictionaries/es";

// Each language is its own chunk: a page only loads the one it renders.
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: () => import("./dictionaries/en").then((m) => m.en),
  es: () => import("./dictionaries/es").then((m) => m.es),
  pt: () => import("./dictionaries/pt").then((m) => m.pt),
};

export const getDictionary = (locale: Locale) => dictionaries[locale]();
