/** Lower-cases and strips accents so "Tecnologías" matches "tecnologias". */
export function normalize(value: string): string {
  return value.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/** "Ana María" → "anamaria" */
export function toHandle(value: string): string {
  return normalize(value).replace(/\s+/g, "");
}

export function cn(
  ...classes: Array<string | false | null | undefined>
): string {
  return classes.filter(Boolean).join(" ");
}

export function isCompactViewport(breakpoint: number): boolean {
  return typeof window !== "undefined" && window.innerWidth <= breakpoint;
}
