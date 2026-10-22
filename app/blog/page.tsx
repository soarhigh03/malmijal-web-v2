import { Suspense } from "react";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import {
  CategoryGrid,
  CoverImage,
  MostReadPosts,
  type BlogCardPost,
} from "@/components/blog-index";
import { BlogCategoryFilter } from "@/components/blog-category-filter";
import {
  getAllPostMeta,
  getMostReadPosts,
  formatDate,
  type PostMeta,
} from "@/lib/blog";
import { ogImageAlt, siteName } from "@/lib/site";

const title = "말미잘 블로그";
const description =
  "면접·발표 말하기, 한국어 스피치 진단, AI 스피치 코치 활용법을 정리한 말미잘 블로그입니다.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    type: "website",
    url: "/blog",
    siteName,
    title,
    description,
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/og-default.png"],
  },
};

export default function BlogIndexPage() {
  const posts = getAllPostMeta();

  const explicitlyFeatured = posts.filter((p) => p.featured);
  if (process.env.NODE_ENV === "development" && explicitlyFeatured.length > 1) {
    console.warn(
      `[blog] ${explicitlyFeatured.length} posts have featured: true (${explicitlyFeatured.map((p) => p.slug).join(", ")}). Using the newest by date.`,
    );
  }

  let featured: typeof posts[number];
  let rest: typeof posts;

  if (explicitlyFeatured.length >= 1) {
    featured = explicitlyFeatured.sort((a, b) =>
      a.date < b.date ? 1 : -1,
    )[0];
    rest = posts.filter((p) => p.slug !== featured.slug);
  } else {
    [featured, ...rest] = posts;
  }

  const toCard = (p: PostMeta): BlogCardPost => ({
    ...p,
    dateLabel: formatDate(p.date),
  });
  const mostRead = getMostReadPosts(posts).map(toCard);
  const gridPosts = rest.map(toCard);

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen pb-32 pt-32 sm:pt-40">
        <div className="mx-auto max-w-7xl px-6 sm:px-10">
          <div className="flex items-center gap-2 mb-4">
            <span aria-hidden className="w-1.5 h-1.5 rounded-full bg-black" />
            <p className="text-black/55 text-xs sm:text-sm tracking-wide">
              Blog and articles
            </p>
          </div>
          <h1 className="font-kopub heading-strong text-black text-4xl sm:text-5xl md:text-6xl leading-tight mb-12 sm:mb-16">
            말미잘 노트
          </h1>

          {posts.length === 0 ? (
            <p className="text-black/60">아직 발행된 글이 없습니다.</p>
          ) : (
            <>
              <FeaturedCard post={featured} />
              <MostReadPosts posts={mostRead} />
              {gridPosts.length > 0 && (
                // Fallback is the full unfiltered grid, so the prerendered HTML links every post.
                <Suspense
                  fallback={<CategoryGrid posts={gridPosts} active={null} />}
                >
                  <BlogCategoryFilter posts={gridPosts} />
                </Suspense>
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
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/5">
          <CoverImage
            src={post.cover}
            alt={post.title}
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div className="flex flex-col">
          <span className="inline-flex w-fit items-center px-3 py-1 rounded-md bg-black/5 text-black/70 text-xs font-medium tracking-wide mb-5">
            Featured
          </span>
          <h2 className="font-kopub heading-strong text-black text-2xl sm:text-3xl md:text-4xl leading-tight mb-5 whitespace-pre-line">
            {post.title}
          </h2>
          <p className="text-black/70 text-base sm:text-lg leading-relaxed mb-8 max-w-xl whitespace-pre-line">
            {post.excerpt}
          </p>
          <div className="flex items-center gap-3 text-black/55 text-xs uppercase tracking-widest mb-8">
            <span>{formatDate(post.date)}</span>
            <span aria-hidden>·</span>
            <span>{post.readingMinutes} min read</span>
            {post.author && (
              <>
                <span aria-hidden>·</span>
                <span>by {post.author}</span>
              </>
            )}
          </div>
          <span className="inline-flex w-fit items-center justify-center px-6 py-3 rounded-full font-kopub text-sm text-white bg-black group-hover:bg-black/85 transition-colors">
            Read more
          </span>
        </div>
      </article>
    </Link>
  );
}
