"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const DOWNLOAD_PREVIEW_PATH = "/download/preview";

function isDownloadPreview(pathname: string) {
  return (
    pathname === DOWNLOAD_PREVIEW_PATH ||
    pathname.startsWith(`${DOWNLOAD_PREVIEW_PATH}/`)
  );
}

export function GaScript() {
  const pathname = usePathname();
  if (!GA_ID || isDownloadPreview(pathname ?? "")) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`if(window.location.pathname!=='${DOWNLOAD_PREVIEW_PATH}'&&!window.location.pathname.startsWith('${DOWNLOAD_PREVIEW_PATH}/')){window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());window.gtag('config','${GA_ID}');}`}
      </Script>
    </>
  );
}

export function trackEvent(
  name: string,
  params?: Record<string, string>,
) {
  if (
    typeof window !== "undefined" &&
    isDownloadPreview(window.location.pathname)
  ) {
    return;
  }
  if (process.env.NODE_ENV === "development") {
    console.log("[GA4]", name, params);
  }
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }
}
