import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

/**
 * One page, so this is a one-line sitemap — but it is still worth having: it is
 * how Search Console is told the site exists rather than waiting to be found,
 * and it gives the crawler a lastModified to compare against.
 *
 * The sections are anchors on the same document, not separate URLs, so they do
 * not belong here; Google finds them from the page's own headings.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
