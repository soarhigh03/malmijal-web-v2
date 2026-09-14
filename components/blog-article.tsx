"use client";

import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

export function BlogArticle({ html, slug }: { html: string; slug: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;

    function handleClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#")) return;

      const origin = window.location.origin;
      if (!href.startsWith("/") && !href.startsWith(origin)) return;

      const toSlug = href.startsWith(origin)
        ? href.slice(origin.length)
        : href;

      trackEvent("blog_internal_click", {
        from_slug: slug,
        to_slug: toSlug,
        position: "body",
      });
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
