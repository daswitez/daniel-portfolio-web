import { identity } from "@/content/profile/base";
import { toHandle } from "@/lib/text";
import type { SafariPageId } from "@/types/profile";

interface BasePage {
  id: SafariPageId;
  title: string;
  /** Text shown in the address bar. */
  displayUrl: string;
}

export interface GamePage extends BasePage {
  type: "game";
}

/**
 * An external site. With `live: true` the tab embeds the real site and it can be
 * browsed from inside Safari. That only works when the site's own headers allow
 * this portfolio's domain to frame it (`Content-Security-Policy: frame-ancestors`
 * and no `X-Frame-Options`); otherwise the tab shows the screenshot plus a
 * button to open the real site.
 */
export interface PreviewPage extends BasePage {
  type: "preview";
  href: string;
  live: boolean;
  image: { src: string; width: number; height: number };
  accent: string;
}

export type SafariPage = GamePage | PreviewPage;

export const SAFARI_PAGES: Record<SafariPageId, SafariPage> = {
  game: {
    id: "game",
    type: "game",
    title: "Clawd Run",
    displayUrl: `game.${toHandle(identity.name)}.dev`,
  },
  grazia: {
    id: "grazia",
    type: "preview",
    title: "Grazia AI",
    displayUrl: "grazia.ai",
    href: "https://www.grazia.ai/",
    // grazia.ai sends `X-Frame-Options: SAMEORIGIN` + `frame-ancestors 'self'`.
    // Once it allows the portfolio's domain, set NEXT_PUBLIC_GRAZIA_LIVE=true.
    live: process.env.NEXT_PUBLIC_GRAZIA_LIVE === "true",
    // Captured at 2x (retina) so it stays sharp when the Safari window is maximized.
    image: { src: "/previews/grazia@2x.webp", width: 2880, height: 1800 },
    accent: "#000000",
  },
  rlt: {
    id: "rlt",
    type: "preview",
    title: "Real Latino Talent",
    displayUrl: "reallatinotalent.com",
    href: "https://reallatinotalent.com/",
    // This site allows being embedded, so the tab is the real, browsable site.
    live: true,
    // Used for the thumbnail card in Experience.
    image: {
      src: "/previews/reallatinotalent@2x.webp",
      width: 2880,
      height: 1800,
    },
    accent: "#0a1f3d",
  },
  landed: {
    id: "landed",
    type: "preview",
    title: "Landed",
    displayUrl: "landed-six-mu.vercel.app",
    href: "https://landed-six-mu.vercel.app/",
    // Sends no X-Frame-Options / frame-ancestors, so the tab is the real, browsable app.
    live: true,
    image: { src: "/previews/landed@2x.webp", width: 2880, height: 1800 },
    accent: "#f4efe6",
  },
};

export const DEFAULT_SAFARI_PAGE: SafariPageId = "game";
