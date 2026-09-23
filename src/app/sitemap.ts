import type { MetadataRoute } from "next";
import { projects, research } from "@/content";
import { SITE_URL } from "@/lib/site";

// Every public page. /styleguide is a dev reference and stays out (D39).
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/plain`, changeFrequency: "monthly", priority: 0.8 },
    ...projects.map((p) => ({
      url: `${SITE_URL}/bounties/${p.slug}`,
      changeFrequency: "yearly" as const,
      priority: 0.7,
    })),
    {
      url: `${SITE_URL}/research/${research.slug}`,
      changeFrequency: "yearly",
      priority: 0.7,
    },
  ];
}
