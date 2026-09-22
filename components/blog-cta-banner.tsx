"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";
import { trackEvent } from "@/lib/analytics";
import { siteUrl } from "@/lib/site";

const IOS_URL =
  "https://apps.apple.com/kr/app/%EB%A7%90%EB%AF%B8%EC%9E%98/id6769989593";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.malmijal.malmijal&hl=ko";

export function BlogCtaBanner({ slug }: { slug: string }) {
  const qrUrl = `${siteUrl}/download?from=${encodeURIComponent(slug)}&entry=qr`;

  function handleCtaClick() {
    trackEvent("blog_cta_click", {
      article_slug: slug,
      cta_placement: "post_footer",
      destination_type: "download",
    });
  }

  function handleStoreClick(store: "ios" | "android") {
    trackEvent("store_outbound_click", {
      article_slug: slug,
      store,
      entry_method: "direct",
      cta_placement: "post_footer",
    });
  }

  return (
    <div className="mt-10 pt-8 border-t border-black/10">
      <p className="text-black/70 text-base leading-relaxed">
        60초만 말해보고, 내 말하기를 분석받아보세요.{" "}
        <a
          href={`/download?from=${encodeURIComponent(slug)}`}
          onClick={handleCtaClick}
          className="text-black font-medium underline underline-offset-4 hover:text-black/70 transition-colors"
        >
          말미잘 첫 분석 무료
        </a>
      </p>

      {/* Desktop: QR code */}
      <div className="hidden sm:flex items-center gap-4 mt-4">
        <div className="rounded-xl bg-white p-2 shadow-sm border border-black/5">
          <QRCodeSVG
            value={qrUrl}
            size={80}
            level="M"
            includeMargin={false}
          />
        </div>
        <div className="text-sm text-black/50 leading-relaxed">
          <p>QR 코드를 스캔하면 모바일에서 바로 다운로드할 수 있어요.</p>
          <p className="mt-1 text-xs text-black/35 break-all">
            {siteUrl}/download
          </p>
        </div>
      </div>

      {/* Mobile: store badges */}
      <div className="flex sm:hidden items-center gap-3 mt-4">
        <a
          href={IOS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleStoreClick("ios")}
          aria-label="App Store에서 다운로드"
        >
          <Image
            src="/badges/malmijal_appstore_badge_black.svg"
            alt="Download on the App Store"
            width={120}
            height={36}
            className="h-9 w-auto"
          />
        </a>
        <a
          href={ANDROID_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => handleStoreClick("android")}
          aria-label="Google Play에서 다운로드"
        >
          <Image
            src="/badges/malmijal_playstore_badge_black.png"
            alt="Get it on Google Play"
            width={120}
            height={36}
            className="h-9 w-auto"
          />
        </a>
      </div>
    </div>
  );
}
