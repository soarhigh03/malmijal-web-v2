import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getAllPostMeta, formatDate, type PostMeta } from "@/lib/blog";

export const metadata = {
  title: "Blog — 말미잘",
  description: "말미잘 팀이 쓰는 글. 제품, 분석, 엔지니어링.",
};

export default function BlogIndexPage() {
  const posts = getAllPostMeta();
  const [featured, ...rest] = posts;

  return (
    <>
      <Header />
      <main className="bg-[#f0f0f0] min-h-screen pb-32 pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <p className="font-kopub text-black/40 text-xs tracking-widest mb-4">
            BLOG
          </p>
          <h1 className="font-kopub text-black text-4xl sm:text-5xl md:text-6xl leading-tight mb-16 sm:mb-20">
            말미잘 노트
          </h1>

          {posts.length === 0 ? (
            <p className="text-black/60">아직 발행된 글이 없습니다.</p>
          ) : (
            <>
              <FeaturedCard post={featured} />
              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12 sm:mt-16">
                  {rest.map((post) => (
                    <GalleryCard key={post.slug} post={post} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function FeaturedCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group">
      <article className="relative rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm border border-black/10 p-8 sm:p-12 transition-colors hover:bg-white/80">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest text-black/55 mb-5">
          <span className="text-black/80 font-medium">Featured</span>
          <span aria-hidden>·</span>
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h2 className="font-kopub text-black text-3xl sm:text-4xl md:text-5xl leading-tight mb-5">
          {post.title}
        </h2>
        <p className="text-black/75 text-base sm:text-lg max-w-3xl leading-relaxed">
          {post.excerpt}
        </p>
        {post.author && (
          <p className="text-black/50 text-sm mt-8">by {post.author}</p>
        )}
      </article>
    </Link>
  );
}

function GalleryCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group h-full">
      <article className="relative h-full rounded-xl overflow-hidden bg-white/60 backdrop-blur-sm border border-black/10 p-6 flex flex-col gap-3 transition-colors hover:bg-white/80">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-black/55">
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h3 className="font-kopub text-black text-xl leading-snug">
          {post.title}
        </h3>
        <p className="text-black/70 text-sm leading-relaxed flex-1">
          {post.excerpt}
        </p>
        {post.author && (
          <p className="text-black/50 text-xs mt-2">by {post.author}</p>
        )}
      </article>
    </Link>
  );
}
