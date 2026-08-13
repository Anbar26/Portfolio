"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import SectionHeading from "@/components/shared/SectionHeading";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { journalSpread } from "@/data/experiences";
import JournalSticker, { type StickerSpec } from "./JournalSticker";
import JournalPolaroid from "./JournalPolaroid";
import JournalPageContent from "./JournalPageContent";

gsap.registerPlugin(ScrollTrigger);

/*
 * THE JOURNAL SPREAD
 *
 * Every position below is a percentage of the journal box, and the journal box
 * is a fixed 1.2857 aspect ratio — the ratio of the book artwork itself. That is
 * the whole trick: one width drives the composition, so the spread holds its
 * shape from a phone to a wide desktop without a single hand-tuned breakpoint
 * for the decoration.
 *
 * The numbers are measured off the design rather than eyeballed. The book in the
 * reference IS this artwork, scaled uniformly, so solving for that scale gives
 * the journal's true box and every sticker's placement falls out of it.
 *
 * Stickers are sized by WIDTH only. Height follows the artwork so nothing is
 * ever stretched, which also means these numbers survive the assets being
 * re-exported at another resolution.
 */

/** Back-to-front. The vine tucks under the stars; the frames sit on top of everything. */
const Z = {
  vine: 1,
  starSilver: 2,
  starPink: 3,
  bow: 2,
  blossom: 5,
  entry: 3,
  frame: 6,
  lace: 7,
} as const;

/*
 * Only the bow moves. Everything else on the spread is still — no `rock`, no
 * tween created for it at all.
 *
 * Its two angles and their timing come from the reference recording: a 12
 * degree swing, each angle held about half a second, flipping between the two
 * with nothing in between. See JournalSticker for why that is stepped rather
 * than eased.
 */
const STICKERS: StickerSpec[] = [
  {
    src: "/journal/sticker-vine.png",
    left: -4.7,
    top: 10.8,
    width: 17.6,
    z: Z.vine,
  },
  {
    src: "/journal/sticker-star-silver.png",
    left: -7.2,
    top: -5.5,
    width: 20,
    rotate: -18,
    z: Z.starSilver,
  },
  {
    src: "/journal/sticker-star-pink.png",
    left: 4.7,
    top: -5.5,
    width: 17.1,
    z: Z.starPink,
  },
  {
    src: "/journal/sticker-bow.png",
    // the only sticker that moves
    rock: 12,
    duration: 0.5,
    left: 78.9,
    top: -8.1,
    width: 25.8,
    z: Z.bow,
  },
  {
    src: "/journal/sticker-blossom.png",
    left: 79.4,
    top: 73.4,
    width: 30.3,
    z: Z.blossom,
  },
  {
    // Lace along the foot of the left page. Sits above the Tenderd card, whose
    // lower corner it laps over in the design.
    src: "/journal/sticker-lace.png",
    left: 18.2,
    top: 62.6,
    width: 32.4,
    height: 33.9,
    z: Z.lace,
  },
];

/** Left page carries the first entry, right page the second — as in the design. */
/*
 * The revised design moved the Tenderd card and flipped it: measuring the orange
 * square in both versions puts its centre 12.38% of the journal further left and
 * 1.03% higher, at the same size, with the bow now on the right. Mirroring turns
 * the -12 tilt into the +12 the new design shows, so the angle is left alone.
 * The PointMatrix card is untouched — a pixel diff of the two designs shows the
 * right-hand page did not change at all.
 */
const FRAMES = [
  { left: 14.92, top: 54.47, width: 21.1, rotate: -12, mirror: true },
  { left: 51.9, top: 4.8, width: 24.5, rotate: 6 },
];

/** Text boxes, written around the frames and clear of the vine. */
const ENTRIES = [
  { left: 14.5, top: 12.5, width: 30 },
  { left: 55, top: 45, width: 33 },
];

export default function ExperienceJournal() {
  const sectionRef = useRef<HTMLElement>(null);
  const journalRef = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  /*
   * The spread needs real width to work: two pages of writing on a 750px book
   * puts the entry type around 9px, which is decoration, not reading. Below this
   * the book steps back to being a header ornament and the entries become cards —
   * an adaptation rather than a shrink. 1024 is where the two-page layout stops
   * being legible, not where a device category starts.
   */
  const compact = !useMediaQuery("(min-width: 1024px)");

  // A single, quiet entrance. No pin and no scrub — the page turn is a separate
  // job and nothing here should get in its way later.
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const journal = journalRef.current;
    if (!section || !journal) return;

    const ctx = gsap.context(() => {
      gsap.from(journal, {
        y: 40,
        autoAlpha: 0,
        ease: "power3.out",
        scrollTrigger: { trigger: section, start: "top 75%", once: true },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="experience" ref={sectionRef} className="journal-section">
      <SectionHeading title="Experience" />

      <div ref={journalRef} className="journal" data-spread="1">
        {/* The book. Everything else is positioned against this box. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          className="journal-base"
          src="/journal/journal-base.png"
          alt=""
          aria-hidden
          draggable={false}
        />

        {/*
          On a phone the spread is unreadable as a spread, so the pages stack and
          the book becomes a backdrop. The decoration that lives on the outer
          edges would sit in the middle of nothing there, so only the corner
          pieces stay — that is an adaptation, not a shrink.
        */}
        {STICKERS.filter((s) => !compact || s.src.includes("star") || s.src.includes("blossom")).map(
          (s) => (
            <JournalSticker key={s.src} {...s} />
          )
        )}

        {!compact &&
          journalSpread.map((entry, i) => (
            <JournalPolaroid
              key={entry.company}
              logo={entry.logo}
              logoAlt={entry.logoAlt}
              z={Z.frame}
              {...FRAMES[i]}
            />
          ))}

        {!compact &&
          journalSpread.map((entry, i) => (
            <JournalPageContent key={entry.company} entry={entry} z={Z.entry} {...ENTRIES[i]} />
          ))}
      </div>

      {/* Phones read the entries as ordinary stacked cards under the book. */}
      {compact && (
        <div className="journal-stack">
          {journalSpread.map((entry) => (
            <article key={entry.company} className="journal-card">
              <div className="journal-card-head">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={entry.logo} alt={entry.logoAlt} className="journal-card-logo" />
                <div>
                  <h3 className="journal-entry-company">{entry.company}</h3>
                  <p className="journal-entry-role">{entry.role}</p>
                </div>
              </div>
              <p className="journal-entry-period">
                {entry.period} <span aria-hidden>·</span> {entry.location}
              </p>
              <p className="journal-entry-lede">{entry.lede}</p>
              <ul className="journal-entry-notes">
                {entry.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
              <p className="journal-entry-tools">{entry.tools.join("  ·  ")}</p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
