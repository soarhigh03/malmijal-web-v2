"use client";

import { useSearchParams } from "next/navigation";
import { isBlogCategory } from "@/lib/blog-categories";
import { CategoryGrid, type BlogCardPost } from "@/components/blog-index";

// Reads ?category= on the client so /blog stays statically prerendered.
// Unknown or missing values fall back to 전체.
export function BlogCategoryFilter({ posts }: { posts: BlogCardPost[] }) {
  const param = useSearchParams().get("category");
  return (
    <CategoryGrid posts={posts} active={isBlogCategory(param) ? param : null} />
  );
}
