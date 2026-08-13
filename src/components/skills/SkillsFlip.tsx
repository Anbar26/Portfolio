"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Flip from "gsap/Flip";

import SectionHeading from "@/components/shared/SectionHeading";
import { useMediaQuery, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { skillGroups } from "@/data/skills";
import SkillFlipCard from "./SkillFlipCard";
import DotRing from "./DotRing";

gsap.registerPlugin(ScrollTrigger, Flip);

/** Resting tilt of each card while it is still part of the stack, in degrees. */
const FAN = [-6, -3, 0];

/** Pinned scroll length, in viewport heights, for the fan -> row flip. */
const PIN_VH = 2.1;


/**
 * HANDOFF — how this section takes over from the certifications conveyor.
 *
 * The conveyor pins a 100vh stage. When that pin releases, the stage still has to
 * scroll its own height out of the viewport before *this* section's top reaches
 * the top and its own pin engages — a full viewport height of dead scroll where
 * the belt has already emptied and this stage is climbing into view from below,
 * carrying the card stack up with it. The stack then reverses and drops once the
 * pin catches. That climb-then-reverse is the break between the two effects.
 *
 * Pulling this section up by its own stage height (100vh) deletes exactly that
 * dead zone, so the pin engages on the frame the conveyor's releases. The extra
 * overlap starts the drop while the last plate is still clearing the bottom-left
 * corner, so the two effects hand off rather than queue.
 *
 * Applied from the effect rather than as a class: before GSAP is up there is no
 * pin holding the conveyor in place, and a section yanked 1.45 screens up would
 * simply land on top of it.
 */
/*
 * A clean gap, not an overlap.
 *
 * The pull-up still deletes the dead viewport height that would otherwise sit
 * between the two pins, but it now stops SHORT of the conveyor's pin instead of
 * reaching into it. Certifications finishes and its plates are gone; a quarter
 * screen of empty scroll follows; only then does this pin engage and the cards
 * begin to fall. The two never share a frame.
 */
const HANDOFF_GAP_VH = 0.25;
const HANDOFF_PULL_UP = `calc(-100vh + ${HANDOFF_GAP_VH * 100}vh)`;

/*
 * THE TRAVELLING HIGHLIGHT
 *
 * One marker per card that SLIDES from chip to chip. The earlier version lit
 * each chip where it stood and dimmed the last one, which reads as a crossfade
 * however short you make it — the movement has to be the effect, so a single
 * block actually travels and the chip it lands on hands over its label.
 *
 * Each card keeps its own pace so the three never move in lockstep.
 */
/** Seconds the marker spends travelling between two chips, per card. */
const MOVES = [0.52, 0.6, 0.46];
/** Seconds it rests on a chip before moving on, per card. */
const HOLDS = [0.95, 1.1, 0.85];

/**
 * TRANSITION 2 — stacked fan ➝ three-card row, driven by GSAP Flip.
 *
 * The section renders in its *final* layout: three columns, list side up. That
 * is what a crawler, a reader with JS off, and anyone on reduced motion gets.
 *
 * The animation is then built backwards from there — add `.is-stacked`, let Flip
 * measure the fan, drop the class again, and hand `Flip.from()` to a scrubbed
 * timeline. Nothing about the resting DOM depends on the animation running.
 *
 *   0.00 → 0.30  the fan drops in from above the stage
 *   0.24 → 0.70  the dotted ring blooms outward behind it
 *   0.30 → 0.78  Flip: stacked fan  ➝  three columns
 *   0.32 → 0.70  the fan tilt unwinds to square
 *   0.44 → 0.86  each card turns on its Y axis, staggered — plate ➝ list
 *   0.76 → 1.02  the chips settle in
 *   1.02 → 1.20  a beat to read the finished layout before the pin releases
 */
export default function SkillsFlip() {
  const reduced = usePrefersReducedMotion();
  const wideEnough = useMediaQuery("(min-width: 768px)");
  const animated = wideEnough && !reduced;

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  /*
   * The highlight loop. Deliberately not tied to the flip effect: it wants to run
   * on phones too, where the section is a plain stacked list and nothing is
   * pinned. Chips are grouped by `.skill-tiles`, which both layouts render.
   */
  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    if (!section) return;

    const cards = gsap.utils.toArray<HTMLElement>(".skill-tiles", section);
    if (!cards.length) return;

    const ctx = gsap.context(() => {
      const DIM = "rgba(92,26,46,0.55)";
      const LIT = "rgba(255,247,245,0.98)";
      const timelines: gsap.core.Timeline[] = [];

      cards.forEach((card, g) => {
        const tiles = gsap.utils.toArray<HTMLElement>(".skill-tile", card);
        const marker = card.querySelector<HTMLElement>(".skill-tiles-marker");
        if (tiles.length < 2 || !marker) return;

        const n = tiles.length;
        const labels = tiles.map((t) => t.querySelector<HTMLElement>(".skill-tile-label"));
        const wear = (i: number, on: boolean) => {
          const l = labels[i];
          // Set, not tweened: the marker is already on the chip, so the label
          // should simply be light — anything gradual here is the crossfade again.
          if (l) gsap.set(l, { color: on ? LIT : DIM });
        };

        /*
         * Function-based values, so every hop re-reads the chip's live box. That
         * is what keeps the marker correct after a resize or a font settling,
         * without a observer or a rebuild — the next hop simply measures again.
         */
        const box = (i: number) => ({
          x: () => tiles[i].offsetLeft,
          y: () => tiles[i].offsetTop,
          width: () => tiles[i].offsetWidth,
          height: () => tiles[i].offsetHeight,
        });

        const first = box(0);
        gsap.set(marker, {
          x: first.x(), y: first.y(), width: first.width(), height: first.height(),
          opacity: 1,
        });
        tiles.forEach((_, i) => wear(i, i === 0));

        const MOVE = MOVES[g % MOVES.length];
        const HOLD = HOLDS[g % HOLDS.length];

        const tl = gsap.timeline({ repeat: -1, repeatRefresh: true, paused: true });
        let at = 0;
        for (let k = 1; k <= n; k++) {
          const from = (k - 1) % n;
          const to = k % n;
          tl.to(marker, { ...box(to), duration: MOVE, ease: "power2.inOut" }, at);
          // Hand the label over as the marker arrives, not before it sets off.
          tl.call(() => { wear(from, false); wear(to, true); }, [], at + MOVE * 0.62);
          at += MOVE + HOLD;
        }
        timelines.push(tl);
      });

      /*
       * Runs only while the section is on screen, and resumes rather than
       * restarts — `play()` from a paused timeline picks up where it stopped.
       */
      const io = new IntersectionObserver(
        ([entry]) => timelines.forEach((tl) => (entry.isIntersecting ? tl.play() : tl.pause())),
        { threshold: 0.15 }
      );
      io.observe(section);

      return () => {
        io.disconnect();
        timelines.forEach((tl) => tl.kill());
      };
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  useEffect(() => {
    if (!animated) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    const grid = gridRef.current;
    if (!section || !stage || !grid) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        const items = gsap.utils.toArray<HTMLElement>(".skill-flip-item", grid);
        const inners = items
          .map((el) => el.querySelector<HTMLElement>(".skill-flip-inner"))
          .filter((el): el is HTMLElement => Boolean(el));
        const ring = stage.querySelector<HTMLElement>(".skills-dot-ring");
        if (!items.length || !ring) return;

        // Overlap the conveyor's tail. Set before any trigger is built so the
        // measurements below are taken against the position this will actually
        // hold; matchMedia reverts it under 768px, where nothing is pinned.
        gsap.set(section, { marginTop: HANDOFF_PULL_UP });

        /*
         * With the pull-up in place this stage spends ~1.45 screens overlapping
         * the still-pinned conveyor before its own pin engages. It is transparent,
         * so the belt reads straight through it — but the cards sit at the fan's
         * start offset, which lands them mid-viewport during that climb. Hiding
         * the stage until the trigger is live keeps the conveyor alone on screen.
         *
         * No pop when it flips back on: at progress 0 the cards are parked a
         * screen-and-a-half above the stage's centre, so the first visible frame
         * is empty either way and the reveal is the drop itself.
         */
        const revealStage = (visible: boolean) =>
          gsap.set(stage, { autoAlpha: visible ? 1 : 0 });

        const build = () => {
          // Wipe whatever a previous build left inline before measuring.
          gsap.set([...items, ...inners, ring], { clearProps: "all" });
          gsap.set(inners, {
            rotate: (i: number) => FAN[i] ?? 0,
            rotationY: 0,
            transformPerspective: 1200,
            transformOrigin: "50% 50%",
          });

          // Size the fan from a real, settled card rather than a guess, so the
          // cards only travel and turn — they don't visibly grow or shrink.
          const card = items[0].getBoundingClientRect();
          grid.style.setProperty("--stack-w", `${card.width}px`);
          grid.style.setProperty("--stack-h", `${card.height}px`);

          /*
           * How far above the stage the fan starts.
           *
           * This has to clear the *tallest* card completely, not merely start
           * "high up". The pin engaging is what reveals the stage, so anything
           * still inside it at that instant appears out of nowhere instead of
           * sliding in. A flat -62vh was ~120px short against the middle group
           * (eight chips against the others' six) and popped a sliver of it in
           * at the top edge.
           *
           * Measured rather than guessed: the groups differ in height, and that
           * height moves with viewport, font and content. The rects are read
           * after the fan tilt is applied, so the rotated box is what's cleared,
           * and before `scale: 0.8`, which only ever shrinks it — so the number
           * errs to the safe side on both counts.
           */
          const stageTop = stage.getBoundingClientRect().top;
          const dropFrom =
            inners.reduce((lowest, el) => Math.max(lowest, el.getBoundingClientRect().bottom), 0) -
            stageTop +
            32;

          // Measure the fan, then immediately return to the real layout. Both
          // happen inside one synchronous block, so nothing paints in between.
          grid.classList.add("is-stacked");
          const state = Flip.getState(items);
          grid.classList.remove("is-stacked");

          // After measuring — visibility:hidden keeps layout, but there is no
          // reason to have measured against a half-reverted state on a rebuild.
          revealStage(false);

          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + window.innerHeight * PIN_VH,
              scrub: 1,
              pin: stage,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 0,
              // Live only from the moment the pin engages. onRefresh covers a
              // load that lands mid-section, where neither enter fires.
              onEnter: () => revealStage(true),
              onEnterBack: () => revealStage(true),
              onLeaveBack: () => revealStage(false),
              onRefresh: (self) => revealStage(self.isActive || self.progress > 0),
            },
          });

          tl.fromTo(
            inners,
            { y: -dropFrom, scale: 0.8 },
            { y: 0, scale: 1, duration: 0.3, ease: "power2.out", stagger: 0.03 },
            0
          );

          tl.fromTo(
            ring,
            { scale: 0.72, rotate: -12, autoAlpha: 0 },
            { scale: 1.06, rotate: 7, autoAlpha: 1, duration: 0.46, ease: "power2.out" },
            0.24
          );

          // `scale: true` keeps the size change on transforms instead of
          // animating width/height, so the whole flip stays on the compositor.
          // Small stagger on purpose: at 0.06 the third card was still sitting on
          // the second's shoulder halfway through. The cascade the eye reads is
          // the flip below, not the separation.
          tl.add(
            Flip.from(state, {
              duration: 0.48,
              ease: "power3.inOut",
              scale: true,
              stagger: 0.03,
            }),
            0.3
          );

          tl.to(inners, { rotate: 0, duration: 0.38, ease: "power2.inOut", stagger: 0.05 }, 0.32);
          tl.to(
            inners,
            { rotationY: 180, duration: 0.42, ease: "power2.inOut", stagger: 0.055 },
            0.44
          );

          tl.to(ring, { autoAlpha: 0, scale: 1.24, duration: 0.24, ease: "power1.in" }, 0.7);

          tl.from(
            ".skill-tiles",
            { y: 16, autoAlpha: 0, duration: 0.14, stagger: 0.05, ease: "power2.out" },
            0.76
          );

          // Hold the finished composition for a beat before the pin releases.
          tl.to({}, { duration: 0.18 }, 1.02);

        };

        /*
         * Each build lives in its own context so a rebuild can `revert()` it.
         * Killing the ScrollTrigger directly is not enough: it leaves the
         * pin-spacer in the DOM, the next build nests a second one inside it,
         * and the section stops reserving its pin distance — the stage then
         * scrolls past with the cards frozen part-way through the transition.
         */
        let scope: gsap.Context | null = null;
        let disposed = false;

        const make = () => {
          scope = gsap.context(build, section);
        };

        const rebuild = () => {
          if (disposed) return;
          scope?.revert();
          make();
          ScrollTrigger.refresh();
        };

        make();

        // A late webfont changes the card's measured height, which would leave
        // the captured rects pointing at the wrong place.
        if (document.fonts && document.fonts.status !== "loaded") {
          document.fonts.ready.then(rebuild);
        }

        // Flip captured pixel rects, so a width change invalidates them. Height
        // changes are ignored on purpose — that is just a mobile URL bar.
        let lastWidth = window.innerWidth;
        let pending = 0;
        const onResize = () => {
          window.clearTimeout(pending);
          pending = window.setTimeout(() => {
            if (Math.abs(window.innerWidth - lastWidth) < 40) return;
            lastWidth = window.innerWidth;
            rebuild();
          }, 220);
        };
        window.addEventListener("resize", onResize);

        return () => {
          disposed = true;
          window.clearTimeout(pending);
          window.removeEventListener("resize", onResize);
          scope?.revert();
        };
      });
    }, section);

    return () => ctx.revert();
  }, [animated]);

  // ── Phones and reduced motion: the same three cards, stacked and flat ──
  //
  // Distinct `key` per branch — see the note in CertificationsConveyor. `animated`
  // resolves client-side only, so React would otherwise reuse the nodes across the
  // swap and keep whatever transform the flip had already written on them.
  if (!animated) {
    return (
      <section key="skills-flat" id="skills" className="relative py-24 px-4 overflow-hidden">
        <div className="max-w-2xl mx-auto">
          <SectionHeading title="Skills" />
          <div className="space-y-6">
            {skillGroups.map((group, i) => (
              <div key={group.title} className="gs-up">
                <SkillFlipCard group={group} index={i} flip={false} />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    // z-10 so that during the handoff overlap this stage layers over the
    // conveyor rather than under it — the stack has to drop in front of the
    // last plate, not behind it.
    <section key="skills-flip" id="skills" ref={sectionRef} className="relative z-10">
      {/* Padding is symmetric now that the heading band is gone — the top used to
          be pt-24 to clear it, which left the grid sitting below true centre. */}
      <div
        ref={stageRef}
        className="skills-stage relative h-screen w-full overflow-hidden flex items-center justify-center px-4 py-12"
      >
        <DotRing />

        <SectionHeading title="Skills" />

        <div ref={gridRef} className="skills-flip-grid">
          {skillGroups.map((group, i) => (
            <SkillFlipCard key={group.title} group={group} index={i} flip />
          ))}
        </div>
      </div>
    </section>
  );
}
