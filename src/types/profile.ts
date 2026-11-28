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

export type SafariPageId = "game" | "grazia" | "rlt" | "landed";

export interface ProjectStat {
  value: string;
  label: string;
}

export interface Project {
  title: string;
  /** Short summary (terminal, AI assistant, compact cards). */
  description: string;
  /** One-line pitch shown under the title in the case study. */
  tagline?: string;
  /** What I did on it. */
  role?: string;
  /** What makes it stand out, one point each. */
  highlights?: string[];
  stats?: ProjectStat[];
  /** Small print under the case study (e.g. "demo data is fictional"). */
  note?: string;
  /** Rendered as a full case study (live preview, highlights, numbers). */
  featured?: boolean;
  /** Design file, shown as a secondary link. */
  figmaUrl?: string;
  /**
   * Screenshots of the product, shown as a swipeable strip. Used for apps that
   * sit behind a login, where a live embed would only show the sign-in screen.
   */
  gallery?: ProjectShot[];
  tags: string[];
  /** Cover background colour (shown while the screenshot loads, or alone). */
  color: string;
  /** Opens this Safari tab (see config/safari.ts); its screenshot is the cover. */
  previewPage?: SafariPageId;
  /** External link, used when there's no Safari page. */
  url?: string;
}

export interface ProjectShot {
  src: string;
  width: number;
  height: number;
  /** What the screenshot shows (alt text and caption). */
  caption: string;
  /** Phone-sized capture (narrower slot in the strip). */
  mobile?: boolean;
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
  /** This portfolio's source code (opened by the "Code" app on the desk). */
  repoUrl: string;
  /** This portfolio's design file on Figma Community (the .fig icon on the desk). */
  figmaUrl: string;
}
