import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import type { Profile } from "@/types/profile";
import { localAnswer } from "./localAnswer";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AssistantReply {
  text: string;
  /** "ai": answered by the model; "local": keyword fallback; "limited": rate limit hit. */
  source: "ai" | "local" | "limited";
}

interface AskOptions {
  question: string;
  locale: Locale;
  /** This session's conversation so far (memory lasts until the page reloads). */
  history: ChatMessage[];
  profile: Profile;
  t: Dictionary["assistant"];
  /** Called with the answer so far, as it streams in. */
  onText?: (textSoFar: string) => void;
  signal?: AbortSignal;
}

/**
 * Answers a free-form question asked in the terminal.
 * Asks the AI endpoint (/api/chat, which holds the API key on the server) and
 * streams the answer; if the AI is unavailable, falls back to the local
 * keyword matcher so the terminal always replies.
 */
export async function askAssistant({
  question,
  locale,
  history,
  profile,
  t,
  onText,
  signal,
}: AskOptions): Promise<AssistantReply> {
  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, locale, history }),
      signal,
    });

    if (response.status === 429) return { text: "", source: "limited" };
    if (!response.ok || !response.body)
      throw new Error(`chat ${response.status}`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let text = "";
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
      onText?.(text);
    }
    text = text.trim();
    if (!text) throw new Error("empty answer");
    return { text, source: "ai" };
  } catch (error) {
    if (signal?.aborted) throw error;
    return { text: localAnswer(question, profile, t), source: "local" };
  }
}
