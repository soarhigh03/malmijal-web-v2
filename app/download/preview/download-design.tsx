import Image from "next/image";
import styles from "./preview.module.css";

export type DownloadVariant = "a" | "b";

// Destinations and icons verified against the existing public /download page.
const stores = [
  {
    platform: "ios",
    href: "https://apps.apple.com/kr/app/%EB%A7%90%EB%AF%B8%EC%9E%98/id6769989593",
    label: "App Store에서 다운로드",
    icon: "/assets/store/apple.png",
  },
  {
    platform: "android",
    href: "https://play.google.com/store/apps/details?id=com.malmijal.malmijal&hl=ko",
    label: "Google Play에서 다운로드",
    icon: "/assets/store/google-play.png",
  },
] as const;

export function DownloadDesign({ variant }: { variant: DownloadVariant }) {
  return (
    <div className={styles.design} data-variant={variant}>
      <header className={styles.header}>
        <a href="/" className={styles.brand} aria-label="말미잘 홈으로 이동">
          <Image
            src="/assets/logo/mijal_logo_v1.svg"
            alt=""
            width={512}
            height={415}
            className={styles.logo}
            priority
          />
          <span>말미잘</span>
        </a>
      </header>

      <main className={styles.hero}>
        <div className={styles.copy}>
          <h1 className={styles.headline}>
            <span>말하기에도 </span>
            <span>첨삭이 필요합니다.</span>
          </h1>
          <p className={styles.supporting}>
            60초 말해보고, 내 말하기 습관을 확인하세요.
          </p>

          <div className={styles.install}>
            <p className={styles.freeNote}>
              <span className={styles.accent} aria-hidden="true" />
              첫 분석 무료
            </p>
            <div className={styles.storeActions}>
              {stores.map((store) => (
                // Review traffic intentionally emits no production conversion events.
                <a
                  key={store.platform}
                  href={store.href}
                  className={styles.storeButton}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image src={store.icon} alt="" width={24} height={24} />
                  <span>{store.label}</span>
                </a>
              ))}
            </div>
            <p className={styles.pricing}>
              첫 분석 이후 훈련은 유료 구독으로 이용할 수 있어요.
            </p>
          </div>
        </div>

        <div className={styles.productArea}>
          <Image
            src="/assets/download/daily-speaking-preview-003.png"
            alt="하루 1분, 말하기 습관 정돈하기. 말미잘 매일, 한마디에서 질문을 보고 말하기를 시작하는 화면"
            width={1242}
            height={2688}
            sizes="(max-width: 767px) 280px, 304px"
            priority
            className={styles.productImage}
          />
        </div>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerLinks}>
          <a href="/privacy">개인정보 처리방침</a>
          <a href="/terms">이용약관</a>
          <a
            href="https://morning-punch-c8d.notion.site/36bc5a52750880ba98d5dcc5675ea05a"
            target="_blank"
            rel="noopener noreferrer"
          >
            고객지원
          </a>
        </div>
        <span>© 2026 Malmijal</span>
      </footer>
    </div>
  );
}
