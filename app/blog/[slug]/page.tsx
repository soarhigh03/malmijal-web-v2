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
      <main className="bg-[#070b1c] min-h-screen pb-32 pt-24 sm:pt-32">
        <article className="mx-auto max-w-3xl px-5 sm:px-8">
          <Link
            href="/blog"
            className="inline-block text-cloud-white/55 hover:text-cloud-white text-sm mb-10 transition-colors"
          >
            ← Blog
          </Link>

          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-widest text-cloud-white/55 mb-6">
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

          <h1 className="text-cloud-white text-3xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-12 sm:mb-14">
            {post.title}
          </h1>

          <div
            className="prose-blog text-cloud-white/85"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />
        </article>
      </main>
      <Footer />
    </>
  );
}
