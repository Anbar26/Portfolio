"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";

export type StickerSpec = {
  /** File under /journal. */
  src: string;
  /** Empty when the sticker is pure decoration. */
  alt?: string;
  /** Box, as a percentage of the journal. Height follows the artwork. */
  left: number;
  top: number;
  width: number;
  /**
   * Overrides the artwork's own proportions. Only for the lace, which the design
   * stretches so its straight lower edge falls past the foot of the page instead
   * of ending mid-paper — on a repeating lace texture that reads as more lace,
   * not as distortion. Leave unset for everything else.
   */
  height?: number;
  /** Resting tilt, degrees. */
  rotate?: number;
  /** Stacking order within the spread. */
  z?: number;
  /** Half-travel of the drift, in px. Around 3–7 reads as "alive", not busy. */
  drift?: number;
  /** Seconds for one leg of the drift. Vary it so stickers fall out of step. */
  duration?: number;
  /** Head start, so nothing begins together. */
  delay?: number;
};

/**
 * One sticker on the spread.
 *
 * Two nested elements on purpose: the outer one holds the layout (position and
 * resting tilt, written once from the spec) and the inner one is all GSAP ever
 * touches. So the drift is a plain translate on an untransformed element and
 * can never fight the tilt or accumulate against it — and the tilt survives a
 * reduced-motion visit, where no tween is ever created.
 */
export default function JournalSticker({
  src,
  alt = "",
  left,
  top,
  width,
  height,
  rotate = 0,
  z = 1,
  drift = 5,
  duration = 3,
  delay = 0,
}: StickerSpec) {
  const driftRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = driftRef.current;
    if (!el) return;

    const tween = gsap.to(el, {
      x: drift,
      duration,
      delay,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    // Start from the far side so the pair of stickers sharing a duration still
    // read as independent.
    gsap.set(el, { x: -drift });

    return () => {
      tween.kill();
      gsap.set(el, { clearProps: "transform" });
    };
  }, [reduced, drift, duration, delay]);

  return (
    <div
      className="journal-sticker"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: height !== undefined ? `${height}%` : undefined,
        transform: rotate ? `rotate(${rotate}deg)` : undefined,
        zIndex: z,
      }}
    >
      <div ref={driftRef} className="journal-sticker-drift" style={{ height: "100%" }}>
        {/* Plain <img>: these are pre-trimmed PNGs with their own alpha, and
            they must never be re-encoded or letterboxed. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          draggable={false}
          aria-hidden={alt === ""}
          style={height !== undefined ? { height: "100%" } : undefined}
        />
      </div>
    </div>
  );
}
