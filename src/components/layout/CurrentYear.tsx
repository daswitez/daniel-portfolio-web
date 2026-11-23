"use client";

import { useNow } from "@/hooks/useNow";

/** Client-side so the year is never frozen at build time in the prerendered page. */
export function CurrentYear() {
  const now = useNow();
  return <span suppressHydrationWarning>{now?.getFullYear()}</span>;
}
