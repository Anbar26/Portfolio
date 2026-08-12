/**
 * The circular field that blooms behind the cards while they separate.
 *
 * The reference draws it as a ring of tiny glyphs; at any real viewing size that
 * reads as a dotted annulus, so this is a single element: one tiled
 * radial-gradient dot, masked to a ring. No DOM per dot, nothing to lay out, and
 * GSAP only ever touches transform and opacity on it.
 */
export default function DotRing() {
  return <div className="skills-dot-ring" aria-hidden="true" />;
}
