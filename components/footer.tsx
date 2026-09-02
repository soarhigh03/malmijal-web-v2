import Image from "next/image";

export function Footer() {
  return (
    <footer id="contact" className="bg-canvas border-t border-black/10">
      <div className="flex justify-center gap-3 pt-10 pb-4">
        <a
          href="https://apps.apple.com/kr/app/%EB%A7%90%EB%AF%B8%EC%9E%98/id6769989593"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="App Store에서 다운로드"
        >
          <Image
            src="/badges/malmijal_appstore_badge_black.svg"
            alt="Download on the App Store"
            width={162}
            height={48}
            className="h-12 w-auto"
          />
        </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.malmijal.malmijal"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Google Play에서 다운로드"
        >
          <Image
            src="/badges/malmijal_playstore_badge_black.png"
            alt="Get it on Google Play"
            width={162}
            height={48}
            className="h-12 w-auto"
          />
        </a>
      </div>
      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-8 sm:py-10 flex flex-col gap-3 text-xs sm:text-sm text-black/60">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-medium text-black/80">에토세토라</span>
          <span aria-hidden className="text-black/30">|</span>
          <span>대표자 박병호</span>
          <span aria-hidden className="text-black/30">|</span>
          <span>사업자등록번호 418-23-02270</span>
          <span aria-hidden className="text-black/30">|</span>
          <a
            href="mailto:malmijal.team@gmail.com"
            className="hover:text-black transition-colors"
          >
            malmijal.team@gmail.com
          </a>
        </p>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-black/50">
          <span>서울특별시 서초구 강남대로61길 23</span>
          <span aria-hidden>·</span>
          <span>© 2026 에토세토라</span>
        </p>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <a href="https://morning-punch-c8d.notion.site/36ac5a527508805e9a3feb408fff950c" target="_blank" rel="noopener noreferrer" className="font-medium hover:text-black/70 transition-colors">개인정보처리방침</a>
          <span aria-hidden className="text-black/30">|</span>
          <a href="https://morning-punch-c8d.notion.site/394c5a52750880a086e3de29aa2a2183" target="_blank" rel="noopener noreferrer" className="hover:text-black/70 transition-colors">이용약관</a>
          <span aria-hidden className="text-black/30">|</span>
          <a href="https://morning-punch-c8d.notion.site/36bc5a52750880ba98d5dcc5675ea05a" target="_blank" rel="noopener noreferrer" className="hover:text-black/70 transition-colors">고객지원</a>
        </p>
        <p className="text-[11px] text-black/40">
          Google Play 및 Google Play 로고는 Google LLC의 상표입니다.
        </p>
      </div>
    </footer>
  );
}
