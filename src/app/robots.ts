import type { MetadataRoute } from "next";
import { SITE_URL } from "./layout";

/**
 * Next generates /robots.txt from this.
 *
 * The whole site is meant to be found, so everything is allowed except the
 * chat endpoint — that is a POST-only API with nothing to index, and a crawler
 * hitting it would only spend the assistant's daily quota.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/api/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
