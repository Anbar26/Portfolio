"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Fixed, full-viewport backdrop that lives OUTSIDE the ScrollSmoother transform.
 * Everything decorative lives here — including the hero flower, so no section
 * boundary can ever clip it.
 */
export default function SiteBackground() {
  // Flower mouse parallax
  useEffect(() => {
    const xTo = gsap.quickTo(".flower-parallax", "x", { duration: 1.8, ease: "power3" });
    const yTo = gsap.quickTo(".flower-parallax", "y", { duration: 1.8, ease: "power3" });
    const onMove = (e: MouseEvent) => {
      xTo((e.clientX / window.innerWidth - 0.5) * -80);
      yTo((e.clientY / window.innerHeight - 0.5) * -80);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Scroll reactions — flower fades with the hero, aurora drifts + shifts palette
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Targets the wrapper, not `.hero-flower` itself — the hero intro timeline
      // owns the flower's own transform/opacity, and a scrub tween gets rendered
      // at progress 0 on every ScrollTrigger.refresh(), which would stomp it.
      /*
       * Starts at "bottom bottom" — the moment the hero's pin lets go — rather
       * than at the top of the page. The hero is now roughly two and a half
       * screens tall because it holds a pinned scroll range for the signature
       * draw; fading from the very top would have the flower most of the way
       * gone before the name had finished drawing over it. This keeps it whole
       * for the draw and fades it on the way out to Experience.
       */
      gsap.to(".flower-layer", {
        opacity: 0,
        yPercent: -10,
        filter: "blur(8px)",
        ease: "none",
        scrollTrigger: { trigger: "#hero", start: "bottom bottom", end: "bottom 35%", scrub: 0.6 },
      });

      // Translate only — rotating or scaling a container of blurred children
      // re-rasterizes them every frame.
      gsap.to(".aurora-field", {
        yPercent: -14,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        },
      });

      gsap.to(".aurora-alt", {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.5,
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="site-bg" aria-hidden="true">
      <div className="aurora-field">
        {/* warm rose palette — dominant at the top of the page */}
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="aurora aurora-3" />

        {/* cooler palette — fades in as you scroll down */}
        <div className="aurora-alt">
          <div className="aurora aurora-4" />
          <div className="aurora aurora-5" />
          <div className="aurora aurora-6" />
        </div>
      </div>

      <div className="site-bg-grid" />

      {/* Hero flower — fixed layer, never clipped by a section boundary */}
      <div className="flower-layer">
        <div className="flower-parallax">
          <div className="hero-flower" />
        </div>
      </div>

      <div className="site-bg-grain" />
      <div className="site-bg-vignette" />
    </div>
  );
}
