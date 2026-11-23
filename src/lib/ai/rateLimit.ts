import { LIMITS } from "./limits";

/*
 * Rate limiting for the AI chat.
 *
 * With SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY set, counters live in Supabase
 * (see supabase/rate-limit.sql), so the limit holds across every Vercel
 * instance. Without them it falls back to memory, which only limits per server
 * instance: fine for local development, weak in production.
 *
 * Visitors are identified by a SHA-256 hash of their IP: no raw IPs are stored.
 */

export type LimitResult =
  { ok: true } | { ok: false; reason: "visitor" | "daily" };

async function hash(value: string): Promise<string> {
  const salt = process.env.RATE_LIMIT_SALT ?? "portfolio-chat";
  const bytes = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`${salt}:${value}`),
  );
  return Array.from(new Uint8Array(bytes), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

/** One atomic "count this hit and tell me if it's allowed" call to Supabase. */
async function hitSupabase(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const response = await fetch(`${url}/rest/v1/rpc/hit_rate_limit`, {
    method: "POST",
    headers: {
      apikey: serviceKey!,
      // Legacy service_role keys are JWTs and also go in Authorization; the new
      // "sb_secret_…" keys only go in the apikey header.
      ...(serviceKey!.startsWith("eyJ")
        ? { Authorization: `Bearer ${serviceKey}` }
        : {}),
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      p_key: key,
      p_limit: limit,
      p_window_seconds: windowSeconds,
    }),
    cache: "no-store",
  });
  if (!response.ok)
    throw new Error(`rate limit store responded ${response.status}`);
  return (await response.json()) === true;
}

// In-memory fallback: key → timestamps (ms) of recent hits.
const memory = new Map<string, number[]>();

function hitMemory(key: string, limit: number, windowSeconds: number): boolean {
  const now = Date.now();
  const recent = (memory.get(key) ?? []).filter(
    (t) => now - t < windowSeconds * 1000,
  );
  recent.push(now);
  memory.set(key, recent);
  if (memory.size > 5000) memory.clear(); // never grow unbounded
  return recent.length <= limit;
}

const supabaseConfigured = () =>
  Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

async function hit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<boolean> {
  if (!supabaseConfigured()) return hitMemory(key, limit, windowSeconds);
  try {
    return await hitSupabase(key, limit, windowSeconds);
  } catch (error) {
    // If the counter store is down, keep protecting with the in-memory limit.
    console.error("[chat] rate limit store unavailable:", error);
    return hitMemory(key, limit, windowSeconds);
  }
}

export async function checkRateLimit(ip: string): Promise<LimitResult> {
  const visitor = `ip:${await hash(ip)}`;
  if (!(await hit(visitor, LIMITS.perIp, LIMITS.perIpWindowSeconds)))
    return { ok: false, reason: "visitor" };
  const day = `day:${new Date().toISOString().slice(0, 10)}`;
  if (!(await hit(day, LIMITS.daily, 86_400)))
    return { ok: false, reason: "daily" };
  return { ok: true };
}
