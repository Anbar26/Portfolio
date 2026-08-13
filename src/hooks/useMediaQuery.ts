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
 * The server fallback is `true`, and that is load-bearing rather than a guess
 * at the majority case.
 *
 * Projects, Certifications and Skills each render a different tree depending on
 * this, and only the animated tree pins. ScrollTrigger implements a pin by
 * wrapping the element in a `.pin-spacer` it inserts itself, which React knows
 * nothing about — so unmounting an animated section after it has pinned makes
 * React call removeChild on a node whose parent has changed underneath it. That
 * throws, and an error thrown during the commit takes down the whole root.
 *
 * With `false` here, the server and hydration rendered the animated tree and a
 * reduced-motion visitor immediately swapped away from it: the destructive
 * direction, and the site rendered as a blank page for them.
 *
 * With `true`, the first paint is always the static tree, which pins nothing.
 * A visitor who allows motion then swaps static -> animated, which is safe
 * because no pin-spacer exists yet; a visitor who does not swaps nothing at
 * all. The costly direction is simply never taken.
 */
export function usePrefersReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}
