import Image from "next/image";

const MOUTHS = [
  // Rendered back → front so the front one (highest opacity) is on top.
  { key: "back", anim: "animate-mouth-back", offset: "right-0", z: "z-10" },
  { key: "mid", anim: "animate-mouth-mid", offset: "right-[14%]", z: "z-20" },
  { key: "front", anim: "animate-mouth-front", offset: "right-[28%]", z: "z-30" },
] as const;

export function Hero() {
  return (
    <section className="relative overflow-hidden min-h-[100svh] flex items-center bg-[#f0f0f0]">
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 pt-32 pb-16 grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-12 lg:gap-10 items-center">
        <div className="relative fade-up min-w-0">
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
