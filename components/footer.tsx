export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-[#f0f0f0] border-t border-black/10"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10 py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div>
          <p className="font-kopub text-black text-3xl mb-3">말미잘</p>
          <p className="text-black/65 text-sm max-w-md leading-relaxed">
            말, 미친듯이 잘하기. 매일 짧은 녹음으로 한국어 말하기를 훈련하는
            음성 코칭 앱.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-black/65">
          <a
            href="mailto:hello@malmijal.app"
            className="hover:text-black transition-colors"
          >
            hello@malmijal.app
          </a>
          <p>© {new Date().getFullYear()} Malmijal</p>
        </div>
      </div>
    </footer>
  );
}
