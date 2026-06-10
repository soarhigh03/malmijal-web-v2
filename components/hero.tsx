import Image from "next/image";

const LOGO_URL = "/assets/logo/mijal_logo_v1.svg";

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[100svh] flex items-center bg-[#f0f0f0]">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 pt-32 pb-16 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-10 items-center">
        <div className="relative fade-up min-w-0">
          {/* Blue logo decoration behind 말 */}
          <div
            aria-hidden
            className="absolute -top-5 -left-2 sm:-top-7 sm:-left-3 w-[95px] sm:w-[120px] md:w-[140px] aspect-[511.54/414.69] pointer-events-none"
            style={{
              backgroundColor: "#a8c5ff",
              WebkitMaskImage: `url(${LOGO_URL})`,
              maskImage: `url(${LOGO_URL})`,
              WebkitMaskSize: "contain",
              maskSize: "contain",
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
            }}
          />

          <h1 className="relative font-kopub text-black text-[2.5rem] sm:text-5xl md:text-[3.75rem] lg:text-[3.5rem] xl:text-[4.25rem] leading-[1.18] tracking-tight">
            <span className="block whitespace-nowrap">말 한마디로 결정되는</span>
            <span className="block">당신의 가치</span>
          </h1>

          <div className="mt-10 sm:mt-12 fade-up fade-up-delay-2">
            <div className="flex items-center gap-5 text-black">
              <p className="text-base sm:text-lg font-medium">
                그 가치를 함께 만들어가는 서비스
              </p>
              <span aria-hidden className="h-px w-12 sm:w-16 bg-black/70" />
              <p className="font-kopub text-base sm:text-lg">말미잘</p>
            </div>
            <p className="mt-3 text-xs sm:text-sm text-black/55 tracking-wide">
              available on App Store
            </p>
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end fade-up fade-up-delay-1">
          <div className="relative w-[280px] sm:w-[380px] md:w-[460px] lg:w-[520px] aspect-[3/4]">
            <Image
              src="/assets/images/mouth.png"
              alt=""
              fill
              priority
              sizes="(max-width: 768px) 80vw, 50vw"
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
