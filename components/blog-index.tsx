import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/blog";
import {
  ALL_CATEGORIES_LABEL,
  BLOG_CATEGORIES,
  categoryLabel,
  type BlogCategory,
} from "@/lib/blog-categories";

// Rendered by both the server (Suspense fallback) and the client filter, so the
// date label is formatted once on the server to avoid timezone hydration drift.
export type BlogCardPost = PostMeta & { dateLabel: string };

export function CoverImage({
  src,
  alt,
  priority,
  sizes,
}: {
  src?: string;
  alt: string;
  priority?: boolean;
  sizes: string;
}) {
  if (src) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-cover"
      />
    );
  }
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-black/[0.06] via-black/[0.04] to-black/[0.08] flex items-center justify-center">
      <span className="font-kopub text-black/15 text-3xl tracking-widest">
        말미잘
      </span>
    </div>
  );
}

function GalleryCard({ post }: { post: BlogCardPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex flex-col h-full">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-black/5 mb-5">
          <CoverImage
            src={post.cover}
            alt={post.title}
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-md bg-black/5 text-black/70 text-[11px] font-medium tracking-wide mb-3">
          {categoryLabel(post.category)}
        </span>
        <h3 className="font-kopub heading-strong text-black text-lg sm:text-xl leading-snug mb-2 group-hover:text-black/80 transition-colors whitespace-pre-line">
          {post.title}
        </h3>
        <p className="text-black/65 text-sm leading-relaxed mb-4 line-clamp-3 whitespace-pre-line">
          {post.excerpt}
        </p>
        <div className="mt-auto flex items-center gap-2 text-black/45 text-[11px] uppercase tracking-widest">
          <span>{post.dateLabel}</span>
          <span aria-hidden>·</span>
          <span>{post.readingMinutes} min</span>
        </div>
      </article>
    </Link>
  );
}

function CategoryTabs({ active }: { active: BlogCategory | null }) {
  const tabs = [
    { key: null, label: ALL_CATEGORIES_LABEL, href: "/blog" },
    ...BLOG_CATEGORIES.map((c) => ({
      key: c.key,
      label: c.label,
      href: `/blog?category=${c.key}`,
    })),
  ];

  return (
    // -mx-2/px-2 widens the scroll area so it clips 16px from the screen edge on mobile.
    <nav
      aria-label="카테고리"
      className="-mx-2 px-2 sm:mx-0 sm:px-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max min-w-full gap-6 sm:gap-8 border-b border-black/10">
        {tabs.map((tab) => {
          const isActive = tab.key === active;
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                scroll={false}
                aria-current={isActive ? "page" : undefined}
                className={`-mb-px block whitespace-nowrap border-b-2 pb-3 text-sm sm:text-base transition-colors ${
                  isActive
                    ? "border-black text-black font-medium"
                    : "border-transparent text-black/50 hover:text-black"
                }`}
              >
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

function sortForGrid(posts: BlogCardPost[]): BlogCardPost[] {
  return [...posts].sort((a, b) => {
    if (a.date !== b.date) return a.date < b.date ? 1 : -1;
    return a.title.localeCompare(b.title, "ko");
  });
}

export function CategoryGrid({
  posts,
  active,
}: {
  posts: BlogCardPost[];
  active: BlogCategory | null;
}) {
  const visible = sortForGrid(
    active ? posts.filter((p) => p.category === active) : posts,
  );

  return (
    <section className="mt-16 sm:mt-20">
      <CategoryTabs active={active} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8 sm:mt-10">
        {visible.map((post) => (
          <GalleryCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

export function MostReadPosts({ posts }: { posts: BlogCardPost[] }) {
  return (
    <section className="mt-16 sm:mt-20">
      <h2 className="font-kopub text-black text-2xl sm:text-3xl leading-tight mb-6 sm:mb-8">
        많이 읽은 글.
      </h2>
      <ol className="grid grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-8">
        {posts.map((post, i) => (
          <li key={post.slug} className="border-t border-black/10 pt-4">
            <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
              <div className="flex items-center gap-2 mb-3">
                <span className="font-kopub text-black/30 text-lg leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-md bg-black/5 text-black/70 text-[11px] font-medium tracking-wide">
                  {categoryLabel(post.category)}
                </span>
              </div>
              <p className="font-kopub text-black text-sm sm:text-base leading-snug mb-3 line-clamp-3 whitespace-pre-line group-hover:text-black/70 transition-colors">
                {post.title}
              </p>
              <span className="mt-auto text-black/45 text-[11px] uppercase tracking-widest">
                {post.dateLabel}
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
