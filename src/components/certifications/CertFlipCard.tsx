"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { ExternalLink } from "lucide-react";

import { monogram, type CertItem } from "@/data/certifications";
import { useIsClient, usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import CertPanel from "./CertPanel";

/**
 * Picking a certificate up off the belt and turning it over.
 *
 * The card flies from the exact rectangle the clicked card occupied to the
 * middle of the screen and rotates on its Y axis on the way, so the detail side
 * is the back of the same object rather than a panel that replaced it. Closing
 * runs the same timeline backwards and puts it down where it came from.
 *
 * WHY A HAND-OFF RATHER THAN THE LITERAL ELEMENT
 * The cards on the belt are absolutely positioned inside a pinned stage that
 * clips its overflow, and GSAP rewrites their transform on every scroll tick.
 * Animating one in place would fight the belt for the same matrix and be clipped
 * by the stage on the way out. So this starts life at that card's measured rect,
 * on top of everything, while the original is hidden for exactly as long as the
 * flight lasts — the seam is invisible because the first frame is pixel-for-pixel
 * where the card already was.
 *
 * The box is animated rather than scaled: `width`/`height` reflow the detail
 * text at every frame instead of stretching it, which matters because the back
 * is denser than the front. It is one card for under a second, not a scrubbed
 * loop, so the layout cost is affordable.
 */

export type OriginRect = { left: number; top: number; width: number; height: number };

const OPEN_S = 0.85;

export default function CertFlipCard({
  cert,
  origin,
  closeSignal,
  onRequestClose,
  onClosed,
}: {
  cert: CertItem;
  origin: OriginRect;
  /** Bumped by the parent to ask for the reverse flip. */
  closeSignal: number;
  /** Backdrop, Escape and the close button all route through here. */
  onRequestClose: () => void;
  /** Fired once the card is back where it started. */
  onClosed: () => void;
}) {
  const mounted = useIsClient();
  const reduced = usePrefersReducedMotion();

  const backdropRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const closingRef = useRef(false);
  const [flipped, setFlipped] = useState(false);

  // Where the card settles: the same proportions as the card itself, so the
  // flight is a straight grow-and-turn with no change of shape.
  const target = () => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const w = Math.min(vw * 0.92, 56 * 16, (vh * 0.88 * 524) / 368);
    const h = (w * 368) / 524;
    return { left: (vw - w) / 2, top: (vh - h) / 2, width: w, height: h };
  };

  // The page must not scroll under the card: the belt would move the original
  // out from under the rect this thing has to fly back to.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onRequestClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onRequestClose]);

  // ── Open ──
  useEffect(() => {
    const box = boxRef.current;
    const inner = innerRef.current;
    const backdrop = backdropRef.current;
    if (!box || !inner || !backdrop) return;

    const t = target();

    if (reduced) {
      gsap.set(box, t);
      gsap.set(inner, { rotationY: 180 });
      gsap.set(backdrop, { autoAlpha: 1 });
      // No setState here: with motion reduced the back is up from the first
      // frame, so it is derived below rather than pushed from an effect.
      return;
    }

    gsap.set(box, origin);
    gsap.set(inner, { rotationY: 0 });
    gsap.set(backdrop, { autoAlpha: 0 });

    const tl = gsap.timeline();
    tl.to(backdrop, { autoAlpha: 1, duration: OPEN_S * 0.6, ease: "power2.out" }, 0)
      // Lift, then travel — the small rise first is what makes it read as being
      // picked up rather than sliding across a table.
      .to(box, { y: -18, duration: OPEN_S * 0.22, ease: "power2.out" }, 0)
      .to(box, { ...t, duration: OPEN_S, ease: "power3.inOut" }, 0)
      .to(box, { y: 0, duration: OPEN_S * 0.78, ease: "power3.inOut" }, OPEN_S * 0.22)
      .to(inner, { rotationY: 180, duration: OPEN_S, ease: "power3.inOut" }, 0)
      // Swap which face is "up" at the halfway point, so the back's text is
      // never briefly readable through the front.
      .add(() => setFlipped(true), OPEN_S * 0.5);

    tlRef.current = tl;
    return () => {
      tl.kill();
    };
    // Runs once per opened card; `origin` is captured at click time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Close (parent bumps closeSignal) ──
  useEffect(() => {
    if (closeSignal === 0 || closingRef.current) return;
    closingRef.current = true;

    const box = boxRef.current;
    const inner = innerRef.current;
    const backdrop = backdropRef.current;
    if (!box || !inner || !backdrop) {
      onClosed();
      return;
    }

    if (reduced) {
      onClosed();
      return;
    }

    tlRef.current?.kill();
    const tl = gsap.timeline({ onComplete: onClosed });
    tl.to(inner, { rotationY: 0, duration: OPEN_S, ease: "power3.inOut" }, 0)
      .to(box, { ...origin, duration: OPEN_S, ease: "power3.inOut" }, 0)
      .to(backdrop, { autoAlpha: 0, duration: OPEN_S * 0.7, ease: "power2.in" }, OPEN_S * 0.3)
      .add(() => setFlipped(false), OPEN_S * 0.5);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [closeSignal]);

  // With motion reduced the card is already turned over on first paint.
  const showBack = flipped || reduced;

  if (!mounted) return null;

  const detail = (
    <div className="cert-flip-detail">
      <p className="cert-flip-issuer">{cert.issuer}</p>
      <h3 className="cert-flip-name">{cert.name}</h3>

      <p className="cert-flip-line">
        {cert.date}
        <span className="cert-flip-sep" aria-hidden>
          ·
        </span>
        <span className={`cert-flip-dot ${cert.dot}`} aria-hidden />
        {cert.status}
      </p>

      <div className="cert-flip-rule" aria-hidden />

      {cert.description && <p className="cert-flip-desc">{cert.description}</p>}

      {cert.skills.length > 0 && (
        <div className="cert-flip-skills">
          {cert.skills.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
      )}

      {cert.courses.length > 0 && (
        <ul className="cert-flip-courses">
          {cert.courses.map((c) =>
            c.href ? (
              <li key={c.name}>
                <a href={c.href} target="_blank" rel="noopener noreferrer">
                  <ExternalLink aria-hidden />
                  {c.name}
                </a>
              </li>
            ) : (
              <li key={c.name}>
                <ExternalLink aria-hidden />
                {c.name}
              </li>
            )
          )}
        </ul>
      )}

      {cert.credential && (
        <a
          className="cert-flip-credential"
          href={cert.credential}
          target="_blank"
          rel="noopener noreferrer"
        >
          View credential <span aria-hidden>↗</span>
        </a>
      )}
    </div>
  );

  return createPortal(
    <div className="cert-flip-root" role="dialog" aria-modal="true" aria-label={cert.name}>
      <div ref={backdropRef} className="cert-flip-backdrop" onClick={onRequestClose} />

      <div ref={boxRef} className="cert-flip-box">
        <button
          type="button"
          className="cert-flip-close"
          onClick={onRequestClose}
          aria-label="Close certificate"
        >
          ✕
        </button>

        <div ref={innerRef} className="cert-flip-inner">
          {/* Front — the card exactly as it sits on the belt. */}
          <div className="cert-flip-face cert-flip-front" aria-hidden={showBack}>
            <CertPanel cert={cert} />
          </div>

          {/*
            Back — a flat wash, not the front artwork again.
            Reusing the lace JPG here meant a 524px image blown up past 890px,
            which read as soft and busy behind the type. A single colour drawn
            from this certificate's own accent family is both sharper at any size
            and quieter under a block of text.
          */}
          <div
            className="cert-flip-face cert-flip-back"
            aria-hidden={!showBack}
            style={{ background: cert.tint }}
          >
            <div className="cert-flip-back-inner">
              {cert.logo ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img className="cert-flip-logo" src={cert.logo} alt={`${cert.issuer} logo`} />
              ) : (
                <span className="cert-card-monogram">{monogram(cert.issuer)}</span>
              )}
              {detail}
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
