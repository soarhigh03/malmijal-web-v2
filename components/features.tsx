const DRILLS = [
  {
    name: "매일, 한마디",
    alias: "말매잘",
    short: "자유 스피치",
    desc: "가챠로 뽑힌 한 가지 주제에 대해 60초간 자유롭게 발화. 5개 차원 전부로 점수가 매겨지는 메인 드릴.",
    duration: "60s",
  },
  {
    name: "따라 읽기",
    alias: "발미잘",
    short: "대본 낭독",
    desc: "그날의 짧은 뉴스 대본을 그대로 낭독. 발성·발음·유창성의 기본기를 점검합니다.",
    duration: "60–120s",
  },
  {
    name: "세줄 요약",
    alias: "재진잘",
    short: "재진술 드릴",
    desc: "기사 한 편을 읽고 핵심을 내 말로 옮겨 말하기. 핵심 문장 커버리지까지 함께 표시.",
    duration: "30s",
  },
];

const DIMENSIONS = [
  { name: "Pace", desc: "속도와 일관성" },
  { name: "Fluency", desc: "유창성" },
  { name: "Confidence", desc: "자신감·발성 안정성" },
  { name: "Delivery", desc: "전달력·톤과 리듬" },
  { name: "Structure", desc: "도입–본론–마무리" },
];

export function Features() {
  return (
    <section id="about" className="bg-cloud-white py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="max-w-2xl mb-16">
          <p className="font-cursive text-sky-canvas text-3xl sm:text-4xl mb-3">
            about
          </p>
          <h2 className="font-display text-charcoal-text text-4xl sm:text-5xl leading-tight mb-6">
            매일 1~3분의<br />
            말하기 훈련 루틴.
          </h2>
          <p className="text-charcoal-text/80 text-base sm:text-lg leading-relaxed">
            말은 거울로 볼 수 없는 습관입니다. 짧은 녹음을 정량 지표로 분석해,
            "말 잘하고 싶다"는 막연한 욕구를 매일 반복할 수 있는 훈련으로
            바꿉니다.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-24">
          {DRILLS.map((d) => (
            <div
              key={d.alias}
              className="bg-haze-grey rounded-xl p-6 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-charcoal-text/60 tracking-wide uppercase">
                  {d.short}
                </span>
                <span className="text-xs font-medium text-action-blue">
                  {d.duration}
                </span>
              </div>
              <h3 className="font-display text-2xl text-charcoal-text">
                {d.name}
              </h3>
              <p className="text-xs text-charcoal-text/50">별칭 · {d.alias}</p>
              <p className="text-sm text-charcoal-text leading-relaxed">
                {d.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-black/10 pt-16">
          <p className="font-cursive text-sky-canvas text-2xl sm:text-3xl mb-3">
            scoring
          </p>
          <h3 className="font-display text-charcoal-text text-3xl sm:text-4xl mb-10">
            5개 차원으로 분석합니다.
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {DIMENSIONS.map((d) => (
              <div key={d.name} className="bg-haze-grey rounded-xl p-5">
                <p className="text-sm font-medium text-action-blue mb-2">
                  {d.name}
                </p>
                <p className="text-sm font-medium text-charcoal-text leading-snug">
                  {d.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
