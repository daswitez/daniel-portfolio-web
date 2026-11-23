/*
 * Abuse limits for the AI chat. Every request costs money, so each layer caps
 * what one visitor (or one script) can spend. Numbers can be tuned with env vars.
 */

const fromEnv = (name: string, fallback: number) => {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
};

export const LIMITS = {
  /** Characters allowed in one question. */
  questionChars: 500,
  /** Previous messages sent along for context (the rest are dropped). */
  historyMessages: 10,
  /** Characters allowed per previous message. */
  historyMessageChars: 1200,
  /** Longest answer the model may write (tokens). Short = cheap and terminal-friendly. */
  maxOutputTokens: 350,
  /** Give up on the model after this long (ms). */
  timeoutMs: 25_000,
  /** Questions per visitor (per IP) in each window. */
  perIp: fromEnv("RATE_LIMIT_PER_IP", 20),
  perIpWindowSeconds: fromEnv("RATE_LIMIT_WINDOW_SECONDS", 600),
  /** Questions for the whole site per day: a hard ceiling on daily spend. */
  daily: fromEnv("RATE_LIMIT_DAILY", 500),
} as const;
