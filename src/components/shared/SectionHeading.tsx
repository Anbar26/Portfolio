/**
 * Section title.
 *
 * The visible treatment — the Dirtyline wordmark and its rule-dot-rule ornament —
 * was removed by request; each section is now introduced by its content alone.
 *
 * The heading stays in the document as screen-reader-only text rather than being
 * deleted outright. The burger menu navigates to these sections by id, and with
 * no headings at all the page collapses to an unlabelled run of <section>
 * elements: nothing for assistive tech to jump between and no h2 outline for a
 * crawler. `sr-only` is absolutely positioned, so this costs no layout space and
 * nothing shifts.
 */
export default function SectionHeading({ title }: { title: string }) {
  return <h2 className="sr-only">{title}</h2>;
}
