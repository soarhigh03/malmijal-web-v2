"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export function BlogArticle({ html, slug }: { html: string; slug: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    // Add article context to /download links
    container
      .querySelectorAll<HTMLAnchorElement>('a[href="/download"]')
      .forEach((a) => {
        a.href = `/download?from=${encodeURIComponent(slug)}`;
      });

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const origin = window.location.origin;
      if (!href.startsWith("/") && !href.startsWith(origin)) return;

      const toPath = href.startsWith(origin)
        ? href.slice(origin.length)
        : href;
      const pathname = toPath.split("?")[0].split("#")[0];

      if (pathname === "/download") {
        trackEvent("blog_cta_click", {
          article_slug: slug,
          cta_placement: "body_inline",
          destination_type: "download",
        });
      } else {
        trackEvent("blog_internal_click", {
          from_slug: slug,
          to_slug: toPath,
          position: "body",
        });
      }
    }

    container.addEventListener("click", handleClick, true);
    return () => container.removeEventListener("click", handleClick, true);
  }, [slug]);

  return (
    <div
      ref={ref}
      className="prose-blog"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
