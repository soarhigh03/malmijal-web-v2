"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { trackEvent } from "@/lib/analytics";

const SLUG_PATTERN = /^[a-z0-9](?:[a-z0-9-]{0,98}[a-z0-9])?$/;

function getDownloadContext() {
  if (typeof window === "undefined")
    return { articleSlug: "", entryMethod: "direct" as const };
  const params = new URLSearchParams(window.location.search);
  const rawFrom = params.get("from") ?? "";
  const entry = params.get("entry") ?? "";
  return {
    articleSlug: SLUG_PATTERN.test(rawFrom) ? rawFrom : "",
    entryMethod: (entry === "qr" ? "qr" : "direct") as "direct" | "qr",
  };
}

export function DownloadTracker() {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    const { articleSlug, entryMethod } = getDownloadContext();
    if (entryMethod !== "qr") return;
    fired.current = true;
    trackEvent("download_qr_landing", {
      ...(articleSlug ? { article_slug: articleSlug } : {}),
      entry_method: "qr",
    });
  }, []);

  return null;
}

export function IosDownloadButton({
  href,
  label,
  tone,
  iconSrc,
  iconAlt,
}: {
  href: string;
  label: string;
  tone: string;
  iconSrc: string;
  iconAlt: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      onClick={() => {
        const { articleSlug, entryMethod } = getDownloadContext();
        trackEvent("store_outbound_click", {
          ...(articleSlug ? { article_slug: articleSlug } : {}),
          store: "ios",
          entry_method: entryMethod,
          cta_placement: "download_page",
        });
      }}
      className={`group flex min-h-[52px] items-center justify-center gap-3 rounded-full border border-white/85 bg-gradient-to-r ${tone} px-5 py-3 text-base font-extrabold text-[#1f2742] shadow-[0_12px_24px_rgba(70,67,154,0.15)] transition-transform hover:-translate-y-0.5 focus:outline-none focus:ring-4 focus:ring-white/70 sm:text-[1.05rem]`}
    >
      <Image
        src={iconSrc}
        alt={iconAlt}
        width={24}
        height={24}
        className="h-6 w-6 object-contain transition-transform group-hover:scale-105"
      />
      <span>{label}</span>
    </a>
  );
}
