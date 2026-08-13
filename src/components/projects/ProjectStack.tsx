"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

import SectionHeading from "@/components/shared/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { projects } from "@/data/projects";
import ProjectCard from "./ProjectCard";

gsap.registerPlugin(ScrollTrigger);

/*
 * THE PROJECT PILE
 *
 * Cards are dealt onto a pile rather than swapped in a carousel. Card i sits
 * off-stage past the top-left corner until its turn, then slides down across the
 * pile and lands on it, covering what came before — which stays underneath and
 * keeps showing an edge. Nothing fades; every card is a physical object that
 * arrives and then stays.
 *
 * Because a later card always lands ON TOP, z-index is simply the card's index —
 * no restacking mid-flight, which is what makes the motion read as one object
 * moving rather than a crossfade between two.
 *
 * The whole thing is scrubbed against a pinned section: stop scrolling and a card
 * hangs wherever it is, mid-deal.
 */

/** Resting pose per card, so the pile fans instead of stacking dead flat. */
const REST = [
  { x: -3.0, y: -1.6, rot: -2.6 },
  { x: 2.4, y: 1.4, rot: 1.9 },
  { x: -1.4, y: 2.6, rot: -1.3 },
  { x: 3.0, y: -1.0, rot: 2.4 },
  { x: -2.2, y: 1.9, rot: -2.0 },
  { x: 1.6, y: -2.4, rot: 1.4 },
];

/** Scroll spent on one card being dealt, in viewport heights. */
const STEP_VH = 1.15;
/** A beat before the first deal and after the last, so neither is clipped. */
const LEAD_VH = 0.35;

/**
 * The scene change out of Projects, in viewport heights.
 *
 * Once the pile is complete the stage keeps its pin for this long while the
 * whole scene slides off to the left. Certifications is pulled up to overlap
 * exactly this window and slides in from the right at the same time, so the two
 * cross rather than one waiting for the other — see SCENE_VH in
 * CertificationsConveyor, which must match this.
 */
export const SCENE_VH = 0.9;

