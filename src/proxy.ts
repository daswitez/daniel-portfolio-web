import { NextResponse, type NextRequest } from "next/server";
import { hasLocale, LOCALE_COOKIE, LOCALES, matchLocale } from "@/i18n/config";

/**
 * Sends visitors without a language in the URL to the right one: the language they
 * picked before (cookie) or, the first time, their device's language (Accept-Language).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocalePrefix = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
  );
  if (hasLocalePrefix) return;

  const saved = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale =
    saved && hasLocale(saved)
      ? saved
      : matchLocale(request.headers.get("accept-language"));

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  const response = NextResponse.redirect(url);
  // The redirect depends on these, so caches must not share it across visitors.
  response.headers.set("Vary", "Accept-Language, Cookie");
  return response;
}

export const config = {
  // Skip Next internals, API routes and any file with an extension (images, favicon…).
  matcher: ["/((?!_next|api|.*\..*).*)"],
};
