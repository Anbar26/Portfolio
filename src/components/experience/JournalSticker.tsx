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
   * How far the sticker rocks, in degrees, measured from its resting tilt.
   *
   * The reference recording swings the bow through 12°, which is the value the
   * small pieces use. Anything anchored to a page edge wants much less — see
   * the lace in ExperienceJournal.
   */
  rock?: number;
  /** Seconds for one leg of the rock. Vary it so stickers fall out of step. */
  duration?: number;
  /** Head start, so nothing begins together. */
  delay?: number;
};

/**
 * One sticker on the spread — it rocks gently, the way the reference does.
 *
 * Measured off that recording frame by frame: the bow's pixel area holds
 * constant while its bounding box grows in both directions, which is rotation
 * rather than translation or scale. The swing is about 12°, and the few pixels
 * of sideways shift that come with it are the centroid moving around an
 * off-centre pivot, not a translation of its own.
 *
 * Two nested elements, and the split still matters: the OUTER box is the only
 * thing GSAP touches, the resting tilt stays on the INNER one. The rock is then
 * a rotation applied on top of the tilt rather than something that has to know
 * about it — a sticker resting at -18° swings 12° around that angle, and the
 * two never have to be reconciled in the tween. It also means the tilt survives
 * a reduced-motion visit, where no tween is ever created.
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
  rock = 12,
  duration = 3,
  delay = 0,
}: StickerSpec) {
  const driftRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const el = driftRef.current;
    if (!el) return;

    /*
     * Rest -> rock -> rest. Rotation only: no x, y or scale, so the artwork
     * turns as one piece and always comes back to exactly the angle it was
     * placed at. Stickers fall out of step through their own duration and
     * delay rather than by starting part-way through the swing.
     *
     * Eased rather than stepped. The reference snaps between two angles and
     * holds each for about half a second, which is how a two-frame sticker
     * behaves rather than a decision about the motion; sine.inOut gives the
     * same arc as a continuous swing.
     */
    const tween = gsap.to(el, {
      rotation: rock,
      duration,
      delay,
      ease: "sine.inOut",
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
