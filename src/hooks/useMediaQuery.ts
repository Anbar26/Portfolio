"use client";

import { useSyncExternalStore } from "react";

/** Tracks a media query without tripping hydration warnings. */
export function useMediaQuery(query: string, serverFallback = true) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => serverFallback
  );
}

const noop = () => () => {};

/**
 * False during SSR and the hydration pass, true afterwards. Use it to gate
 * anything that needs a real `document` — portals, most obviously.
 */
export function useIsClient() {
  return useSyncExternalStore(
    noop,
    () => true,
    () => false
  );
}

/**
 * True when the visitor asked the OS to cut animation.
 *
 * Server fallback is `false` so the markup rendered on the server matches the
 * majority case; the first client render corrects it before any timeline is
 * built, because every scroll effect here is created inside an effect.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", false);
}
