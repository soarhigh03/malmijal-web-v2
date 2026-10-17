import type { NextRequest } from "next/server";
import { APP_STORE_URL, PLAY_STORE_URL } from "@/lib/store-links";

// A QR code can only encode one URL. This route picks the right store for the
// scanning device, so a single printed QR code works on both iOS and Android.
// Desktop browsers, iPadOS (which reports itself as Macintosh) and requests
// without a UA fall back to /download.

const SRC_PATTERN = /^[a-z0-9_-]{1,40}$/;

function withQuery(base: string, query: string): string {
  return `${base}${base.includes("?") ? "&" : "?"}${query}`;
}

function redirect(location: string): Response {
  // 302 only: the target depends on the device, so it must never be cached as permanent.
  return new Response(null, {
    status: 302,
    headers: {
      Location: location,
      "Cache-Control": "no-store",
      Vary: "User-Agent",
      "X-Robots-Tag": "noindex",
    },
  });
}

export function GET(request: NextRequest): Response {
  const userAgent = request.headers.get("user-agent") ?? "";
  const rawSrc = request.nextUrl.searchParams.get("src");
  const src = rawSrc && SRC_PATTERN.test(rawSrc) ? rawSrc : null;

  if (/iPhone|iPad|iPod/i.test(userAgent)) {
    const providerToken = process.env.APPSTORE_PROVIDER_TOKEN;
    if (src && providerToken) {
      return redirect(
        withQuery(
          APP_STORE_URL,
          `pt=${encodeURIComponent(providerToken)}&ct=${src}&mt=8`,
        ),
      );
    }
    return redirect(APP_STORE_URL);
  }

  if (/Android/i.test(userAgent)) {
    if (src) {
      const referrer = encodeURIComponent(`utm_source=${src}&utm_medium=qr`);
      return redirect(withQuery(PLAY_STORE_URL, `referrer=${referrer}`));
    }
    return redirect(PLAY_STORE_URL);
  }

  const download = new URL("/download", request.nextUrl);
  download.search = request.nextUrl.search;
  return redirect(download.toString());
}
