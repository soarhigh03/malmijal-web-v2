import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { PostFooter } from "@/components/post-footer";
import { getPost, getAllPostMeta, formatDate } from "@/lib/blog";
import { absoluteUrl, siteName } from "@/lib/site";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getAllPostMeta().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Not found — 말미잘" };
  return {
    title: post.title,
    description: post.excerpt,
    alternates: {
      canonical: `/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      url: `/blog/${post.slug}`,
      siteName,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.date || undefined,
      authors: post.author ? [post.author] : undefined,
      images: post.cover ? [absoluteUrl(post.cover)] : undefined,
    },
    twitter: {
      card: post.cover ? "summary_large_image" : "summary",
      title: post.title,
      description: post.excerpt,
      images: post.cover ? [absoluteUrl(post.cover)] : undefined,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date || undefined,
    dateModified: post.date || undefined,
    author: post.author
      ? { "@type": "Person", name: post.author }
      : { "@type": "Organization", name: siteName },
    publisher: { "@type": "Organization", name: siteName },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    image: post.cover ? [absoluteUrl(post.cover)] : undefined,
  };

  return (
    <>
      <Script
        id={`blog-post-jsonld-${post.slug}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <Header />
      <main className="bg-canvas min-h-screen pb-32 pt-32 sm:pt-40">
        <article className="mx-auto max-w-3xl px-6 sm:px-10">
          <Link
            href="/blog"
            className="inline-block text-black/55 hover:text-black text-sm mb-10 transition-colors"
          >
            ← Blog
          </Link>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest text-black/55 mb-6">
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

          <h1 className="font-kopub text-black text-3xl sm:text-4xl md:text-5xl font-bold leading-[1.15] tracking-[-0.035em] mb-10 sm:mb-12 whitespace-pre-line">
            {post.title}
          </h1>

          {post.cover && (
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/5 mb-12 sm:mb-14">
              <Image
                src={post.cover}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          <PostFooter post={post} />
        </article>
      </main>
      <Footer />
    </>
  );
}
