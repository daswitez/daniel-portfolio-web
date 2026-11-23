export interface Fact {
  label: string;
  value: string;
}

export interface Experience {
  /** Stable key (e.g. "grazia"), used to pick the illustration in the Work chapter. */
  id: string;
  role: string;
  company: string;
  companyUrl?: string;
  period: string;
  /** What the company/product is and what I do there. */
  description: string;
  highlights: string[];
  tags: string[];
  /** Highest-hierarchy role: rendered first, larger, with a live preview. */
  featured?: boolean;
  /** Safari page (see config/safari.ts) opened by the preview card. */
  previewPage?: SafariPageId;
}

export type SafariPageId = "game" | "grazia" | "rlt";

export interface Project {
  title: string;
  description: string;
  tags: string[];
  /** Cover background colour (shown while the screenshot loads, or alone). */
  color: string;
  /** Opens this Safari tab (see config/safari.ts); its screenshot is the cover. */
  previewPage?: SafariPageId;
  /** External link, used when there's no Safari page. */
  url?: string;
}

export interface StackGroup {
  name: string;
  items: string[];
}

export interface SocialLink {
  label: string;
  handle: string;
  url: string;
}

export interface Profile {
  name: string;
  initials: string;
  /** Portrait in /public, shown in the desktop profile widget. */
  photo?: { src: string; width: number; height: number };
  role: string;
  location: string;
  availability: string;
  email: string;
  lede: string;
  bio: string[];
  facts: Fact[];
  experienceLede: string;
  experience: Experience[];
  projects: Project[];
  stack: StackGroup[];
  links: SocialLink[];
}
