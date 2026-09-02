import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { QRCodeSVG } from "qrcode.react";
import { siteName } from "@/lib/site";
import { AndroidDownloadButton } from "./android-notice";
import { GaScript, IosDownloadButton } from "./analytics";

const IOS_URL =
  "https://apps.apple.com/kr/app/%EB%A7%90%EB%AF%B8%EC%9E%98/id6769989593";
const ANDROID_URL =
  "https://play.google.com/store/apps/details?id=com.malmijal.malmijal&hl=ko";
const RECORDING_SCREENSHOT = "/assets/download/app-recording.png";
const RESULT_SCREENSHOT = "/assets/download/app-result.png";

const QR_SIZE = 92;

const PALETTE: "warmGray" | "reskinBlue" | "neutralWhite" = "reskinBlue";

const PALETTES = {
  warmGray: {
    pageBackground:
      "radial-gradient(circle at 20% 12%, rgba(255,255,255,0.7), transparent 55%), #F0F0EE",
    blob1: "#FBD8D0",
    blob2: "#EFE3D6",
    blob3: "#E3E4E0",
    accent: "#F1705C",
    accentSoft: "#FDEAE6",
  },
  reskinBlue: {
    pageBackground:
      "linear-gradient(165deg, #EAF4FB 0%, #F7FBFD 100%)",
    blob1: "#D6EEF2",
    blob2: "#DCE9F7",
    blob3: "#FBD8D0",
    accent: "#F1705C",
    accentSoft: "#FDEAE6",
  },
  neutralWhite: {
    pageBackground:
      "radial-gradient(circle at 20% 12%, rgba(241,112,92,0.05), transparent 50%), #FBFBFA",
    blob1: "#FBD8D0",
    blob2: "#EDEDEA",
    blob3: "#F6E9E6",
    accent: "#F1705C",
    accentSoft: "#FDEAE6",
  },
} as const;

const palette = PALETTES[PALETTE];

const title = "말미잘 다운로드";
const description =
  "한국어 말하기를 점수로 확인하고 매일 더 또렷하게 연습하는 AI 스피치 코치, 말미잘을 다운로드하세요.";

export const metadata: Metadata = {
  title,
  description,
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: {
    canonical: "/download",
  },
  openGraph: {
    type: "website",
    url: "/download",
    siteName,
    title,
    description,
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "말미잘 — 한국어 AI 스피치 코치",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/og-default.png"],
  },
};

export default function DownloadPage() {
  return (
    <main className="relative min-h-screen overflow-hidden text-[#18213a]" style={{ background: palette.pageBackground }}>
      <GaScript />
      <Decorations />

      <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-5xl flex-col px-5 py-4 sm:px-8">
        <div className="flex flex-1 flex-col items-center justify-center pb-4 pt-5 text-center sm:pt-6">
          <header className="flex justify-center">
            <Link
              href="/"
              aria-label="말미잘 홈으로 이동"
              className="inline-flex"
            >
              <Image
                src="/assets/logo/mijal_logo_v1.svg"
                alt="말미잘"
                width={122}
                height={36}
                priority
                className="h-7 w-auto sm:h-8"
              />
            </Link>
          </header>

          <div className="mb-3 mt-5 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold text-indigo-900 shadow-sm backdrop-blur" style={{ backgroundColor: palette.accentSoft }}>
            <span className="h-2 w-2 rounded-full" aria-hidden style={{ backgroundColor: palette.accent }} />
            한국어 말하기 연습 앱
          </div>

          <h1 className="font-kopub heading-strong text-[2rem] leading-[1.18] text-[#11182f] sm:text-[2.4rem] md:text-[2.85rem]">
            말미잘, 한번 써보세요
          </h1>

          <p className="mt-3 text-base font-semibold leading-7 text-[#35415f]/78 sm:text-lg sm:leading-7">
            한국어 말하기를 점수로 확인하고,
            <br />
            매일 더 또렷하게 연습하세요.
          </p>

          <div className="mt-5 flex w-full max-w-[400px] flex-col gap-2.5">
            <IosDownloadButton
              href={IOS_URL}
              label="App Store에서 다운로드"
              tone="from-[#ffffff] to-[#eef4ff]"
              iconSrc="/assets/store/apple.png"
              iconAlt="Apple"
            />
            <AndroidDownloadButton
              href={ANDROID_URL}
              label="Google Play에서 다운로드"
              tone="from-[#ffffff] to-[#edfff8]"
              iconSrc="/assets/store/google-play.png"
              iconAlt="Google Play"
            />
          </div>

          <div className="relative mt-5 w-full max-w-[440px] rounded-[1.45rem] border border-white/70 bg-white/46 p-3 shadow-[0_14px_38px_rgba(80,73,160,0.14)] backdrop-blur sm:mt-6">
            <div className="mb-2 flex items-center justify-center gap-2 text-xs font-bold text-[#4a5573]/78 sm:text-sm">
              <span aria-hidden className="h-px w-7 bg-[#7f8ab4]/35" />
              휴대폰으로 스캔해서 받기
              <span aria-hidden className="h-px w-7 bg-[#7f8ab4]/35" />
            </div>

            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              <QrCard label="iPhone으로 스캔" value={IOS_URL} />
              <QrCard label="Android로 스캔" value={ANDROID_URL} />
            </div>
          </div>
        </div>

        <footer className="flex flex-row flex-wrap items-center justify-center gap-2 pb-0 text-xs font-semibold text-[#35415f]/62 sm:gap-4">
          <a href="https://morning-punch-c8d.notion.site/36ac5a527508805e9a3feb408fff950c" target="_blank" rel="noopener noreferrer" className="hover:text-black/70 transition-colors">개인정보처리방침</a>
          <span aria-hidden className="text-[#35415f]/28">·</span>
          <a href="https://morning-punch-c8d.notion.site/394c5a52750880a086e3de29aa2a2183" target="_blank" rel="noopener noreferrer" className="hover:text-black/70 transition-colors">이용약관</a>
          <span aria-hidden className="text-[#35415f]/28">·</span>
          <a href="https://morning-punch-c8d.notion.site/36bc5a52750880ba98d5dcc5675ea05a" target="_blank" rel="noopener noreferrer" className="hover:text-black/70 transition-colors">고객지원</a>
          <span aria-hidden className="text-[#35415f]/28">·</span>
          <span>© 2026 Malmijal</span>
        </footer>
      </section>
    </main>
  );
}

