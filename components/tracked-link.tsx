"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackEvent } from "@/lib/analytics";

export function TrackedLink({
  fromSlug,
  position,
  ...props
}: ComponentProps<typeof Link> & { fromSlug: string; position: string }) {
  return (
    <Link
      {...props}
      onClick={() =>
        trackEvent("blog_internal_click", {
          from_slug: fromSlug,
          to_slug: String(props.href),
          position,
        })
      }
    />
  );
}
