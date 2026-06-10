import { getFaqItems } from "@/lib/faq";

export async function Faq() {
  const items = await getFaqItems();
  if (items.length === 0) return null;

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
          {items.map((item) => (
            <details key={item.question} className="group">
              <summary className="cursor-pointer list-none py-6 flex items-start justify-between gap-6">
                <span className="font-kopub text-black text-lg sm:text-xl leading-snug">
                  {item.question}
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
              <div
                className="pb-6 pr-12 text-black/70 text-base leading-relaxed faq-answer"
                dangerouslySetInnerHTML={{ __html: item.answerHtml }}
              />
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
