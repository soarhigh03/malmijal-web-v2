import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { formatDate } from "@/lib/blog";
import type { LegalDoc } from "@/lib/legal";

export function LegalDocument({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <Header />
      <main className="bg-white min-h-screen pb-32 pt-32 sm:pt-40">
        <article className="mx-auto max-w-3xl px-6 sm:px-10">
          <h1 className="font-kopub text-black text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] tracking-[-0.035em] mb-6">
            {doc.title}
          </h1>

          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-black/55 mb-10 sm:mb-12">
            <span>
              시행일 <time dateTime={doc.effectiveDate}>{formatDate(doc.effectiveDate)}</time>
            </span>
            {doc.updatedAt && (
              <>
                <span aria-hidden>·</span>
                <span>
                  최종 수정일 <time dateTime={doc.updatedAt}>{formatDate(doc.updatedAt)}</time>
                </span>
              </>
            )}
          </p>

          <div className="prose-blog prose-legal" dangerouslySetInnerHTML={{ __html: doc.html }} />
        </article>
      </main>
      <Footer />
    </>
  );
}
