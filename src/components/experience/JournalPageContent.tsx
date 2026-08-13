"use client";

import type { JournalPage } from "@/data/experiences";

/**
 * The handwritten-diary side of a page: real HTML text, never baked into art.
 *
 * Positioned as a percentage box of the journal so it holds its place on the
 * paper at any size, and kept clear of the frame and the stickers rather than
 * centred — a journal page is written around what is stuck to it.
 */
export default function JournalPageContent({
  entry,
  left,
  top,
  width,
  z = 3,
}: {
  entry: JournalPage;
  left: number;
  top: number;
  width: number;
  z?: number;
}) {
  return (
    <div
      className="journal-entry"
      style={{ left: `${left}%`, top: `${top}%`, width: `${width}%`, zIndex: z }}
    >
      <p className="journal-entry-period">
        {entry.period} <span aria-hidden>·</span> {entry.location}
      </p>

      <h3 className="journal-entry-company">{entry.company}</h3>
      <p className="journal-entry-role">{entry.role}</p>

      <div className="journal-rule" aria-hidden />

      <p className="journal-entry-lede">{entry.lede}</p>

      <ul className="journal-entry-notes">
        {entry.notes.map((n) => (
          <li key={n}>{n}</li>
        ))}
      </ul>

      <p className="journal-entry-tools">{entry.tools.join("  ·  ")}</p>
    </div>
  );
}
