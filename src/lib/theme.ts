import { STORAGE_KEYS } from "./storage";

export type Theme = "light" | "dark";

/** Theme shown until the visitor picks one with the toggle (not the OS setting). */
export const DEFAULT_THEME: Theme = "light";

/**
 * Runs before first paint (inlined in <head>) so the saved theme is applied
 * without a flash. Visitors who never chose one get the light theme, whatever
 * their system setting. Always sets data-theme so CSS and the toggle rely on it.
 */
export const themeInitScript = `(function(){var t=${JSON.stringify(DEFAULT_THEME)};try{var s=localStorage.getItem(${JSON.stringify(
  STORAGE_KEYS.theme,
)});if(s==="light"||s==="dark"){t=s}}catch(e){}document.documentElement.dataset.theme=t})()`;