function QrCard({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-[1.1rem] bg-white/82 p-2.5 text-center shadow-[0_8px_18px_rgba(70,67,154,0.09)] sm:p-3">
      <p className="mb-1.5 text-xs font-extrabold text-[#293451] sm:text-sm">{label}</p>
      <div className="mx-auto flex w-fit rounded-xl bg-white p-1.5">
        <QRCodeSVG
          value={value}
          size={QR_SIZE}
          level="M"
          includeMargin={false}
          className="h-[78px] w-[78px] sm:h-[92px] sm:w-[92px]"
        />
      </div>
    </article>
  );
}

function Decorations() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute left-[-4rem] top-24 h-36 w-44 rotate-[-18deg] rounded-[48%_52%_56%_44%/44%_58%_42%_56%]" style={{ backgroundColor: `${palette.blob1}8c`, boxShadow: `0 20px 70px ${palette.blob1}38` }} />
      <div className="absolute right-[-4.5rem] top-28 h-40 w-48 rotate-12 rounded-[58%_42%_45%_55%/48%_42%_58%_52%]" style={{ backgroundColor: `${palette.blob2}7a`, boxShadow: `0 20px 70px ${palette.blob2}38` }} />
      <div className="absolute bottom-24 left-[-3.5rem] h-44 w-40 rotate-6 rounded-[42%_58%_50%_50%/58%_46%_54%_42%] bg-white/38" />
      <div className="absolute bottom-20 right-[-3rem] h-36 w-36 rounded-[46%_54%_44%_56%/52%_44%_56%_48%]" style={{ backgroundColor: `${palette.blob3}6b` }} />

      <ScreenshotFloat
        src={RECORDING_SCREENSHOT}
        alt="말미잘 녹음 화면"
        className="left-[1%] top-[40%] hidden w-40 rotate-[-8deg] sm:block lg:left-[4%] lg:top-[38%] lg:w-48"
      />
      <ScreenshotFloat
        src={RESULT_SCREENSHOT}
        alt="말미잘 분석 결과 화면"
        className="right-[1%] top-[22%] hidden w-40 rotate-6 sm:block lg:right-[4%] lg:top-[22%] lg:w-48"
      />

      <div className="absolute left-[6%] top-[25%] hidden w-36 rotate-[-10deg] rounded-[1.35rem] rounded-bl-md bg-white/42 px-4 py-3 shadow-sm backdrop-blur lg:block">
        <p className="mb-2 text-xs font-extrabold text-[#35415f]/55">음성 파형</p>
        <div className="flex h-9 items-center justify-between gap-1.5">
          {[16, 28, 20, 34, 24, 30, 18, 26].map((height, index) => (
            <span
              key={index}
              className="w-2 rounded-full bg-[#7b6dff]/45"
              style={{ height }}
            />
          ))}
        </div>
      </div>

      <div className="absolute -left-28 bottom-4 hidden w-40 rotate-3 rounded-[1.35rem] bg-white/48 px-4 py-3 shadow-sm backdrop-blur lg:block">
        <p className="mb-2 text-xs font-extrabold text-[#35415f]/55">5축 진단</p>
        {[
          ["속도", "72%"],
          ["유창성", "64%"],
          ["자신감", "78%"],
          ["전달력", "70%"],
          ["구조", "58%"],
        ].map(([label, width]) => (
          <div key={label} className="mb-1.5 grid grid-cols-[2.75rem_1fr] items-center gap-2">
            <span className="text-[11px] font-bold text-[#35415f]/55">{label}</span>
            <span className="h-1.5 rounded-full bg-white/55">
              <span
                className="block h-full rounded-full bg-[#7ee2ca]/70"
                style={{ width }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScreenshotFloat({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <div
      className={`absolute overflow-hidden rounded-[1.35rem] border border-white/70 bg-white/42 p-1.5 shadow-[0_18px_42px_rgba(64,70,150,0.16)] backdrop-blur ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={260}
        height={520}
        className="h-auto w-full rounded-[1rem] object-cover opacity-90"
      />
    </div>
  );
}
