import { STORAGE_KEYS } from "./storage";

export type Theme = "light" | "dark";

/**
 * Runs before first paint (inlined in <head>) so the saved/system theme is applied
 * without a flash. Always sets data-theme so CSS and the toggle can rely on it.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(
  STORAGE_KEYS.theme,
)});if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.dataset.theme=t}catch(e){}})()`;
