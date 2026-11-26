import { notFound } from "next/navigation";
import { Desktop } from "@/components/desktop/Desktop";
import { Dock } from "@/components/layout/Dock";
import { Footer } from "@/components/layout/Footer";
import { MenuBar } from "@/components/layout/MenuBar";
import { ContactChapter } from "@/components/playground/ContactChapter";
import { HelloChapter } from "@/components/playground/HelloChapter";
import { OfferChapter } from "@/components/playground/OfferChapter";
import { Playground } from "@/components/playground/Playground";
import { ProcessChapter } from "@/components/playground/ProcessChapter";
import { WhyChapter } from "@/components/playground/WhyChapter";
import { WindowManagerProvider } from "@/components/windows/WindowManager";
import { getProfile } from "@/content/profile";
import { hasLocale } from "@/i18n/config";
import { format } from "@/i18n/format";
import { getDictionary } from "@/i18n/getDictionary";
import { I18nProvider } from "@/i18n/I18nProvider";
import { FULL_NAME, SITE_URL } from "@/lib/site";

/**
 * The desk (hero) is the serious part, for exploring at your own pace. Below it,
 * the playground: what I offer and why me, told playfully. Details (experience,
 * stack…) live in the desk's folders.
 */
export default async function HomePage({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  const t = await getDictionary(lang);
  const profile = getProfile(lang);

  // Tells search engines who this page is about (name, job, profiles) for rich results.
  const person = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: FULL_NAME,
    url: `${SITE_URL}/${lang}`,
    image: profile.photo && `${SITE_URL}${profile.photo.src}`,
    jobTitle: profile.role,
    description: format(t.meta.description, { name: FULL_NAME }),
    knowsLanguage: ["es", "en", "pt"],
    knowsAbout: profile.stack.flatMap((group) => group.items),
    sameAs: [...profile.links.map((link) => link.url), profile.figmaUrl],
  };

  return (
    <I18nProvider locale={lang} t={t} profile={profile}>
      <script
        type="application/ld+json"
        // "<" escaped so profile text can never close the tag early.
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(person).replace(/</g, "\\u003c"),
        }}
      />
      <WindowManagerProvider>
        <MenuBar />

        <main>
          <Desktop />
          {/* The serious desk above; the playground below. */}
          <Playground>
            <HelloChapter />
            <OfferChapter />
            <ProcessChapter />
            <WhyChapter />
            <ContactChapter />
          </Playground>
        </main>

        <Footer />
        <Dock />
      </WindowManagerProvider>
    </I18nProvider>
  );
}
