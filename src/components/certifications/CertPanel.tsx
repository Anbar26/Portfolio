import type { CertItem } from "@/data/certifications";
import { monogram } from "@/data/certifications";

/**
 * One certificate: the lace card, carrying everything about the award.
 *
 * The card is the whole unit now — mark, title, issuer and date sit together
 * inside the lace, so a certificate is readable on its own instead of needing a
 * separate list alongside it. That list is gone; this is where its content went.
 *
 * Everything is laid out against the card's own interior panel, measured off the
 * artwork (9.54% / 11.5%, 83.4% x 74%), and type is sized in `cqw` so it tracks
 * the card rather than the window — a card scaled down by `--cert-scale` keeps
 * its proportions rather than ending up with oversized text.
 */
export default function CertPanel({ cert }: { cert: CertItem; index?: number }) {
  return (
    <div className="cert-panel">
      <div className="cert-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="cert-card-bg" src="/cert-card.jpg" alt="" aria-hidden draggable={false} />

        <div className="cert-card-inner">
          <div className="cert-card-mark">
            {cert.logo ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={cert.logo} alt={`${cert.issuer} logo`} draggable={false} />
            ) : (
              <span className="cert-card-monogram">{monogram(cert.issuer)}</span>
            )}
          </div>

          <h3 className="cert-card-title">{cert.name}</h3>

          <p className="cert-card-meta">
            <span className="cert-card-issuer">{cert.issuer}</span>
            <span className="cert-card-dot" aria-hidden>
              ·
            </span>
            {cert.date}
          </p>
        </div>
      </div>
    </div>
  );
}