export default function ProjectStack() {
  const count = projects.length;
  const reduced = usePrefersReducedMotion();
  const [active, setActive] = useState(0);

  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const metaRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reduced) return;
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add(
        { isWide: "(min-width: 768px)", isNarrow: "(max-width: 767.98px)" },
        (self) => {
          const narrow = !!self.conditions?.isNarrow;
          const cards = cardsRef.current.filter(Boolean);
          if (cards.length < 2) return;

          /*
           * Where a card waits its turn. Past -100% so a waiting card is fully
           * clear of the stage — at -86% a slice of every undealt card sat in
           * the top-left corner, reading as one pale shape rather than an empty
           * table. A phone has far less room either side, so the deal comes in
           * shallower and turns less: the same gesture, scaled to the space.
           */
          const FROM = narrow
            ? { xPercent: -120, yPercent: -100, rotate: -14 }
            : { xPercent: -145, yPercent: -92, rotate: -20 };
          const restOf = (i: number) => {
            const r = REST[i % REST.length];
            return narrow
              ? { xPercent: r.x * 0.5, yPercent: r.y * 0.5, rotate: r.rot * 0.6 }
              : { xPercent: r.x, yPercent: r.y, rotate: r.rot };
          };

          // Card 0 is already on the table; the rest wait off-stage.
          gsap.set(cards[0], { ...restOf(0), scale: 1, force3D: true });
          cards.slice(1).forEach((c) => gsap.set(c, { ...FROM, scale: 1.05, force3D: true }));

          const steps = count - 1;
          /*
           * No scene change below the Certifications breakpoint. Under 768px the
           * conveyor is deliberately a static list — it has no pinned stage to
           * slide in — so exiting left there would just carry the pile off to an
           * empty screen. Narrow screens keep the plain section-to-section flow.
           */
          const sceneVh = narrow ? 0 : SCENE_VH;
          const total = STEP_VH * steps + LEAD_VH * 2 + sceneVh;
          const tl = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => "+=" + window.innerHeight * total,
              scrub: 0.6,
              pin: stage,
              pinSpacing: true,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              refreshPriority: 2,
              onUpdate: (st) => {
                // Which card is on top: the deal for card i completes at i/steps.
                const p = (st.progress * total - LEAD_VH) / STEP_VH;
                const next = gsap.utils.clamp(0, count - 1, Math.round(p + 0.001));
                setActive((cur) => (cur === next ? cur : next));
              },
            },
          });

          const lead = LEAD_VH / total;
          const stepLen = STEP_VH / total;
          const sceneLen = sceneVh / total;

          cards.slice(1).forEach((card, k) => {
            const at = lead + k * stepLen;
            // The deal itself: off-stage corner to its place on the pile.
            tl.to(
              card,
              { ...restOf(k + 1), scale: 1, duration: stepLen, ease: "power2.out" },
              at
            );
            // The card it lands on settles a touch deeper, which is what gives
            // the pile depth rather than the new card simply appearing over a
            // twin of itself.
            tl.to(
              cards[k],
              { scale: 0.965, yPercent: `+=1.2`, duration: stepLen, ease: "power2.out" },
              at
            );
          });

          // Hold on the finished pile so the last card is not clipped by the
          // pin releasing the instant it lands.
          tl.to({}, { duration: lead });

          /*
           * Exit left. The translate goes on the scene wrapper, never on the
           * stage: GSAP's pin owns the stage's own transform, and animating x on
           * the same element would fight it. The stage keeps `overflow: hidden`,
           * so this reads as the scene leaving the frame and cannot put a
           * scrollbar on the page.
           */
          const scene = sceneRef.current;
          if (scene && sceneLen > 0) {
            tl.fromTo(
              scene,
              { xPercent: 0 },
              { xPercent: -108, ease: "power2.inOut", duration: sceneLen },
              2 * lead + steps * stepLen
            );
          }
        }
      );
    }, section);

    return () => ctx.revert();
  }, [reduced, count]);

  // Swap the copy beside the stack with a short fade, so the text does not snap
  // between projects mid-deal. Driven by the active card, never by a clock.
  useEffect(() => {
    if (reduced) return;
    const el = metaRef.current;
    if (!el) return;
    const tw = gsap.fromTo(
      el,
      { autoAlpha: 0, y: 10 },
      { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out", overwrite: true }
    );
    return () => {
      tw.kill();
    };
  }, [active, reduced]);

  const project = projects[active];

  // Reduced motion: the pile is meaningless without the deal, so the projects
  // become a plain readable list.
  if (reduced) {
    return (
      <section id="projects" className="project-section-flat">
        <SectionHeading title="Projects" />
        <div className="project-flat-list">
          {projects.map((p) => (
            <article key={p.title} className="project-flat">
              <span className="project-card-kicker">{p.tag}</span>
              <h3 className="project-meta-title">{p.title}</h3>
              <p className="project-meta-desc">{p.description}</p>
              <p className="project-meta-tech">{p.tags.join("  ·  ")}</p>
              {p.href !== "#" && (
                <a className="project-meta-link" href={p.href} target="_blank" rel="noreferrer">
                  <span>View project ↗</span>
                </a>
              )}
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section id="projects" ref={sectionRef} className="project-section">
      <div ref={stageRef} className="project-stage">
        {/* Everything that leaves during the scene change lives in here, so the
            pinned stage itself is never transformed. */}
        <div ref={sceneRef} className="project-scene">
        <SectionHeading title="Projects" />

        <div className="project-stage-inner">
          <div className="project-stack">
            {projects.map((p, i) => (
              <div
                key={p.title}
                ref={(el) => {
                  if (el) cardsRef.current[i] = el;
                }}
                className="project-card-slot"
              >
                <ProjectCard project={p} z={i + 1} />
              </div>
            ))}
          </div>

          <div className="project-meta">
            <span className="project-meta-count">
              {String(active + 1).padStart(2, "0")}
              <span className="project-meta-count-total"> / {String(count).padStart(2, "0")}</span>
            </span>

            <div ref={metaRef} className="project-meta-body">
              <span className="project-card-kicker">{project.tag}</span>
              <h3 className="project-meta-title">{project.title}</h3>
              <p className="project-meta-desc">{project.description}</p>
              <p className="project-meta-tech">{project.tags.join("  ·  ")}</p>
              {project.href !== "#" && (
                <a
                  className="project-meta-link"
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>View project ↗</span>
                </a>
              )}
            </div>
          </div>
        </div>
        </div>
      </div>
    </section>
  );
}
