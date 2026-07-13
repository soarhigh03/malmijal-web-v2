"use client";

import { useState } from "react";

const AXES = [
  {
    name: "Pace",
    label: "속도와 일관성",
    measures:
      "초당 음절 수(발화 속도)와 10초 구간별 속도 편차(일관성)를 측정합니다. 같은 평균 속도라도 급가속·급감속이 반복되면 전달이 무너지기 때문에 '빠르기'와 '균일함'을 분리해 측정합니다.",
    basis:
      "한국어 자연 발화 평균은 약 7음절/초(서울 코퍼스 조음속도 연구). 아나운서 낭독 속도가 권장 구간의 중앙에 위치합니다.",
  },
  {
    name: "Fluency",
    label: "유창성",
    measures:
      "분당 필러(어·음·그) 횟수와, 문법적으로 끊기면 안 되는 지점(절 중간)의 멈춤 횟수를 측정합니다.",
    basis:
      "모든 멈춤을 나쁘게 보지 않습니다. 문장과 문장 사이의 멈춤은 오히려 좋은 발표의 호흡이라 제외하고, 절 중간의 멈춤만 비유창성으로 셉니다. 발화 비유창성 연구의 표준 접근입니다.",
  },
  {
    name: "Confidence",
    label: "자신감·발성 안정성",
    measures:
      "성량, 목소리의 미세 떨림과 명료도(jitter·shimmer·HNR), 말끝이 흐려지는 패턴, 발화가 진행될수록 음이 올라가는 긴장 패턴을 측정합니다.",
    basis:
      "자신감은 직접 잴 수 없습니다. 대신 청자가 실제로 자신감을 판단할 때 쓰는 음향 단서를 측정합니다. jitter·shimmer·HNR은 음성학에서 발성 안정성을 정량화하는 표준 지표입니다.",
  },
  {
    name: "Delivery",
    label: "전달력·톤과 리듬",
    measures:
      "음높이 변화폭(억양의 생동감), 크기 변화폭(강약 조절), 그리고 강조가 발표 전체에 고르게 분포하는지를 측정합니다.",
    basis:
      "억양 변화폭이 클수록 청자가 발표를 '생동감 있다'고 지각한다는 연구(Hincks, 2005)에 기반합니다.",
  },
  {
    name: "Structure",
    label: "도입–본론–마무리",
    measures:
      "서론·본론·결론 3파트의 논리 구성을 평가합니다. 다섯 축 중 유일하게 목소리가 아닌 '내용'을 보는 축으로, LLM이 대본을 평가합니다.",
    basis:
      "청중은 발표의 첫인상과 마무리를 가장 오래 기억합니다(초두·최신 효과). 이에 근거해 서론과 결론을 본론과 분리해 각각 평가합니다.",
  },
];

export function Scoring() {
  const [selected, setSelected] = useState(0);
  const axis = AXES[selected];
  const panelId = `scoring-panel-${axis.name.toLowerCase()}`;
  const buttonId = `scoring-tab-${axis.name.toLowerCase()}`;

  return (
    <section id="scoring" className="bg-[#f0f0f0] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="max-w-2xl mb-16">
          <p className="font-kopub text-black/40 text-sm tracking-widest mb-4">
            SCORING
          </p>
          <h3 className="font-kopub text-black text-3xl sm:text-4xl mb-6">
            5개 차원으로 분석합니다.
          </h3>
          <p className="text-black/70 text-base leading-relaxed">
            모든 지표는 녹음 파형에서 직접 측정합니다. AI의 인상 평가가 아닙니다.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {AXES.map((a, i) => (
            <button
              key={a.name}
              type="button"
              id={`scoring-tab-${a.name.toLowerCase()}`}
              aria-expanded={i === selected}
              aria-controls={`scoring-panel-${a.name.toLowerCase()}`}
              onClick={() => setSelected(i)}
              className={`bg-white/60 backdrop-blur-sm rounded-2xl p-5 border text-left transition-colors ${
                i === selected
                  ? "border-black/30 bg-white/90"
                  : "border-black/5"
              }`}
            >
              <p className="font-kopub text-sm text-black mb-2">{a.name}</p>
              <p className="text-sm text-black/70 leading-snug">{a.label}</p>
            </button>
          ))}
        </div>

        <div
          id={panelId}
          role="region"
          aria-labelledby={buttonId}
          className="mt-4 bg-white/60 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-black/5"
        >
          <div className="mb-6">
            <p className="text-xs tracking-widest text-black/40 uppercase mb-2">
              무엇을 재는가
            </p>
            <p className="text-sm sm:text-base text-black/80 leading-relaxed">
              {axis.measures}
            </p>
          </div>
          <div>
            <p className="text-xs tracking-widest text-black/40 uppercase mb-2">
              근거
            </p>
            <p className="text-sm text-black/60 leading-relaxed">
              {axis.basis}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
