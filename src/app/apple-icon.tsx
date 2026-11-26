import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/** Home-screen icon for iPhone/iPad: icon.svg as a 180 px PNG on a full-bleed square (iOS rounds it). */
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default async function AppleIcon() {
  const svg = await readFile(join(process.cwd(), "src/app/icon.svg"), "utf8");
  // iOS applies its own rounded mask, so drop the SVG's corner radius.
  const square = svg.replace(' rx="15"', "");
  const src = `data:image/svg+xml;base64,${Buffer.from(square).toString("base64")}`;

  return new ImageResponse(
    // eslint-disable-next-line @next/next/no-img-element -- ImageResponse only renders <img>.
    <img src={src} alt="" width={180} height={180} />,
    size,
  );
}
