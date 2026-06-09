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
      <main className="bg-[#070b1c] min-h-screen pb-32 pt-24 sm:pt-32">
        <div className="mx-auto max-w-6xl px-5 sm:px-8">
          <p className="text-cloud-white/55 text-xs uppercase tracking-widest mb-4">
            Blog
          </p>
          <h1 className="text-cloud-white text-4xl sm:text-5xl md:text-6xl font-semibold leading-tight mb-16 sm:mb-20">
            말미잘 노트
          </h1>

          {posts.length === 0 ? (
            <p className="text-cloud-white/60">아직 발행된 글이 없습니다.</p>
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
      <article className="relative rounded-2xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-white/10 to-white/[0.03] border border-white/15 p-8 sm:p-12 transition-colors hover:bg-white/[0.12]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest text-cloud-white/55 mb-5">
          <span className="text-action-blue">Featured</span>
          <span aria-hidden>·</span>
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h2 className="text-cloud-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-5 group-hover:text-cloud-white">
          {post.title}
        </h2>
        <p className="text-cloud-white/75 text-base sm:text-lg max-w-3xl leading-relaxed">
          {post.excerpt}
        </p>
        {post.author && (
          <p className="text-cloud-white/50 text-sm mt-8">by {post.author}</p>
        )}
      </article>
    </Link>
  );
}

function GalleryCard({ post }: { post: PostMeta }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block group h-full">
      <article className="relative h-full rounded-xl overflow-hidden backdrop-blur-md bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 p-6 flex flex-col gap-3 transition-colors hover:bg-white/[0.1] hover:border-white/20">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest text-cloud-white/55">
          <span>{formatDate(post.date)}</span>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>
        <h3 className="text-cloud-white text-xl font-semibold leading-snug">
          {post.title}
        </h3>
        <p className="text-cloud-white/70 text-sm leading-relaxed flex-1">
          {post.excerpt}
        </p>
        {post.author && (
          <p className="text-cloud-white/50 text-xs mt-2">by {post.author}</p>
        )}
      </article>
    </Link>
  );
}
