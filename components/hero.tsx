import Image from "next/image";

const MOUTHS = [
  // Rendered back → front so the front one (highest opacity) is on top.
  { key: "back", anim: "animate-mouth-back", offset: "right-0", z: "z-10" },
  { key: "mid", anim: "animate-mouth-mid", offset: "right-[14%]", z: "z-20" },
  { key: "front", anim: "animate-mouth-front", offset: "right-[28%]", z: "z-30" },
] as const;

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden min-h-0 lg:min-h-[100svh] flex items-start lg:items-center bg-[#f0f0f0]">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 pt-24 pb-10 lg:pt-32 lg:pb-16 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-6 lg:gap-8 items-center">
        <div className="relative min-w-0">
          <h1 className="relative font-kopub heading-strong text-black text-[2.125rem] sm:text-[2.5rem] md:text-[3rem] lg:text-[2.875rem] xl:text-[3.5rem] leading-[1.18] tracking-tight">
            <span className="block whitespace-nowrap fade-up fade-up-delay-1">
              말 한마디로 결정되는
            </span>
            <span className="block fade-up fade-up-delay-2">당신의 가치</span>
          </h1>

          <div className="mt-5 sm:mt-6">
            <div className="flex items-center gap-5 text-black fade-up fade-up-delay-3">
              <p className="text-base sm:text-lg font-medium">
                그 가치를 함께 만들어가는 서비스
              </p>
              <span aria-hidden className="h-px w-12 sm:w-16 bg-black/70" />
              <p className="font-kopub text-base sm:text-lg">말미잘</p>
            </div>
            <div className="mt-2 flex items-center gap-3 fade-up fade-up-delay-4">
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
          </div>
        </div>

        <div className="relative flex justify-center lg:justify-end overflow-hidden">
          <div className="relative w-full max-w-[720px] aspect-square">
            {MOUTHS.map((m) => (
              <div
                key={m.key}
                className={`absolute top-0 ${m.offset} ${m.z} ${m.anim} h-full aspect-[3360/3728] will-change-transform`}
              >
                <Image
                  src="/assets/images/mouth.png"
                  alt=""
                  fill
                  priority={m.key === "front"}
                  sizes="(max-width: 768px) 70vw, 40vw"
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
