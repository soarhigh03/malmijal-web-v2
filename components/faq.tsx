const FAQ_ITEMS = [
  {
    q: "어떤 언어를 지원하나요?",
    a: "현재는 한국어만 지원합니다. 영어·일본어는 베타 일정에 따라 순차적으로 추가될 예정입니다.",
  },
  {
    q: "녹음 데이터는 어떻게 다뤄지나요?",
    a: "음성은 분석 직후 서버에서 파기되며, 점수와 텍스트 일부만 저장됩니다. 학습용 공유에는 별도 동의가 필요합니다.",
  },
  {
    q: "하루에 얼마나 해야 하나요?",
    a: "기본 루틴은 1~3분입니다. '매일, 한마디'·'따라 읽기'·'세줄 요약' 중 하나만 골라 진행해도 충분합니다.",
  },
  {
    q: "점수가 낮게 나오는데 정확한 건가요?",
    a: "5개 차원은 절대 평가가 아닙니다. 같은 차원의 추세선과 직전 N회 평균과의 차이를 함께 보세요.",
  },
  {
    q: "구독료가 있나요?",
    a: "기본 기능은 무료이고, 일부 고급 분석과 히스토리 비교는 유료 플랜으로 제공됩니다.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-canvas py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <p className="font-kopub text-black/40 text-sm tracking-widest mb-4">
          FAQ
        </p>
        <h2 className="font-kopub text-black text-4xl sm:text-5xl leading-tight mb-12 sm:mb-16">
          자주 묻는 질문.
        </h2>

        <div className="divide-y divide-black/10 border-t border-b border-black/10">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="group">
              <summary className="cursor-pointer list-none py-6 flex items-start justify-between gap-6">
                <span className="font-kopub text-black text-lg sm:text-xl leading-snug">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="mt-1 shrink-0 w-6 h-6 rounded-full border border-black/30 flex items-center justify-center text-black/60 transition-transform group-open:rotate-45"
                >
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  >
                    <path d="M6 1.5 V10.5" />
                    <path d="M1.5 6 H10.5" />
                  </svg>
                </span>
              </summary>
              <p className="pb-6 pr-12 text-black/70 text-base leading-relaxed">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
