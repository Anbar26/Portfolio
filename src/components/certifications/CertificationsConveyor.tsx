"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrambleTextPlugin from "gsap/ScrambleTextPlugin";

import SectionHeading from "@/components/shared/SectionHeading";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { certifications, shortIssuer } from "@/data/certifications";
import CertPanel from "./CertPanel";
import CertFlipCard, { type OriginRect } from "./CertFlipCard";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

/**
 * TRANSITION 1 — the diagonal conveyor.
 *
 * Every panel walks the same path; they are simply offset from each other by one
 * "beat" of scroll. `s` below is a panel's position along that path:
 *
 *   s = -2    off-stage, past the top-right corner
 *   s = -1    upper slot — right of centre, clipped by the right edge
 *   s =  0    front slot — left of centre, largest, drawn over its neighbour
 *   s = +1.5  gone, out the bottom-left
 *
 * Two panels are on screen at once, meeting corner-to-corner, which is what
 * gives the reference its continuous-belt feel instead of a slideshow.
 *
 * x is in vw and y in vh, both measured from the centre of the stage. The slots
 * are placed so the belt never crosses the heading (top band), the readout
 * (top-left) or the caption (bottom-right).
 *
 * "gone" has to clear the viewport for the CURRENT card width, not the width the
 * path was first drawn for. At -72vw an enlarged plate still had ~17px inside
 * the frame when the belt finished, which is the edge that was showing under the
 * incoming Skills cards.
 */
type PathKey = { x: string; y: string; scale: number; rotate: number };

const DESKTOP_PATH: PathKey[] = [
  { x: "80vw", y: "-30vh", scale: 0.86, rotate: 1.2 },
  { x: "32vw", y: "-3vh", scale: 0.94, rotate: 0.5 },
  { x: "-6vw", y: "19vh", scale: 1.0, rotate: -0.3 },
  { x: "-48vw", y: "42vh", scale: 1.07, rotate: -1.1 },
  { x: "-104vw", y: "56vh", scale: 1.11, rotate: -1.4 },
];

/**
 * Tablet keeps the same choreography but pulls the horizontal travel in — at
 * 1024px a panel sized for the desktop path spends too long fully off-stage.
 */
const TABLET_PATH: PathKey[] = [
  { x: "74vw", y: "-26vh", scale: 0.86, rotate: 1.0 },
  { x: "30vw", y: "-4vh", scale: 0.94, rotate: 0.4 },
  { x: "-8vw", y: "18vh", scale: 1.0, rotate: -0.3 },
  { x: "-50vw", y: "40vh", scale: 1.06, rotate: -1.0 },
  { x: "-104vw", y: "52vh", scale: 1.09, rotate: -1.3 },
];

/**
 * Relative size of each certificate on the belt, in the order the data lists
 * them. Kept to a narrow spread: the card sets its own type in `cqw`, so a
 * heavily shrunk card would shrink its title with it.
 */
const LOGO_SCALE = [1.0, 0.94, 1.02, 1.07, 0.92, 1.08, 0.96];

/** Scroll length, in viewport heights, that one beat of the belt costs. */
const BEAT_VH = 0.46;
/** Path length in beats: s runs from -2 to +1.5. */
const PATH_BEATS = 3.5;

/**
 * Scroll maps to a *window* of the belt's timeline rather than the whole thing.
 *
 * Without this the pin opens on an empty stage and holds it for two beats while
 * the first panel crawls in from off-screen, then empties out again at the far
 * end — roughly a third of the pinned scroll spent on nothing. Starting the
 * window at beat 2 means panel 1 is already in the front slot and panel 2 in the
 * upper slot on the very first frame, the way the reference opens.
 */
const LEAD_BEATS = 2;
/*
 * Run the belt all the way to its final keyframe rather than stopping as the
 * last plate is *clearing* the frame. At 0.35 the last plate was still caught
 * between "exit" and "gone" when the pin ended — a corner of it was on screen at
 * the exact moment Skills took over. Zero means the last plate reaches "gone",
 * fully outside the viewport, before anything hands over.
 */
const TAIL_BEATS = 0;

