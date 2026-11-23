"use client";

import {
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import { INTL_LOCALE, type Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { format } from "@/i18n/format";
import { useI18n } from "@/i18n/I18nProvider";
import { askAssistant, type ChatMessage } from "@/lib/assistant";
import { normalize } from "@/lib/text";
import { Window } from "../Window/Window";
import { useWindowActions, useWindowState } from "../WindowManager";
import {
  Cmd,
  COMMANDS,
  Dim,
  Prompt,
  rich,
  type TerminalContext,
} from "./commands";
import styles from "./TerminalWindow.module.css";

interface Line {
  id: number;
  content: ReactNode;
}

const INPUT_ID = "terminal-input";

function welcomeLines(t: Dictionary, locale: Locale): Line[] {
  return [
    {
      id: 0,
      content: (
        <Dim>
          Last login: {new Date().toLocaleString(INTL_LOCALE[locale])} on
          ttys001
        </Dim>
      ),
    },
    { id: 1, content: rich(t.terminal.welcome, { help: <Cmd>help</Cmd> }) },
  ];
}

export function TerminalWindow() {
  const state = useWindowState("terminal");
  const { open, close } = useWindowActions();
  const { t, profile, locale } = useI18n();
  const user = t.terminal.user;

  const [lines, setLines] = useState<Line[]>(() => welcomeLines(t, locale));
  const [input, setInput] = useState("");
  const nextId = useRef(2);
  const history = useRef<string[]>([]);
  const historyIndex = useRef(0);
  const conversation = useRef<ChatMessage[]>([]);
  const busy = useRef(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keep the newest output in view.
  useEffect(() => {
    const box = scrollRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [lines]);

  // Focus the prompt every time the terminal is (re)opened.
  const openCount = state?.openCount;
  useEffect(() => {
    if (!openCount) return;
    const id = setTimeout(
      () => inputRef.current?.focus({ preventScroll: true }),
      40,
    );
    return () => clearTimeout(id);
  }, [openCount]);

  const print = (content: ReactNode): number => {
    const id = nextId.current++;
    setLines((prev) => [...prev, { id, content }]);
    return id;
  };

  const replaceLine = (id: number, content: ReactNode) =>
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { id, content } : line)),
    );

  const ctx: TerminalContext = {
    print,
    clear: () => setLines([]),
    openWindow: open,
    closeTerminal: () => close("terminal"),
    t,
    profile,
  };

  async function ask(question: string) {
    busy.current = true;
    const lineId = print(<Dim>{t.terminal.thinking}</Dim>);
    const reply = await askAssistant({
      question,
      locale,
      history: conversation.current,
      profile,
      t: t.assistant,
      // Show the answer as it streams in, with a cursor at the end.
      onText: (text) =>
        replaceLine(
          lineId,
          <>
            {text}
            <span className={styles.streamCaret} />
          </>,
        ),
    });

    if (reply.source === "limited") {
      replaceLine(
        lineId,
        <Dim>{format(t.terminal.rateLimited, { email: profile.email })}</Dim>,
      );
    } else {
      replaceLine(
        lineId,
        reply.source === "local" ? (
          <>
            {reply.text} <Dim>{t.terminal.localMode}</Dim>
          </>
        ) : (
          reply.text
        ),
      );
      // Session memory: later questions get this exchange as context.
      conversation.current.push(
        { role: "user", content: question },
        { role: "assistant", content: reply.text },
      );
    }
    busy.current = false;
  }

  function run(value: string) {
    print(
      <>
        <Prompt user={user} /> {value}
      </>,
    );
    const [name, ...args] = value.split(/\s+/);
    // Accent-insensitive, so "experiência" and "experiencia" both work.
    const command = COMMANDS[normalize(name)];
    if (command) command(args.join(" "), ctx);
    else if (!busy.current) void ask(value);
    else print(<Dim>{t.terminal.wait}</Dim>);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp" && historyIndex.current > 0) {
      event.preventDefault();
      setInput(history.current[--historyIndex.current]);
    } else if (event.key === "ArrowDown") {
      historyIndex.current = Math.min(
        history.current.length,
        historyIndex.current + 1,
      );
      setInput(history.current[historyIndex.current] ?? "");
    } else if (event.key === "l" && event.ctrlKey) {
      event.preventDefault();
      setLines([]);
    }
  }

  return (
    <Window
      kind="terminal"
      title={`${user}@portfolio — zsh — 80×24`}
      tone="dark"
    >
      <div
        ref={scrollRef}
        className={styles.terminal}
        onClick={() => {
          if (!window.getSelection()?.toString())
            inputRef.current?.focus({ preventScroll: true });
        }}
      >
        <div aria-live="polite">
          {lines.map((line) => (
            <div key={line.id} className={styles.line}>
              {line.content}
            </div>
          ))}
        </div>
        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            const value = input.trim();
            setInput("");
            if (!value) return;
            history.current.push(value);
            historyIndex.current = history.current.length;
            run(value);
          }}
        >
          <label htmlFor={INPUT_ID}>
            <Prompt user={user} />
          </label>
          <input
            ref={inputRef}
            id={INPUT_ID}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
            autoCapitalize="off"
            spellCheck={false}
            aria-label={t.terminal.inputLabel}
          />
        </form>
      </div>
    </Window>
  );
}
