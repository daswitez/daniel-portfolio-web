import { Fragment, type ReactNode } from "react";
import { FOLDERS } from "@/config/navigation";
import type { Dictionary } from "@/i18n/dictionaries/es";
import { format } from "@/i18n/format";
import { normalize } from "@/lib/text";
import type { Profile } from "@/types/profile";
import type { OpenTarget } from "@/types/windows";
import styles from "./TerminalWindow.module.css";

export interface TerminalContext {
  print: (content: ReactNode) => void;
  clear: () => void;
  openWindow: (target: OpenTarget) => void;
  closeTerminal: () => void;
  /** Current language's strings and content. */
  t: Dictionary;
  profile: Profile;
}

type Command = (args: string, ctx: TerminalContext) => void;

/* ---------- small render helpers ---------- */

export const Cmd = ({ children }: { children: ReactNode }) => (
  <span className={styles.cmd}>{children}</span>
);
export const Dim = ({ children }: { children: ReactNode }) => (
  <span className={styles.dim}>{children}</span>
);
export const Prompt = ({ user }: { user: string }) => (
  <span className={styles.prompt}>
    {user}@portfolio <em>~ %</em>
  </span>
);

/** Joins nodes with line breaks (lines render with white-space: pre-wrap). */
function lines(nodes: ReactNode[], separator = "\n"): ReactNode {
  return nodes.map((node, i) => (
    <Fragment key={i}>
      {i > 0 && separator}
      {node}
    </Fragment>
  ));
}

/**
 * Renders a translated sentence with `{placeholder}` slots filled by nodes
 * (e.g. a highlighted command inside the sentence).
 */
export function rich(
  template: string,
  slots: Record<string, ReactNode>,
): ReactNode {
  return template.split(/(\{\w+\})/).map((part, i) => {
    const key = part.match(/^\{(\w+)\}$/)?.[1];
    return (
      <Fragment key={i}>{key && key in slots ? slots[key] : part}</Fragment>
    );
  });
}

const HELP_COLUMN = 13;

const OPEN_ALIASES: Record<string, OpenTarget> = {
  safari: { kind: "safari" },
  juego: { kind: "safari" },
  jogo: { kind: "safari" },
  game: { kind: "safari" },
  terminal: { kind: "terminal" },
  grazia: { kind: "safari", page: "grazia" },
  rlt: { kind: "safari", page: "rlt" },
  reallatinotalent: { kind: "safari", page: "rlt" },
  landed: { kind: "safari", page: "landed" },
};

/* ---------- commands ---------- */

const help: Command = (_, { print, t }) =>
  print(
    <>
      {`${t.terminal.commandsHeading}\n`}
      {lines([
        ...t.terminal.help.map(([name, desc]) => (
          <>
            {"  "}
            <Cmd>{name}</Cmd>
            {" ".repeat(Math.max(1, HELP_COLUMN - name.length))}
            {desc}
          </>
        )),
        <>
          {"  "}
          <Cmd>open</Cmd>
          {" <x>".padEnd(HELP_COLUMN - "open".length)}
          {t.terminal.openHelp}
        </>,
        <>
          {"  "}
          <Cmd>ls</Cmd>
          {"  ·  "}
          <Cmd>clear</Cmd>
        </>,
      ])}
      {`\n${t.terminal.askNatural}`}
      <Dim>&quot;{t.terminal.example}&quot;</Dim>
    </>,
  );

const experience: Command = (_, { print, profile }) =>
  print(
    lines(
      profile.experience.map((job) => (
        <>
          <Cmd>{job.period}</Cmd>
          {`  ${job.role} · ${job.company}`}
        </>
      )),
    ),
  );

const projects: Command = (_, { print, profile }) =>
  print(
    lines(
      profile.projects.map((project) => (
        <>
          <Cmd>{project.title}</Cmd>
          {` — ${project.description} `}
          <Dim>[{project.tags.join(", ")}]</Dim>
        </>
      )),
    ),
  );

const contact: Command = (_, { print, profile }) =>
  print(
    [
      `email   ${profile.email}`,
      ...profile.links.map(
        (l) => `${l.label.toLowerCase().padEnd(8)}${l.handle}`,
      ),
    ].join("\n"),
  );

const open: Command = (args, { print, openWindow, t }) => {
  const key = normalize(args).replace(/\s/g, "");
  const alias = OPEN_ALIASES[key];
  // Folders match by id or by their name in the current language ("projects", "projetos"…).
  const folder = key
    ? FOLDERS.find((f) => {
        const name = normalize(t.folders[f.id]).replace(/\s/g, "");
        return (
          f.id.startsWith(key) ||
          key.startsWith(f.id) ||
          name.startsWith(key) ||
          key.startsWith(name)
        );
      })
    : undefined;

  if (alias) openWindow(alias);
  else if (folder) openWindow({ kind: "finder", folder: folder.id });
  else {
    print(rich(t.terminal.openNotFound, { target: args, ls: <Cmd>ls</Cmd> }));
    return;
  }
  print(<Dim>{t.terminal.opening}</Dim>);
};

/** Command names in all three languages run the same thing. */
export const COMMANDS: Record<string, Command> = {
  help,
  ayuda: help,
  ajuda: help,
  "?": help,
  whoami: (_, { print, profile }) =>
    print(`${profile.name} — ${profile.role}\n${profile.bio[0]}`),
  experiencia: experience,
  experience,
  proyectos: projects,
  projetos: projects,
  projects,
  stack: (_, { print, profile }) =>
    print(
      lines(
        profile.stack.map((group) => (
          <>
            <Cmd>{group.name}</Cmd>: {group.items.join(", ")}
          </>
        )),
      ),
    ),
  contacto: contact,
  contato: contact,
  contact,
  ls: (_, { print, t }) =>
    print(
      <>
        {lines(
          FOLDERS.map((f) => <Cmd key={f.id}>{t.folders[f.id]}/</Cmd>),
          "   ",
        )}
        {"   Safari.app   Terminal.app"}
      </>,
    ),
  clear: (_, { clear }) => clear(),
  open,
  sudo: (args, { print, t, profile }) =>
    print(
      /hire|contrat/i.test(args) ? (
        <>
          <span className={styles.prompt}>{t.terminal.sudoGranted}</span>{" "}
          {format(t.terminal.sudoGrantedRest, { email: profile.email })}
        </>
      ) : (
        format(t.terminal.sudoDenied, { user: t.terminal.user })
      ),
    ),
  exit: (_, { closeTerminal }) => closeTerminal(),
};
