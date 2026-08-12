"use client";

import { motion } from "framer-motion";
import type { Glyph } from "@/data/skills";

/**
 * Brand-glyph chip.
 *
 * Unchanged in design. The highlight is no longer per-chip: one marker per card
 * slides between them (see SkillsFlip), so the chip only has to stay transparent
 * enough for it to read through, and hand its label over when covered.
 */
export default function SkillTile({ icon, label }: { icon: Glyph; label: string }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      style={{ "--brand": `#${icon.hex}` } as React.CSSProperties}
      className="skill-tile group relative overflow-hidden flex flex-col items-center justify-center gap-2 w-full px-2 py-3.5 rounded-2xl border border-rose-200/80 bg-white/70 shadow-sm hover:bg-white hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/60 transition-all duration-300 cursor-default"
    >
      <svg
        role="img"
        viewBox="0 0 24 24"
        aria-label={icon.title}
        className="skill-tile-icon w-6 h-6 shrink-0 fill-current [color:var(--brand)]"
      >
        <path d={icon.path} />
      </svg>
      <span className="skill-tile-label text-[11px] font-light text-center leading-tight group-hover:text-[#5c1a2e] transition-colors duration-300">
        {label}
      </span>
    </motion.div>
  );
}
