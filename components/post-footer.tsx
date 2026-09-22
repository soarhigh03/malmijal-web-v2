import { TrackedLink } from "@/components/tracked-link";
import { BlogCtaBanner } from "@/components/blog-cta-banner";
import { getAllPostMeta, type PostMeta } from "@/lib/blog";
import type { Post } from "@/lib/blog";

function getRelatedPosts(current: Post, limit = 3): PostMeta[] {
  const all = getAllPostMeta().filter((p) => p.slug !== current.slug);
  const currentTags = new Set(current.tags ?? []);

  const scored = all.map((p) => {
    const shared = (p.tags ?? []).filter((t) => currentTags.has(t)).length;
    return { post: p, shared };
  });

  scored.sort((a, b) => {
    if (b.shared !== a.shared) return b.shared - a.shared;
    return b.post.date < a.post.date ? -1 : 1;
  });

  return scored.slice(0, limit).map((s) => s.post);
}

export function PostFooter({ post }: { post: Post }) {
  const related = getRelatedPosts(post);

  return (
    <div className="mt-16">
      <BlogCtaBanner slug={post.slug} />

      {related.length > 0 && (
        <div className="mt-12">
          <p className="font-kopub text-black/40 text-sm tracking-widest mb-6">
            관련 글
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {related.map((r) => (
              <TrackedLink
                key={r.slug}
                href={`/blog/${r.slug}`}
                fromSlug={post.slug}
                position="related"
                className="bg-white/60 backdrop-blur-sm rounded-2xl border border-black/5 p-5 block"
              >
                <p className="font-kopub text-black text-base leading-snug mb-2">
                  {r.title}
                </p>
                <p className="text-black/60 text-sm leading-relaxed line-clamp-2">
                  {r.excerpt}
                </p>
              </TrackedLink>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
