// Single source for blog category keys, labels, and display order.
// Imported by both server code (lib/blog.ts) and client components, so keep it free of Node APIs.

export const BLOG_CATEGORIES = [
  { key: "interview-meeting", label: "면접·회의" },
  { key: "presentation", label: "발표" },
  { key: "structure", label: "두괄식·논리" },
  { key: "delivery", label: "말끝·목소리" },
  { key: "practice", label: "연습법·도구" },
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number]["key"];

export const ALL_CATEGORIES_LABEL = "전체";

export function isBlogCategory(value: unknown): value is BlogCategory {
  return BLOG_CATEGORIES.some((c) => c.key === value);
}

export function categoryLabel(key: BlogCategory): string {
  return BLOG_CATEGORIES.find((c) => c.key === key)!.label;
}

// Manually curated "많이 읽은 글." row on /blog, in display order.
export const MOST_READ_SLUGS = [
  "interview-top-down-answer-examples",
  "five-minute-presentation-script-example",
  "interview-answer-length",
  "sentence-ending-practice",
] as const;
