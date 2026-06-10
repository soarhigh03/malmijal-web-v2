export function Footer() {
  return (
    <footer id="contact" className="bg-canvas border-t border-black/10">
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
      </div>
    </footer>
  );
}
