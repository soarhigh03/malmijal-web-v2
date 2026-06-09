const LOGO_URL = "/assets/logo/mijal_logo_v1.svg";

const maskStyle = {
  WebkitMaskImage: `url(${LOGO_URL})`,
  maskImage: `url(${LOGO_URL})`,
  WebkitMaskSize: "contain",
  maskSize: "contain",
  WebkitMaskRepeat: "no-repeat",
  maskRepeat: "no-repeat",
  WebkitMaskPosition: "center",
  maskPosition: "center",
};

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[100svh] flex items-center justify-center bg-[#070b1c]">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#1a2655_0%,#0a0e22_55%,#050816_100%)]"
      />

      <div
        aria-hidden
        className="absolute inset-0 overflow-hidden pointer-events-none"
      >
        <div className="absolute -top-40 -left-32 w-[60vw] h-[60vw] rounded-full bg-[#2b7fff] opacity-30 blur-[110px] animate-drift-1" />
        <div className="absolute -bottom-48 -right-24 w-[70vw] h-[70vw] rounded-full bg-[#4060ff] opacity-25 blur-[140px] animate-drift-2" />
        <div className="absolute top-1/4 left-1/3 w-[50vw] h-[50vw] rounded-full bg-[#88a8ff] opacity-15 blur-[100px] animate-drift-3" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-12 sm:gap-14 px-6 py-24 sm:py-32">
        <div className="relative animate-logo-enter">
          <div
            aria-hidden
            className="absolute inset-0 -m-16 sm:-m-24 bg-[radial-gradient(circle,#6494ff_0%,transparent_65%)] blur-3xl opacity-70 animate-halo pointer-events-none"
          />

          <div
            className="relative w-[280px] sm:w-[360px] md:w-[440px] aspect-[511.54/414.69] animate-logo-glow"
            style={{
              ...maskStyle,
              backdropFilter: "blur(14px) saturate(140%)",
              WebkitBackdropFilter: "blur(14px) saturate(140%)",
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.55) 0%, rgba(200,220,255,0.28) 45%, rgba(140,180,255,0.4) 100%)",
            }}
          >
            <div
              aria-hidden
              className="absolute -inset-y-8 -left-1/4 w-1/3 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-shimmer pointer-events-none"
            />
          </div>
        </div>

        <p className="fade-up fade-up-delay-1 text-cloud-white text-3xl sm:text-5xl md:text-6xl text-center max-w-2xl leading-tight font-medium">
          말 한마디로 결정되는
          <br className="sm:hidden" /> 당신의 가치
        </p>

        <a
          id="download"
          href="#"
          className="fade-up fade-up-delay-2 inline-flex items-center justify-center px-8 py-3.5 rounded-full text-base font-medium text-cloud-white border border-cloud-white/40 bg-cloud-white/10 backdrop-blur-md hover:bg-cloud-white/20 transition-colors"
        >
          DOWNLOAD
        </a>
      </div>
    </section>
  );
}
