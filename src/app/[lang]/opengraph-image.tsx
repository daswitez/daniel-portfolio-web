import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { hasLocale, LOCALES } from "@/i18n/config";
import { FULL_NAME } from "@/lib/site";

/**
 * Link preview (WhatsApp, LinkedIn, X, Slack…), one per language, made at build time.
 * Same look as the playground: name in heavy type and the photo as a tilted sticker.
 */
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = `${FULL_NAME} — Fullstack Developer & UI/UX Designer`;

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

const ROLE = {
  en: "Fullstack Developer & UI/UX Designer",
  es: "Desarrollador Fullstack y Diseñador UI/UX",
  pt: "Desenvolvedor Fullstack e Designer UI/UX",
} as const;

const TAGS = ["AI products", "Next.js", "TypeScript", "UI/UX"];
const DOMAIN = "danielmercadosubirana.com";

/** Heavy weights for the headline; Google serves TTF (what ImageResponse reads) to plain fetch. */
async function loadFont(weight: number, text: string) {
  try {
    const css = await (
      await fetch(
        `https://fonts.googleapis.com/css2?family=Inter:wght@${weight}&text=${encodeURIComponent(text)}`,
      )
    ).text();
    const url = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!url) return null;
    return await (await fetch(url)).arrayBuffer();
  } catch {
    return null; // Offline build: fall back to the bundled font.
  }
}

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang: raw } = await params;
  const lang = hasLocale(raw) ? raw : "en";
  const role = ROLE[lang];

  const photo = await readFile(join(process.cwd(), "public/img/daniel.jpg"));
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;

  const allText = FULL_NAME + role + TAGS.join("") + DOMAIN;
  const [heavy, semibold] = await Promise.all([
    loadFont(900, allText),
    loadFont(600, allText),
  ]);
  const fonts = [
    heavy && { name: "Inter", data: heavy, weight: 900 as const, style: "normal" as const },
    semibold && { name: "Inter", data: semibold, weight: 600 as const, style: "normal" as const },
  ].filter((f) => f !== null);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 80px",
          background: "#fbfbfd",
          color: "#1d1d1f",
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", flex: 1, paddingRight: 40 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 36 }}>
            {["#ff5f57", "#febc2e", "#28c840"].map((c) => (
              <div key={c} style={{ width: 18, height: 18, borderRadius: 9, background: c }} />
            ))}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            <span>Daniel</span>
            <span>Mercado</span>
            <span style={{ color: "#2997ff" }}>Subirana</span>
          </div>
          <div style={{ marginTop: 28, fontSize: 32, fontWeight: 600, color: "#424245" }}>
            {role}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 30 }}>
            {TAGS.map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 18px",
                  border: "2px solid #1d1d1f",
                  borderRadius: 999,
                  fontSize: 22,
                  fontWeight: 600,
                }}
              >
                {tag}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 34, fontSize: 22, fontWeight: 600, color: "#86868b" }}>
            {DOMAIN}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            width: 330,
            height: 412,
            border: "10px solid #fff",
            borderRadius: 34,
            overflow: "hidden",
            boxShadow: "0 0 0 2px #1d1d1f, 14px 16px 0 #1d1d1f",
            transform: "rotate(4deg)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse only renders <img>. */}
          <img
            src={photoSrc}
            alt=""
            width={330}
            height={495}
            style={{ objectFit: "cover", objectPosition: "50% 30%", width: "100%", height: "100%" }}
          />
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
