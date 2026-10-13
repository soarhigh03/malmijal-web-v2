import type { Metadata } from "next";
import { DownloadDesign, type DownloadVariant } from "./download-design";
import styles from "./preview.module.css";

export const metadata: Metadata = {
  title: "다운로드 디자인 비교",
  description: "말미잘 다운로드 페이지의 두 가지 디자인 시안입니다.",
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
  alternates: { canonical: "/download/preview" },
  openGraph: {
    title: "말미잘 다운로드 디자인 비교",
    description: "말미잘 다운로드 페이지의 두 가지 디자인 시안입니다.",
    url: "/download/preview",
  },
  twitter: {
    title: "말미잘 다운로드 디자인 비교",
    description: "말미잘 다운로드 페이지의 두 가지 디자인 시안입니다.",
  },
};

export default async function DownloadPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string | string[] }>;
}) {
  const params = await searchParams;
  const variant: DownloadVariant = params.variant === "b" ? "b" : "a";

  return (
    <div className={styles.preview}>
      <nav className={styles.reviewBar} aria-label="다운로드 디자인 시안 선택">
        <span className={styles.reviewLabel}>다운로드 시안</span>
        <div className={styles.reviewOptions}>
          {/* Full navigation keeps each review independent of production GA. */}
          <a
            href="/download/preview?variant=a"
            aria-current={variant === "a" ? "page" : undefined}
          >
            A · 차분하게
          </a>
          <a
            href="/download/preview?variant=b"
            aria-current={variant === "b" ? "page" : undefined}
          >
            B · 물빛으로
          </a>
        </div>
      </nav>
      <DownloadDesign variant={variant} />
    </div>
  );
}
