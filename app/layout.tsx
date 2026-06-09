import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "말미잘 — 말, 미친듯이 잘하기",
  description:
    "말 한마디로 결정되는 당신의 가치. 매일 1~3분, 짧은 녹음으로 말하기 습관을 다듬는 한국어 음성 코칭 앱.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#070b1c",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className="min-h-screen bg-[#070b1c]">
        <link
          rel="preconnect"
          href="https://cdn.jsdelivr.net"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.css"
        />
        {children}
      </body>
    </html>
  );
}
