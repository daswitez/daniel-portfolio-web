import type {
  Experience,
  Project,
  SocialLink,
  StackGroup,
} from "@/types/profile";

/*
 * Everything about you that doesn't change with the language. The text that does
 * lives in es.ts / en.ts / pt.ts. Contenido de ejemplo: reemplázalo con tus datos.
 */

export const identity = {
  name: "Daniel",
  initials: "D",
  photo: { src: "/img/daniel.jpg", width: 1024, height: 1536 },
  email: "danielmercadosubirana@gmail.com",
  repoUrl: "https://github.com/daswitez/daniel-portfolio-web",
  figmaUrl:
    "https://www.figma.com/community/file/1706822224086220281/portfolio-macos-style",
  links: [
    {
      label: "GitHub",
      handle: "github.com/daswitez/daniel-portfolio-web",
      url: "https://github.com/daswitez/daniel-portfolio-web",
    },
    {
      label: "LinkedIn",
      handle: "linkedin.com/in/daniel-mercado-subirana-448731318",
      url: "https://www.linkedin.com/in/daniel-mercado-subirana-448731318",
    },
    // X: add { label: "X", handle: "x.com/…", url: "https://x.com/…" } once there's an account.
  ] satisfies SocialLink[],
};

export type ExperienceKey = "solvertic" | "grazia" | "freelance";
export type ProjectKey = "grazia" | "rlt";

type ExperienceBase = Omit<
  Experience,
  "id" | "role" | "period" | "description" | "highlights" | "company"
> & {
  key: ExperienceKey;
  /** Omit when the company name itself is translated (e.g. "Independent clients"). */
  company?: string;
};

/** Most recent first. The `featured` role is shown on top, highlighted. */
export const EXPERIENCE: ExperienceBase[] = [
  {
    key: "solvertic",
    company: "Solvertic",
    tags: [
      "Java",
      "Spring Boot",
      "Spring AI",
      "Hexagonal architecture",
      "Microservices",
    ],
  },
  {
    key: "grazia",
    company: "Grazia AI",
    companyUrl: "https://www.grazia.ai/",
    featured: true,
    previewPage: "grazia",
    tags: ["Next.js", "TypeScript", "Supabase", "Generative AI", "UI/UX"],
  },
  {
    key: "freelance",
    previewPage: "rlt",
    tags: ["React", "Next.js", "Node.js"],
  },
];

/** Real work only (the old sample projects are gone). */
export const PROJECTS: Array<
  Omit<Project, "title" | "description"> & { key: ProjectKey }
> = [
  {
    key: "grazia",
    tags: ["Next.js", "Supabase", "Generative AI"],
    color: "#000000",
    previewPage: "grazia",
  },
  { key: "rlt", tags: [], color: "#0a1f3d", previewPage: "rlt" },
];

export interface ExperienceText {
  role: string;
  company?: string;
  period: string;
  description: string;
  highlights: string[];
  /** Replaces the shared tags when some of them are words that need translating. */
  tags?: string[];
}

/** What each language file provides. */
export interface ProfileText {
  role: string;
  location: string;
  availability: string;
  lede: string;
  bio: string[];
  facts: Array<{ label: string; value: string }>;
  experienceLede: string;
  experience: Record<ExperienceKey, ExperienceText>;
  projects: Record<ProjectKey, Pick<Project, "title" | "description">>;
  stack: StackGroup[];
}