/**
 * THE SCENE CHANGE IN FROM PROJECTS
 *
 * Must match SCENE_VH in ProjectStack: the two windows are the same stretch of
 * scroll seen from either side, and the whole point is that they run together.
 *
 * Without this the section simply arrives from below — a full viewport height of
 * dead scroll separates the two pins, so Projects has already gone before
 * anything here appears. Pulling the section up by that dead height plus the
 * scene window puts this pin live while Projects is still pinned, so one leaves
 * to the left as the other comes in from the right.
 *
 * The belt is held at its opening beat for the whole slide, so the conveyor
 * starts only once the section has landed — the existing animation is delayed,
 * never changed.
 */
const SCENE_VH = 0.9;
const SCENE_PULL_UP = `calc(-100vh - ${SCENE_VH * 100}vh)`;

export default function CertificationsConveyor() {
  const count = certifications.length;
  const reduced = usePrefersReducedMotion();
  const wideEnough = useMediaQuery("(min-width: 768px)");
  const animated = wideEnough && !reduced;

  /*
   * A certificate being read is a small state machine, because the flip has to
   * finish before the original card is put back:
   *   openCert  - which card is in the air
   *   origin    - the rect it launched from, so it can land back on it
   *   closeTick - bumped to ask the card to fly home
   *   pending   - a card clicked while another was open; opened once home
   */
  const [openCert, setOpenCert] = useState<number | null>(null);
  const [origin, setOrigin] = useState<OriginRect | null>(null);
  const [closeTick, setCloseTick] = useState(0);
  const pendingRef = useRef<number | null>(null);
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<HTMLButtonElement[]>([]);
  const captionRef = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const sceneRef = useRef<HTMLDivElement>(null);

  const setSlide = useCallback((el: HTMLButtonElement | null, i: number) => {
    if (el) slidesRef.current[i] = el;
  }, []);

  /** Measure the clicked card and hand it to the flip, hiding the original. */
  const openFrom = useCallback((i: number) => {
    const el = slidesRef.current[i];
    if (!el) return;
    const r = el.getBoundingClientRect();
    setOrigin({ left: r.left, top: r.top, width: r.width, height: r.height });
    setCloseTick(0);
    setOpenCert(i);
    el.style.visibility = "hidden";
  }, []);

  /** Click a card: open it, or send the open one home first. */
  const handleCardClick = useCallback(
    (i: number) => {
      if (openCert === null) {
        openFrom(i);
        return;
      }
      if (openCert === i) return;
      pendingRef.current = i;
      setCloseTick((t) => t + 1);
    },
    [openCert, openFrom]
  );

  const requestClose = useCallback(() => setCloseTick((t) => t + 1), []);

  /** The card has landed: reveal the original, then honour any queued click. */
  const handleClosed = useCallback(() => {
    if (openCert !== null) {
      const el = slidesRef.current[openCert];
      if (el) el.style.visibility = "";
    }
    setOpenCert(null);
    setOrigin(null);
    setCloseTick(0);
    const next = pendingRef.current;
    pendingRef.current = null;
    if (next !== null) requestAnimationFrame(() => openFrom(next));
  }, [openCert, openFrom]);

  // ── The conveyor (>= 768px, motion allowed) ────────────────────────────
  useEffect(() => {
    if (!animated) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          isDesktop: "(min-width: 1024px)",
          isTablet: "(min-width: 768px) and (max-width: 1023.98px)",
        },
        (self) => {
          const path = self.conditions?.isDesktop ? DESKTOP_PATH : TABLET_PATH;
          const slides = slidesRef.current.filter(Boolean);
          if (!slides.length) return;

          // The panels are anchored at the stage centre; every position below is
          // an offset from it, so the same numbers hold at any viewport size.
          gsap.set(slides, { xPercent: -50, yPercent: -50, force3D: true });

          // The last panel still needs a whole path after the first has finished
          // its own, hence the extra PATH_BEATS.
          const totalBeats = count - 1 + PATH_BEATS;
          const fromBeat = LEAD_BEATS;
          const toBeat = totalBeats - TAIL_BEATS;

          // Built paused; a scrubbed proxy scrubs a slice of it (see LEAD_BEATS).
          const belt = gsap.timeline({ paused: true, defaults: { ease: "none" } });

          const [enter, upper, front, exit, gone] = path;
          slides.forEach((slide, i) => {
            belt.fromTo(
              slide,
              { ...enter },
              {
                keyframes: [
                  { ...upper, duration: 1 },
                  { ...front, duration: 1 },
                  { ...exit, duration: 1 },
                  { ...gone, duration: 0.5 },
                ],
                ease: "none",
              },
              i
            );
          });
          belt.time(fromBeat);

          let lastActive = -1;
          const head = { beat: fromBeat };

          // Overlap the tail of the Projects pin. Set before the trigger is
          // built so its start is measured against the position it will hold.
          gsap.set(section, { marginTop: SCENE_PULL_UP });

          const beltVh = BEAT_VH * (toBeat - fromBeat);
          const totalVh = beltVh + SCENE_VH;
          /** Share of this trigger spent sliding in, before the belt moves. */
          const sceneLen = SCENE_VH / totalVh;
          const scene = sceneRef.current;

          const scrubber = gsap.timeline({
            defaults: { ease: "none" },
            onUpdate: () => belt.time(head.beat),
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + window.innerHeight * totalVh,
              scrub: 1,
              pin: stage,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 1,
              onUpdate: (st) => {
                  /*
                   * The belt only starts once the slide-in is done, so its own
                   * progress is this trigger's progress minus that lead,
                   * renormalised. Everything downstream — rail, caption, active
                   * index — reads from this, so they arrive together.
                   */
                  const beltP = Math.max(0, (st.progress - sceneLen) / (1 - sceneLen));
                  // Panel i occupies the front slot at belt time i + 2.
                  const beat = fromBeat + beltP * (toBeat - fromBeat);

                  const next = gsap.utils.clamp(0, count - 1, Math.round(beat - 2));
                  if (next === lastActive) return;
                  lastActive = next;
                  setActive(next);

                  const el = captionRef.current;
                  if (!el) return;
                  gsap.to(el, {
                    duration: 0.55,
                    ease: "none",
                    overwrite: true,
                    scrambleText: {
                      text: shortIssuer(certifications[next].issuer),
                      chars: "upperAndLowerCase",
                      speed: 0.9,
                      revealDelay: 0.1,
                    },
                  });
              },
            },
          });

          /*
           * Slide in from the right while Projects leaves to the left. On the
           * scene wrapper rather than the stage — the pin owns the stage's
           * transform — and the stage stays `overflow: hidden`, so nothing here
           * can widen the page.
           */
          if (scene) {
            scrubber.fromTo(
              scene,
              { xPercent: 108 },
              { xPercent: 0, duration: sceneLen, ease: "power2.inOut" },
              0
            );
          }

          // The belt runs only after the section has landed.
          scrubber.fromTo(
            head,
            { beat: fromBeat },
            { beat: toBeat, duration: 1 - sceneLen },
            sceneLen
          );

          return () => {
            scrubber.scrollTrigger?.kill();
            scrubber.kill();
            belt.kill();
            gsap.set(slides, { clearProps: "all" });
          };
        }
      );
    }, section);

    return () => ctx.revert();
  }, [animated, count]);

  // ── Simplified belt for phones ────────────────────────────────────────
  // Same language — diagonal drift, scale, a whisper of rotation — but the
  // panels stay in normal flow. Nothing is pinned on a device where a pinned
  // viewport-height stage fights the collapsing address bar.
  useEffect(() => {
    if (animated || reduced) return;
    const list = listRef.current;
    if (!list) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".cert-flow-item").forEach((item, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        gsap.fromTo(
          item,
          { xPercent: 8 * dir, rotate: 1.2 * dir, scale: 0.92 },
          {
            xPercent: -8 * dir,
            rotate: -1.2 * dir,
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: item,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      });
    }, list);

    return () => ctx.revert();
  }, [animated, reduced]);

  // ── Static list: phones, and anyone who asked for reduced motion ───────
  //
  // The `key` is load-bearing. `animated` can only be resolved on the client, so
  // the server always renders the conveyor and the first client pass may swap to
  // this branch. Without a distinct key React reuses the same <section> and
  // <button> nodes, and the inline transform GSAP had already written for the
  // belt's entry keyframe rides along onto the static cards — which is exactly
  // the reduced-motion reader who will never get a tween to overwrite it.
  if (!animated) {
    return (
      <section
        key="cert-list"
        id="certifications"
        className="relative py-24 px-4 overflow-hidden"
      >
        <div className="max-w-3xl mx-auto">
          <SectionHeading title="Certifications" />
          {/* The -mt-10 that used to tuck this under the heading's ornament went
              with the heading; without it the line would ride above the container. */}
          <p className="gs-up text-center text-rose-400/70 text-[11px] tracking-[0.3em] uppercase font-light mb-12">
            tap to view
          </p>

          {/* A grid of marks, not a stack of plates — a full-width 16/10 box per
              logo would just be the card silhouette again, empty. */}
          <div ref={listRef} className="grid grid-cols-1 gap-y-10 place-items-center">
            {certifications.map((c, i) => (
              <button
                key={c.name}
                type="button"
                ref={(el) => setSlide(el, i)}
                onClick={() => handleCardClick(i)}
                aria-label={`View ${c.name}`}
                className="cert-flow-item block w-full h-60 bg-transparent border-0 p-0 cursor-pointer will-change-transform"
              >
                <CertPanel cert={c} />
              </button>
            ))}
          </div>
        </div>

        {openCert !== null && origin && (
          <CertFlipCard
            key={openCert}
            cert={certifications[openCert]}
            origin={origin}
            closeSignal={closeTick}
            onRequestClose={requestClose}
            onClosed={handleClosed}
          />
        )}
      </section>
    );
  }

  return (
    <section key="cert-conveyor" id="certifications" ref={sectionRef} className="relative">
      <div ref={stageRef} className="cert-conveyor relative h-screen w-full overflow-hidden">
        {/* Everything that slides in during the scene change lives in here, so
            the pinned stage itself is never transformed. */}
        <div ref={sceneRef} className="cert-scene">
        <SectionHeading title="Certifications" />

        {/* Position readout — top-left, where the belt never reaches */}
        <div className="absolute left-8 lg:left-14 top-28 z-20 pointer-events-none flex flex-col gap-3">
          <span className="font-serif text-sm text-[#5c1a2e]/50 tabular-nums">
            {String(active + 1).padStart(2, "0")}
            <span className="text-[#5c1a2e]/25"> / {String(count).padStart(2, "0")}</span>
          </span>
          <span className="text-rose-400/60 text-[10px] tracking-[0.3em] uppercase font-light">
            click a card to read it
          </span>
        </div>

        {/* The belt */}
        <div className="absolute inset-0">
          {certifications.map((c, i) => (
            <button
              key={c.name}
              type="button"
              ref={(el) => setSlide(el, i)}
              onClick={() => handleCardClick(i)}
              aria-label={`View ${c.name}`}
              className="cert-slide absolute left-1/2 top-1/2 bg-transparent border-0 p-0 cursor-pointer"
              // Marks earlier in the list are further along the belt, so they
              // pass in front of the ones still coming in behind them.
              style={
                {
                  zIndex: count - i,
                  "--cert-scale": LOGO_SCALE[i] ?? 1,
                } as React.CSSProperties
              }
            >
              <CertPanel cert={c} />
            </button>
          ))}
        </div>

        {/* Caption — scramble-decodes to the issuer of whichever panel holds the
            front slot, like the reference's bottom-right title. */}
        <div className="absolute right-8 lg:right-14 bottom-16 z-20 pointer-events-none text-right">
          <p className="text-[10px] tracking-[0.35em] uppercase text-rose-400/70 font-light mb-1">
            {certifications[active].status}
          </p>
          <span
            ref={captionRef}
            className="font-serif text-3xl lg:text-[2.75rem] leading-none text-[#5c1a2e] block whitespace-nowrap"
          >
            {shortIssuer(certifications[0].issuer)}
          </span>
        </div>
        </div>
      </div>

      {openCert !== null && origin && (
        <CertFlipCard
          key={openCert}
          cert={certifications[openCert]}
          origin={origin}
          closeSignal={closeTick}
          onRequestClose={requestClose}
          onClosed={handleClosed}
        />
      )}
    </section>
  );
}
