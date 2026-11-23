import type { NextRequest } from "next/server";
import { hasLocale, type Locale } from "@/i18n/config";
import { streamChat, type ModelMessage } from "@/lib/ai/deepseek";
import { LIMITS } from "@/lib/ai/limits";
import { checkRateLimit } from "@/lib/ai/rateLimit";
import { buildSystemPrompt } from "@/lib/ai/systemPrompt";

/*
 * POST /api/chat — the terminal's AI assistant.
 * The DeepSeek key stays on the server; every request passes these checks
 * before any money is spent: same-origin → valid, small input → rate limits.
 */

export const maxDuration = 30;

type ErrorCode =
  "forbidden" | "invalid" | "rate_limited" | "daily_limit" | "unavailable";

const json = (status: number, error: ErrorCode) =>
  Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } },
  );

/** Only pages of this site may call the endpoint (plus any extra origins you allow). */
function isAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const allowed = new Set(
    (process.env.ALLOWED_ORIGINS ?? "")
      .split(",")
      .map((o) => o.trim())
      .filter(Boolean),
  );
  allowed.add(request.nextUrl.origin);
  return allowed.has(origin);
}

function clientIp(request: NextRequest): string {
  // On Vercel these are set by the platform (not by the visitor).
  return (
    request.headers.get("x-real-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

interface ChatBody {
  question: string;
  locale: Locale;
  history: ModelMessage[];
}

/** Strict validation: anything unexpected is rejected, never "fixed up". */
function parseBody(raw: unknown): ChatBody | null {
  if (!raw || typeof raw !== "object") return null;
  const { question, locale, history } = raw as Record<string, unknown>;
  if (typeof question !== "string") return null;
  const q = question.trim();
  if (!q || q.length > LIMITS.questionChars) return null;
  if (typeof locale !== "string" || !hasLocale(locale)) return null;
  if (!Array.isArray(history)) return null;

  const clean: ModelMessage[] = [];
  for (const item of history.slice(-LIMITS.historyMessages)) {
    if (!item || typeof item !== "object") return null;
    const { role, content } = item as Record<string, unknown>;
    // Visitors may only send user/assistant turns; system instructions come from the server.
    if (
      (role !== "user" && role !== "assistant") ||
      typeof content !== "string"
    )
      return null;
    clean.push({ role, content: content.slice(0, LIMITS.historyMessageChars) });
  }
  return { question: q, locale, history: clean };
}

export async function POST(request: NextRequest) {
  if (!isAllowedOrigin(request)) return json(403, "forbidden");

  // Reject big bodies before parsing them.
  if (Number(request.headers.get("content-length") ?? 0) > 20_000)
    return json(400, "invalid");
  let body: ChatBody | null = null;
  try {
    body = parseBody(await request.json());
  } catch {
    body = null;
  }
  if (!body) return json(400, "invalid");

  const limit = await checkRateLimit(clientIp(request));
  if (!limit.ok)
    return json(429, limit.reason === "daily" ? "daily_limit" : "rate_limited");

  const abort = new AbortController();
  const timer = setTimeout(() => abort.abort(), LIMITS.timeoutMs);
  // If the visitor closes the terminal mid-answer, stop paying for tokens.
  request.signal.addEventListener("abort", () => abort.abort());

  try {
    const stream = await streamChat(
      [
        { role: "system", content: buildSystemPrompt(body.locale) },
        ...body.history,
        { role: "user", content: body.question },
      ],
      abort.signal,
    );
    const done = new TransformStream<Uint8Array, Uint8Array>({
      flush: () => clearTimeout(timer),
    });
    return new Response(stream.pipeThrough(done), {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    clearTimeout(timer);
    // Log details on the server only; the visitor just gets a generic code.
    console.error("[chat] upstream failed:", error);
    return json(503, "unavailable");
  }
}
