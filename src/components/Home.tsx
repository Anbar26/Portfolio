"use client";

import { motion, useMotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollSmoother from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/all";
gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
import { Mail, Github, Linkedin, Check } from "lucide-react";
import AnbarAlthafLogo from "./AnbarAlthafLogo";
import SectionHeading from "./shared/SectionHeading";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import ExperienceJournal from "./experience/ExperienceJournal";
import ProjectStack from "./projects/ProjectStack";
import CertificationsConveyor from "./certifications/CertificationsConveyor";
import SkillsFlip from "./skills/SkillsFlip";

/**
 * Scroll distance, in viewport heights, that the hero holds while the name draws.
 *
 * This is the whole reason the draw can't be skipped: the hero is pinned for
 * exactly this long, so the signature always gets its own stretch of scroll no
 * matter how fast the reader flicks. Kept the same on every breakpoint — the
 * draw is one continuous gesture and shortening it on a phone is what would make
 * it skippable there.
 *
 * This is the only dial for the draw's pace. The timeline positions below are
 * fractions of the pin, not seconds, so raising this stretches every stage
 * evenly — the signature simply takes more wheel to get through. It does not
 * change how directly the ink tracks the wheel; that is `scrub`.
 */
const HERO_DRAW_VH = 2.5;

/**
 * Pins a section to the viewport and hands back the index of the item the
 * reader is currently parked on. Scrolling advances one item at a time, so the
 * page can't be skimmed past — every entry gets its own beat of scroll.
 *
 * Disabled below the `md` breakpoint, where a pinned viewport-height stage
 * can't reliably hold a full card; those screens get a plain stacked list.
 */

const EMAIL = "anbaralthaf26@gmail.com";

export default function Home() {
  // Mobile island nav
  const [navOpen, setNavOpen] = useState(false);
  const navTlRef = useRef<gsap.core.Timeline | null>(null);

  // Contact — copy email to clipboard
  const [emailCopied, setEmailCopied] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      return;
    }
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  // About reveal overlay
  const [aboutOpen, setAboutOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);
  const aboutTlRef = useRef<gsap.core.Timeline | null>(null);

  const reducedMotion = usePrefersReducedMotion();

  // Hero name — the four stages of the signature draw, held as MotionValues so
  // scroll can own them. Nothing here advances on its own.
  const anbarDraw = useMotionValue(0);
  const althafDraw = useMotionValue(0);
  const nameFill = useMotionValue(0);
  const nameStroke = useMotionValue(1);

  const heroWrapRef = useRef<HTMLElement>(null);
  const heroPinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  /*
   * HERO — two drivers that deliberately never touch.
   *
   *   Flower : a plain timeline. Starts on load, settles on its own, and never
   *            consults the scroll position.
   *   Name   : the opposite. Its four stages are held as MotionValues and the
   *            only thing that moves them is scroll progress, so the draw can
   *            neither run ahead of the reader nor be flicked past.
   *
   * The pin is what buys the draw its own scroll range. Without it the hero is a
   * single screen and the page simply carries on underneath a signature that is
   * still drawing itself — which is what was happening before.
   */
  useEffect(() => {
    const wrap = heroWrapRef.current;
    const pin = heroPinRef.current;
    if (!wrap || !pin) return;

    // Reduced motion: no entrance, no pin, no scrub. Just the finished hero —
    // flower settled where the intro would have left it, signature fully inked.
    if (reducedMotion) {
      gsap.set(".hero-flower", { scale: 1.15, opacity: 1, x: "38vw", rotate: 35 });
      gsap.set([".hero-content", ".hero-scroll-cue"], { opacity: 1, y: 0 });
      anbarDraw.set(1);
      althafDraw.set(1);
      nameFill.set(1);
      nameStroke.set(0);
      return;
    }

    let unlock = () => {};
    let introDone = false;

    /*
     * Deliberately unscoped. The flower is not a descendant of the hero — it
     * lives on the fixed backdrop layer in <SiteBackground /> so no section can
     * clip it — so scoping this context to the hero would silently resolve
     * ".hero-flower" to nothing and the entrance would never run. The trigger
     * and pin below use element refs, so nothing here needs a scope.
     */
    const ctx = gsap.context(() => {
      // ── 1. Flower — time-based, autonomous ──────────────────────
      gsap.set(".hero-flower", { scale: 0.08, opacity: 0, x: 0, rotate: 0 });
      gsap.set([".hero-content", ".hero-scroll-cue"], { opacity: 0, y: 24 });

      /*
       * Hold the page still for the flower's entrance and nothing more. This is
       * tied to the flower timeline only — the name is safe either way, because
       * scroll is the one thing that drives it and it simply waits.
       */
      const preventScroll = (e: Event) => e.preventDefault();
      unlock = () => {
        window.removeEventListener("wheel", preventScroll);
        window.removeEventListener("touchmove", preventScroll);
      };
      window.addEventListener("wheel", preventScroll, { passive: false });
      window.addEventListener("touchmove", preventScroll, { passive: false });

      gsap
        .timeline({ delay: 0.3, onComplete: () => { introDone = true; unlock(); } })
        .to(".hero-flower", { scale: 1, opacity: 1, duration: 1.2, ease: "power2.out" })
        .to(".hero-flower", { x: "38vw", rotate: 35, scale: 1.15, duration: 1.4, ease: "power2.inOut" })
        .to(
          [".hero-content", ".hero-scroll-cue"],
          { opacity: 1, y: 0, duration: 1.0, ease: "power2.out" },
          "-=0.6"
        );

      /*
       * A slow bob so the cue reads as an invitation rather than a label. On its
       * own element: the fade-in above owns the cue's `y`, and the scrubbed
       * fade-out below owns its opacity, so this must not touch either.
       */
      gsap.to(".hero-scroll-bob", {
        y: 7,
        duration: 1.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });

      // ── 2. Name — scroll-driven, with no clock of its own ────────
      /*
       * GSAP cannot tween a Framer MotionValue, so the scrubbed timeline drives a
       * plain object and hands the numbers across on every render. The four
       * stages, their order and their overlap are exactly the ones the timed
       * version had — Anbar draws, Althaf follows before it finishes, the fills
       * come up under both, then the guide strokes drop away. Only the driver
       * changed: positions here are fractions of scroll, not seconds.
       */
      const draw = { anbar: 0, althaf: 0, fill: 0, stroke: 1 };
      const push = () => {
        anbarDraw.set(draw.anbar);
        althafDraw.set(draw.althaf);
        nameFill.set(draw.fill);
        nameStroke.set(draw.stroke);
      };

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        onUpdate: push,
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => "+=" + window.innerHeight * HERO_DRAW_VH,
          // Small enough to still read as direct: the signature tracks the
          // wheel rather than trailing behind it.
          scrub: 0.5,
          pin,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          // Earliest pinned stage on the page, so it refreshes first —
          // Experience 3, Projects 2, Certifications 1, Skills 0 follow.
          refreshPriority: 4,
        },
      });

      /*
       * The cue retires as soon as the reader takes the hint, and returns if
       * they scroll back up. Driven straight from progress rather than from a
       * tween so there is no captured start value to get stale, and gated on the
       * intro so it cannot flash into view while the flower is still arriving.
       */
      const cue = wrap.querySelector<HTMLElement>(".hero-scroll-cue");
      if (cue) {
        ScrollTrigger.create({
          trigger: wrap,
          start: "top top",
          end: () => "+=" + window.innerHeight * 0.28,
          onUpdate: (self) => {
            if (introDone) gsap.set(cue, { autoAlpha: 1 - self.progress });
          },
          onLeaveBack: () => {
            if (introDone) gsap.set(cue, { autoAlpha: 1 });
          },
        });
      }

      tl.to(draw, { anbar: 1, duration: 0.42 }, 0)
        .to(draw, { althaf: 1, duration: 0.46 }, 0.24)
        .to(draw, { fill: 1, duration: 0.28 }, 0.52)
        .to(draw, { stroke: 0, duration: 0.16 }, 0.74)
        // A beat on the finished signature before the pin lets go, so the last
        // thing the reader sees here is the name at rest rather than a handoff.
        .to({}, { duration: 0.1 });

      // The timeline renders at progress 0 on creation, but only after this
      // function returns — push once so the first paint is a blank signature
      // rather than whatever the MotionValues happened to hold.
      push();
    });

    return () => {
      unlock();
      ctx.revert();
    };
  }, [reducedMotion, anbarDraw, althafDraw, nameFill, nameStroke]);

  // GSAP — full page scroll animation system
  useEffect(() => {
    const cleanups: Array<() => void> = [];
    const ctx = gsap.context(() => {

      // The hero owns its own effect — it is the only part of the page with two
      // independent drivers (a clock for the flower, scroll for the name).

      // ── Generic helpers ───────────────────────────────────────
      const ease = "power3.out";
      const toggleActions = "play none none reverse";

      gsap.utils.toArray<Element>(".gs-up").forEach((el) => {
        gsap.from(el, { y: 55, opacity: 0, duration: 0.9, ease,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions } });
      });

      gsap.utils.toArray<Element>(".gs-left").forEach((el) => {
        gsap.from(el, { x: -65, opacity: 0, duration: 0.9, ease,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions } });
      });

      gsap.utils.toArray<Element>(".gs-right").forEach((el) => {
        gsap.from(el, { x: 65, opacity: 0, duration: 0.9, ease,
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions } });
      });

      gsap.utils.toArray<Element>(".gs-stagger").forEach((container) => {
        const children = (container as Element).querySelectorAll(":scope > *");
        gsap.from(children, { y: 45, opacity: 0, duration: 0.75, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: container as Element, start: "top 85%", toggleActions: "play none none reverse" } });
      });

      // ── Section headings draw line ────────────────────────────
      gsap.utils.toArray<Element>(".gs-heading-line").forEach((el) => {
        gsap.from(el, { scaleX: 0, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", toggleActions: "play none none reverse" } });
      });

      ScrollTrigger.refresh();
    });
    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  // Mobile island nav — build timeline once
  useEffect(() => {
    const tl = gsap.timeline({ paused: true })
      .set(".menu-overlay", { pointerEvents: "auto" })
      .to(".island", { width: 240, duration: 0.6, ease: "back.out(2)" }, 0)
      .to(".bar-mid", { opacity: 0, duration: 0.15, ease: "power2.in" }, 0)
      .to(".bar-top", { attr: { x1: 3, y1: 3, x2: 13, y2: 13 }, duration: 0.28, ease: "power3.inOut" }, 0)
      .to(".bar-bot", { attr: { x1: 13, y1: 3, x2: 3, y2: 13 }, duration: 0.28, ease: "power3.inOut" }, 0)
      .to(".menu-backdrop", { opacity: 1, duration: 0.3, ease: "power2.out" }, 0)
      .from(".menu-panel", { autoAlpha: 0, yPercent: -10, scale: 0.6, duration: 0.7, transformOrigin: "top center", ease: "back.out(2)" }, 0.1)
      .from(".menu-link", { opacity: 0, y: 6, duration: 0.3, ease: "power2.out", stagger: 0.05 }, 0.22);
    navTlRef.current = tl;
    return () => { tl.kill(); };
  }, []);

  // Mobile island nav — play / reverse on toggle
  useEffect(() => {
    const tl = navTlRef.current;
    if (!tl) return;
    if (navOpen) {
      tl.timeScale(1).play();
    } else {
      tl.eventCallback("onReverseComplete", () => { gsap.set(".menu-overlay", { pointerEvents: "none" }); });
      tl.timeScale(1.4).reverse();
    }
  }, [navOpen]);

  // Esc to close
  useEffect(() => {
    if (!navOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setNavOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [navOpen]);

  // About overlay — body scroll lock when open
  useEffect(() => {
    document.body.style.overflow = aboutOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [aboutOpen]);

  // About overlay — build path morph + char fly-in timeline once
  useEffect(() => {
    const path = document.querySelector<SVGPathElement>(".about-path");
    if (!path) return;

    const proxy = { v: 100, c: 100 };
    const updatePath = () => {
      path.setAttribute("d", `M 0 100 V ${proxy.v} Q 50 ${proxy.c} 100 ${proxy.v} V 100 z`);
    };
    updatePath();

    gsap.set(".about-char", { opacity: 0, y: 40, scale: 0.6 });
    gsap.set(".about-body", { opacity: 0, y: 20 });

    const tl = gsap.timeline({ paused: true })
      .to(proxy, { v: 50, c: 0, duration: 0.55, ease: "power2.in", onUpdate: updatePath })
      .to(proxy, { v: 0, duration: 0.5, ease: "power2.out", onUpdate: updatePath })
      .to(".about-char", {
        opacity: 1,
        y: 0,
        scale: 1,
        ease: "back.out(1.6)",
        duration: 0.7,
        stagger: 0.025,
      }, "-=0.1")
      .to(".about-body", { opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1 }, "-=0.3");

    aboutTlRef.current = tl;
    return () => { tl.kill(); };
  }, []);

  // About overlay — play / reverse on toggle
  useEffect(() => {
    const tl = aboutTlRef.current;
    if (!tl) return;
    if (aboutOpen) {
      setOverlayVisible(true);
      requestAnimationFrame(() => tl.timeScale(1).play(0));
    } else {
      tl.eventCallback("onReverseComplete", () => setOverlayVisible(false));
      tl.timeScale(1.3).reverse();
    }
  }, [aboutOpen]);

  // Esc to close about
  useEffect(() => {
    if (!aboutOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setAboutOpen(false); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [aboutOpen]);

  // Name 3D tilt — pointer-driven rotation only
  useEffect(() => {
    const hero = document.querySelector<HTMLElement>("#hero");
    if (!hero) return;

    const outerRX = gsap.quickTo(".name-outer", "rotationX", { ease: "power3", duration: 0.6 });
    const outerRY = gsap.quickTo(".name-outer", "rotationY", { ease: "power3", duration: 0.6 });

    const onMove = (e: PointerEvent) => {
      outerRX(gsap.utils.interpolate(15, -15, e.clientY / window.innerHeight));
      outerRY(gsap.utils.interpolate(-15, 15, e.clientX / window.innerWidth));
    };
    const onLeave = () => {
      outerRX(0); outerRY(0);
    };

    hero.addEventListener("pointermove", onMove);
    hero.addEventListener("pointerleave", onLeave);
    return () => {
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
    };
  }, []);


  return (
    <div className="min-h-screen text-[#5c1a2e] overflow-x-hidden bg-transparent">

      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="fixed top-6 left-0 w-full z-50 flex items-center justify-center"
      >

        {/* LEFT LOGO */}
        <div className="absolute left-6 mt-6">
          <a href="#">
            <AnbarAlthafLogo variant="nav" className="h-11 w-auto" />
          </a>
        </div>

        {/* CENTER PILL NAV — desktop */}
        <div className="hidden md:flex items-center bg-white/80 backdrop-blur-xl rounded-full shadow-lg border border-rose-100 overflow-hidden px-2 py-1">

          {["About", "Experience", "Projects", "Certifications", "Skills", "Contact"].map((item) =>
            item === "About" ? (
              <button
                key={item}
                onClick={() => setAboutOpen(true)}
                className="px-5 py-2 text-sm text-rose-900/60 hover:text-rose-800 transition bg-transparent border-0 cursor-pointer"
              >
                {item}
              </button>
            ) : (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="px-5 py-2 text-sm text-rose-900/60 hover:text-rose-800 transition"
              >
                {item}
              </a>
            )
          )}

        </div>

        {/* MOBILE ISLAND NAV */}
        <button
          id="menuToggle"
          aria-expanded={navOpen}
          aria-label={navOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setNavOpen((v) => !v)}
          className="island md:hidden relative flex items-center justify-center bg-white/85 backdrop-blur-xl rounded-full shadow-lg border border-rose-100 h-11 px-3 will-change-transform"
          style={{ width: "3rem" }}
        >
          <svg viewBox="0 0 16 16" className="w-5 h-5 text-[#5c1a2e] flex-shrink-0">
            <line className="bar-top" x1="3" y1="5" x2="13" y2="5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <line className="bar-mid" x1="3" y1="8" x2="13" y2="8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <line className="bar-bot" x1="3" y1="11" x2="13" y2="11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span className="island-logo absolute right-4 text-[#5c1a2e] text-sm tracking-widest font-light opacity-0">
            ✦
          </span>
        </button>

      </motion.nav>

      {/* MOBILE MENU OVERLAY */}
      <div className="menu-overlay md:hidden fixed inset-0 z-40 pointer-events-none">
        <div
          className="menu-backdrop absolute inset-0 bg-[#5c1a2e]/30 backdrop-blur-sm opacity-0"
          onClick={() => setNavOpen(false)}
        />
        <div className="menu-panel absolute top-24 left-1/2 -translate-x-1/2 w-[88vw] max-w-sm rounded-3xl bg-white/95 backdrop-blur-xl border border-rose-100 shadow-2xl shadow-rose-200/40 p-3">
          {["About", "Experience", "Projects", "Certifications", "Skills", "Contact"].map((item) =>
            item === "About" ? (
              <button
                key={item}
                tabIndex={navOpen ? 0 : -1}
                onClick={() => { setNavOpen(false); setAboutOpen(true); }}
                className="menu-link block w-full text-left px-5 py-3 rounded-2xl text-[#5c1a2e]/80 hover:bg-rose-50 hover:text-[#5c1a2e] transition-colors text-base font-light bg-transparent border-0 cursor-pointer"
              >
                {item}
              </button>
            ) : (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                tabIndex={navOpen ? 0 : -1}
                onClick={() => setNavOpen(false)}
                className="menu-link block px-5 py-3 rounded-2xl text-[#5c1a2e]/80 hover:bg-rose-50 hover:text-[#5c1a2e] transition-colors text-base font-light"
              >
                {item}
              </a>
            )
          )}
        </div>
      </div>

      {/* ABOUT REVEAL OVERLAY — path morph + char fly-in */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          overflow: "auto",
          visibility: overlayVisible ? "visible" : "hidden",
          pointerEvents: aboutOpen ? "auto" : "none",
        }}
      >
        {/* SVG path — provides the maroon bottom-up bubble reveal */}
        <svg
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
          }}
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            className="about-path"
            d="M 0 100 V 100 Q 50 100 100 100 V 100 z"
            fill="#5c1a2e"
          />
        </svg>

        <button
          type="button"
          onClick={() => setAboutOpen(false)}
          aria-label="Close"
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            width: 44,
            height: 44,
            borderRadius: 9999,
            background: "rgba(255,255,255,0.15)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#fff",
            fontSize: 16,
            cursor: "pointer",
            zIndex: 10001,
          }}
        >
          {"✕"}
        </button>

        <div style={{ position: "relative", zIndex: 1, maxWidth: "48rem", margin: "0 auto", padding: "6rem 2rem", minHeight: "100vh", boxSizing: "border-box" }}>
          <p className="about-body" style={{ color: "#fbcfe8", fontSize: 12, letterSpacing: "0.45em", textTransform: "uppercase", marginBottom: 24, fontWeight: 300 }}>
            {"✦ Hello there"}
          </p>
          <h2
            aria-label="I'm Anbar — a builder at heart."
            style={{ color: "#ffffff", fontSize: "clamp(2rem, 6vw, 4.5rem)", fontWeight: 600, lineHeight: 1.05, marginBottom: 32, letterSpacing: "-0.02em" }}
          >
            {Array.from("I'm Anbar.").map((c, i) => (
              <span
                key={i}
                className="about-char"
                style={{ display: "inline-block", whiteSpace: c === " " ? "pre" : undefined }}
              >
                {c === " " ? " " : c}
              </span>
            ))}
          </h2>
          <div className="about-body" style={{ color: "rgba(255,255,255,0.9)", fontSize: "1.05rem", lineHeight: 1.7, fontWeight: 300 }}>
            <p style={{ marginBottom: 18 }}>
              {"I'm a Computer Science student focused on AI & Machine Learning. I spend most of my time on feature pipelines, data infrastructure, and how systems hold up once they're running. That's where I've found the interesting problems tend to live. "}
            </p>
          </div>
          <div className="about-body" style={{ display: "flex", flexWrap: "wrap", gap: 10, paddingTop: 28 }}>
            {["Machine Learning", "Deep Learning", "AI Systems", "Data", "Research"].map((tag) => (
              <span
                key={tag}
                style={{
                  padding: "6px 16px",
                  borderRadius: 9999,
                  border: "1px solid rgba(255,255,255,0.3)",
                  background: "rgba(255,255,255,0.08)",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 300,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Hero */}
      {/* The section is now just the trigger — it grows to hold the pin's scroll
          range. The screen-sized stage below it is what actually gets pinned, so
          the hero's own layout is unchanged. */}
      <section id="hero" ref={heroWrapRef} className="relative">
        <div
          ref={heroPinRef}
          className="relative min-h-screen flex items-center justify-center px-4 text-center"
        >

          {/* The flower lives in <SiteBackground /> — a fixed layer outside the
              scroll container, so no section boundary can ever clip it, and the
              pin here cannot reach it either. */}

          {/* Hero content — hidden until flower finishes */}
          <div className="hero-content relative z-10 max-w-4xl mx-auto">
            <p className="text-rose-500/70 text-xs tracking-[0.45em] uppercase mb-8 font-light">
              Software Developer
            </p>
            <button
              type="button"
              onClick={() => setAboutOpen(true)}
              aria-label="Open about"
              className="name-stage inline-block mt-36 mb-6 cursor-pointer bg-transparent border-0 p-0"
              style={{ perspective: "650px" }}
            >
              <div className="name-outer inline-block will-change-transform">
                <AnbarAlthafLogo
                  variant="hero"
                  className="name-inner h-40 md:h-56 lg:h-64 w-auto mx-auto will-change-transform"
                  anbarPathLength={anbarDraw}
                  althafPathLength={althafDraw}
                  fillOpacity={nameFill}
                  strokeOpacity={nameStroke}
                />
              </div>
            </button>
            <div className="w-28 h-px bg-gradient-to-r from-transparent via-rose-400 to-transparent mx-auto mb-8" />
          </div>

          {/*
            Scroll cue. Worth having here specifically: the signature only draws
            when you scroll, so without a prompt the hero can look finished.
            A sibling of .hero-content rather than a child, so it can sit at the
            foot of the stage instead of under the centred block.
          */}
          <div className="hero-scroll-cue" aria-hidden>
            <div className="hero-scroll-bob">
              <span className="hero-scroll-word">Scroll</span>
              <span className="hero-scroll-line" />
            </div>
          </div>
        </div>
      </section>


      {/* Experience — the journal spread */}
      <ExperienceJournal />

      {/* Projects — pinned, one project per beat of scroll */}
      <ProjectStack />

      {/* Certifications — Transition 1: pinned diagonal conveyor of plates */}
      <CertificationsConveyor />

      {/* Skills — Transition 2: stacked fan flips out into three cards */}
      <SkillsFlip />

      {/* Contact */}
      <section id="contact" className="py-28 px-4 relative overflow-hidden">
        <div className="max-w-2xl mx-auto text-center">
          <SectionHeading title="Get In Touch" />
          <p className="gs-up text-rose-900/50 mb-10 font-light leading-relaxed">
            I&apos;m open to new opportunities and collaborations. Whether you&apos;d like to
            discuss AI projects or explore working together, I&apos;d love to hear from you.
          </p>

          <div className="gs-stagger flex flex-col items-center gap-5 mt-12">
            <div className="flex justify-center gap-4">
              {/* Email — click to copy */}
              <motion.button
                type="button"
                onClick={copyEmail}
                aria-label={emailCopied ? "Email copied" : "Copy email address"}
                className="w-12 h-12 rounded-full border border-rose-200 bg-white flex items-center justify-center text-rose-400 hover:text-rose-600 hover:border-rose-400 hover:shadow-sm hover:shadow-rose-100 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.1, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                {emailCopied ? <Check className="w-5 h-5 text-emerald-500" /> : <Mail className="w-5 h-5" />}
              </motion.button>

              {[
                { icon: Linkedin, href: "https://www.linkedin.com/in/anbaralthaf/", label: "LinkedIn" },
                { icon: Github, href: "https://github.com/Anbar26", label: "GitHub" },
              ].map((contact) => (
                <motion.a
                  key={contact.label}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={contact.label}
                  className="w-12 h-12 rounded-full border border-rose-200 bg-white flex items-center justify-center text-rose-400 hover:text-rose-600 hover:border-rose-400 hover:shadow-sm hover:shadow-rose-100 transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <contact.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </div>

            {/* Email address + copy confirmation */}
            <button
              type="button"
              onClick={copyEmail}
              className="text-sm font-light tracking-wide text-rose-900/55 hover:text-rose-700 transition-colors cursor-pointer"
            >
              {emailCopied ? "✓ Copied to clipboard!" : EMAIL}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-rose-100">
        <div className="max-w-5xl mx-auto text-center text-rose-900/25 text-sm font-light">
          <p>© 2025 Anbar Althaf · Built with Next.js</p>
        </div>
      </footer>
    </div>
  );
}
