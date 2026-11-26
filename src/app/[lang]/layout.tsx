import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, type Locale, LOCALES } from "@/i18n/config";
import { format } from "@/i18n/format";
import { getDictionary } from "@/i18n/getDictionary";
import { FULL_NAME, SITE_URL } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";
import "../globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  // Only used below the first screen (playground, windows, tags): not worth a
  // preload that competes with the LCP image. It still loads, just not first.
  preload: false,
});

/** Every language is prerendered at build time: /en, /es, /pt. */
export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const t = await getDictionary(lang);
  const title = format(t.meta.title, { name: FULL_NAME });
  const description = format(t.meta.description, { name: FULL_NAME });

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: FULL_NAME,
    authors: [{ name: FULL_NAME, url: SITE_URL }],
    creator: FULL_NAME,
    alternates: {
      canonical: `/${lang}`,
      languages: {
        ...Object.fromEntries(LOCALES.map((locale) => [locale, `/${locale}`])),
        // The bare domain redirects each visitor to their language.
        "x-default": "/",
      },
    },
    openGraph: {
      type: "profile",
      url: `/${lang}`,
      siteName: FULL_NAME,
      title,
      description,
      locale: OG_LOCALE[lang],
      alternateLocale: LOCALES.filter((l) => l !== lang).map((l) => OG_LOCALE[l]),
      firstName: "Daniel",
      lastName: "Mercado Subirana",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

const OG_LOCALE: Record<Locale, string> = {
  en: "en_US",
  es: "es_LA",
  pt: "pt_BR",
};

export const viewport: Viewport = {
  // Matches the default light theme (the visitor can switch to dark in the menu bar).
  themeColor: "#fbfbfd",
};

export default async function RootLayout({
  children,
  params,
}: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return (
    <html
      lang={lang}
      className={`${inter.variable} ${geistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Applies the saved theme before first paint (no flash). This root layout is
            only ever rendered on the server: changing language reloads the page. */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      {/* Extensions like Grammarly add attributes to <body> before React loads. */}
      <body suppressHydrationWarning>
        {children}
        {/* Vercel Web Analytics: page views, no cookies. Sends nothing in development. */}
        <Analytics />
      </body>
    </html>
  );
}
