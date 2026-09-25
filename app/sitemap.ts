import type { MetadataRoute } from "next";
import { getAllPostMeta } from "@/lib/blog";
import { getLegalMeta, type LegalSlug } from "@/lib/legal";
import { absoluteUrl, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/download"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];

  const blogRoutes: MetadataRoute.Sitemap = getAllPostMeta().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: post.lastModified
      ? new Date(post.lastModified)
      : post.date
        ? new Date(post.date)
        : now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const legalSlugs: LegalSlug[] = ["privacy", "terms"];
  const legalRoutes: MetadataRoute.Sitemap = legalSlugs.map((slug) => {
    const meta = getLegalMeta(slug);
    return {
      url: absoluteUrl(`/${slug}`),
      lastModified: new Date(meta.updatedAt ?? meta.effectiveDate),
      changeFrequency: "yearly",
      priority: 0.3,
    };
  });
  return [...staticRoutes, ...blogRoutes, ...legalRoutes];
}
