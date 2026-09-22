import { TrackedLink } from "@/components/tracked-link";

const POSTS = [
  {
    title: "5분·10분·15분·20분 발표 대본 분량: 글자 수 계산 예시",
    href: "/blog/presentation-script-length",
  },
  {
    title: "두괄식 답변 예시: 면접·보고에서 결론부터 말하는 법",
    href: "/blog/interview-top-down-answer-examples",
  },
  {
    title: "면접 답변 길이: 질문별 시간 기준과 짧게 줄이는 예시",
    href: "/blog/interview-answer-length",
  },
];

export function PopularPosts() {
  return (
    <section className="bg-[#f0f0f0] py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <p className="font-kopub text-black/40 text-sm tracking-widest mb-4">
          인기 글
        </p>
        <h2 className="font-kopub text-black text-4xl sm:text-5xl leading-tight mb-12 sm:mb-16">
          많이 읽은 글.
        </h2>

        <div className="divide-y divide-black/10 border-t border-b border-black/10">
          {POSTS.map((post) => (
            <TrackedLink
              key={post.href}
              href={post.href}
              fromSlug="home"
              position="popular"
              className="group flex items-center justify-between gap-6 py-6"
            >
              <span className="font-kopub text-black text-lg sm:text-xl leading-snug group-hover:text-black/70 transition-colors">
                {post.title}
              </span>
              <span
                aria-hidden
                className="shrink-0 text-black/30 group-hover:text-black/60 transition-colors"
              >
                →
              </span>
            </TrackedLink>
          ))}
        </div>
      </div>
    </section>
  );
}
