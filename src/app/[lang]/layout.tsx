import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { getProfile } from "@/content/profile";
import { hasLocale, LOCALES } from "@/i18n/config";
import { format } from "@/i18n/format";
import { getDictionary } from "@/i18n/getDictionary";
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
  const [t, profile] = [await getDictionary(lang), getProfile(lang)];
  return {
    title: "Portfolio OS",
    description: format(t.meta.description, {
      name: profile.name,
      role: profile.role,
      lede: profile.experienceLede,
    }),
    alternates: {
      languages: Object.fromEntries(
        LOCALES.map((locale) => [locale, `/${locale}`]),
      ),
    },
  };
}

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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
