import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { getPost, getAllPostMeta, formatDate } from "@/lib/blog";

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
    title: `${post.title} — 말미잘`,
    description: post.excerpt,
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

  return (
    <>
      <Header />
      <main className="bg-[#f0f0f0] min-h-screen pb-32 pt-32 sm:pt-40">
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

          <h1 className="font-kopub text-black text-3xl sm:text-4xl md:text-5xl leading-tight mb-12 sm:mb-14">
            {post.title}
          </h1>

          <div
            className="prose-blog"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
