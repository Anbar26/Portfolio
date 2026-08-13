"use client";

import type { Glyph } from "@/data/skills";
import SkillTile from "./SkillTile";

type Group = { title: string; items: { icon: Glyph; label: string }[] };

/**
 * One card of the Flip transition.
 *
 *   .skill-flip-item   the Flip target — owns *layout* only (stacked ⇄ column)
 *   .skill-flip-inner  owns the fan tilt and the Y-axis flip
 *   .skill-face        the two sides
 *
 * Keeping layout and transform on separate elements is what lets Flip measure a
 * clean, un-rotated rectangle while the card is still tilted in the fan.
 */
export default function SkillFlipCard({
  group,
  index,
  flip,
}: {
  group: Group;
  index: number;
  /** false on phones and under reduced motion — renders a plain, flat card. */
  flip: boolean;
}) {
  const list = (
    <>
      <div className="shrink-0">
        <span className="text-[10px] tracking-[0.3em] uppercase text-rose-400/80 font-medium">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="font-[family-name:var(--font-dirtyline)] text-xl md:text-2xl text-[#5c1a2e] leading-tight mt-1.5">
          {group.title}
        </h3>
        <div className="mt-4 h-px bg-gradient-to-r from-rose-300/70 to-transparent" />
      </div>
      <div className="skill-tiles grid grid-cols-2 gap-2.5 mt-5">
        {/* One highlight per card. It travels between chips rather than each
            chip lighting where it stands, so the movement is the effect. First
            in the DOM so it paints behind the chips. */}
        <span className="skill-tiles-marker" aria-hidden />
        {group.items.map((item) => (
          <SkillTile key={item.label} icon={item.icon} label={item.label} />
        ))}
      </div>
    </>
  );

  if (!flip) {
    return (
      <div className="rounded-[26px] border border-rose-200/80 bg-white/80 shadow-lg shadow-rose-100/50 p-6 flex flex-col">
        {list}
      </div>
    );
  }

  return (
    <div className="skill-flip-item">
      <div className="skill-flip-inner">
        {/* Plate — what you see before the card turns over */}
        <div className="skill-face skill-face-plate">
          <span className="skill-plate-index">{String(index + 1).padStart(2, "0")}</span>
          <div className="skill-plate-glow" />
          <div className="relative mt-auto">
            <div className="w-10 h-px bg-rose-200/40 mb-4" />
            <h3 className="font-[family-name:var(--font-dirtyline)] text-lg lg:text-xl text-rose-50 leading-snug">
              {group.title}
            </h3>
          </div>
        </div>

        {/* List — the real content, revealed once the card passes 90° */}
        <div className="skill-face skill-face-list">{list}</div>
      </div>
    </div>
  );
}
