import { LIMITS } from "./limits";

/*
 * DeepSeek chat completions (OpenAI-compatible API), streamed.
 * Server-only: reads DEEPSEEK_API_KEY, which must never be NEXT_PUBLIC_.
 */

const ENDPOINT = "https://api.deepseek.com/chat/completions";
/** The low-cost, non-reasoning model. */
const MODEL = "deepseek-chat";

export interface ModelMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export class UpstreamError extends Error {}

/**
 * Starts a streamed completion and returns a stream of plain UTF-8 text
 * (just the answer's words, as they arrive).
 */
export async function streamChat(
  messages: ModelMessage[],
  signal: AbortSignal,
): Promise<ReadableStream<Uint8Array>> {
  const key = process.env.DEEPSEEK_API_KEY;
  if (!key) throw new UpstreamError("DEEPSEEK_API_KEY is not set");

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      stream: true,
      max_tokens: LIMITS.maxOutputTokens,
      temperature: 0.6,
    }),
    signal,
    cache: "no-store",
  });
  if (!response.ok || !response.body) {
    throw new UpstreamError(`DeepSeek responded ${response.status}`);
  }

  // Server-sent events in ("data: {json}" lines) → plain text out.
  const decoder = new TextDecoder();
  const encoder = new TextEncoder();
  let buffer = "";
  return response.body.pipeThrough(
    new TransformStream<Uint8Array, Uint8Array>({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          const data = line.trim();
          if (!data.startsWith("data:")) continue;
          const payload = data.slice(5).trim();
          if (payload === "[DONE]") continue;
          try {
            const text = JSON.parse(payload).choices?.[0]?.delta?.content;
            if (typeof text === "string" && text)
              controller.enqueue(encoder.encode(text));
          } catch {
            // Ignore keep-alives and partial lines.
          }
        }
      },
    }),
  );
}
