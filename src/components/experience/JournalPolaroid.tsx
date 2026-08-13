"use client";

/**
 * The decorative frame with a company logo pinned inside it.
 *
 * The logo is its own element sitting over the frame's photo window — never
 * composited into the frame artwork — so it stays addressable when the page
 * turn lands and can be swapped, animated or lifted out on its own.
 *
 * The window rectangle below was measured off the frame's alpha rather than
 * guessed, so the logo lands on the paper and not on the border.
 */
const WINDOW = { left: 23.15, top: 19.77, width: 71.06, height: 62.23 };

export default function JournalPolaroid({
  logo,
  logoAlt,
  left,
  top,
  width,
  rotate = 0,
  z = 4,
  /** Share of the window the logo fills — the reference leaves the paper showing. */
  inset = 12,
  /**
   * Flips the frame so its bow sits on the right instead of the left. The card's
   * thick edge stays at the bottom because the flip is horizontal only, and the
   * logo is flipped back below so it still reads the right way round.
   */
  mirror = false,
}: {
  logo: string;
  logoAlt: string;
  left: number;
  top: number;
  width: number;
  rotate?: number;
  z?: number;
  inset?: number;
  mirror?: boolean;
}) {
  const tilt = rotate ? `rotate(${rotate}deg)` : "";
  const flip = mirror ? "scaleX(-1)" : "";
  return (
    <div
      className="journal-polaroid"
      style={{
        left: `${left}%`,
        top: `${top}%`,
        width: `${width}%`,
        transform: `${flip} ${tilt}`.trim() || undefined,
        zIndex: z,
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/journal/polaroid.png" alt="" aria-hidden draggable={false} />

      <div
        className="journal-polaroid-window"
        style={{
          left: `${WINDOW.left + WINDOW.width * (inset / 200)}%`,
          top: `${WINDOW.top + WINDOW.height * (inset / 200)}%`,
          width: `${WINDOW.width * (1 - inset / 100)}%`,
          height: `${WINDOW.height * (1 - inset / 100)}%`,
        }}
      >
        {/* Flipped back, so a mirrored frame doesn't mirror the company mark. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logo}
          alt={logoAlt}
          draggable={false}
          style={mirror ? { transform: "scaleX(-1)" } : undefined}
        />
      </div>
    </div>
  );
}
