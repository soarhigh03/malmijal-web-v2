export function Footer() {
  return (
    <footer
      id="contact"
      className="bg-sky-canvas border-t border-cloud-white/10"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8 py-16 flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div>
          <p className="font-display text-cloud-white text-4xl mb-3">말미잘</p>
          <p className="text-cloud-white/70 text-sm max-w-md leading-relaxed">
            말, 미친듯이 잘하기. 매일 짧은 녹음으로 한국어 말하기를 훈련하는
            음성 코칭 앱.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-cloud-white/70">
          <a
            href="mailto:hello@malmijal.app"
            className="hover:text-cloud-white transition-colors"
          >
            hello@malmijal.app
          </a>
          <p>© {new Date().getFullYear()} Malmijal</p>
        </div>
      </div>
    </footer>
  );
}
