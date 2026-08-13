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
  /**
   * How far the sticker rocks, in degrees, from its resting tilt.
   *
   * Omitted on every sticker but the bow — the rest of the spread is still.
   */
  rock?: number;
  /** Seconds each angle is held before it flips. */
  duration?: number;
  /** Head start, so nothing begins together. */
  delay?: number;
};

/**
 * One sticker on the spread. Still, unless it is given a `rock` — only the bow
 * is.
 *
 * The motion is measured off the reference recording, and the important part is
 * that it does NOT ease. The bow holds one angle for about half a second, flips
 * to the other, and holds again: 30fps of video shows no frames in between.
 * `steps(1)` reproduces that. An eased swing was the obvious-looking choice and
 * the wrong one — it reads as floating rather than as a sticker being knocked.
 *
 * Two nested elements: the OUTER box is the only thing GSAP touches, the resting
 * tilt stays on the INNER one, so the rock composes with the tilt instead of
 * having to account for it. That also leaves the tilt intact on a reduced-motion
 * visit, where no tween is ever created.
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
  rock = 0,
  duration = 0.5,
  delay = 0,
}: StickerSpec) {
  const driftRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    // No rock means a still sticker, which is all of them but the bow.
    if (reduced || !rock) return;
    const el = driftRef.current;
    if (!el) return;

    /*
     * Two angles, nothing in between. `steps(1)` holds the start value for the
     * whole duration and jumps at the end, so with yoyo the sticker sits at its
     * resting angle for `duration`, flips to `rock`, sits there for `duration`,
     * and flips back — the on/off cadence the recording shows, rather than a
     * swing through the middle.
     */
    const tween = gsap.to(el, {
      rotation: rock,
      duration,
      delay,
      ease: "steps(1)",
      yoyo: true,
      repeat: -1,
      transformOrigin: "50% 50%",
    });

    return () => {
      tween.kill();
      gsap.set(el, { clearProps: "transform" });
    };
  }, [reduced, rock, duration, delay]);

  return (
    <div
      ref={driftRef}
      className="journal-sticker"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        height: height !== undefined ? `${height}%` : undefined,
        zIndex: z,
      }}
    >
      <div
        className="journal-sticker-tilt"
        style={{
          height: "100%",
          transform: rotate ? `rotate(${rotate}deg)` : undefined,
        }}
      >
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
