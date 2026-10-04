import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export const dynamic = "force-static";

// All crawlers welcome, including AI training and answer bots (owner decision, 2026-10-04).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
  };
}
