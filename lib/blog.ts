import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const POSTS_DIR = path.join(process.cwd(), "content/blog");
const PUBLIC_DIR = path.join(process.cwd(), "public");
const COVER_EXTENSIONS = ["png", "jpg", "jpeg", "webp"] as const;

export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  author?: string;
  cover?: string;
  tags?: string[];
  readingMinutes: number;
};

export type Post = PostMeta & {
  html: string;
};

function readingMinutes(text: string): number {
  const chars = text.replace(/\s/g, "").length;
  return Math.max(1, Math.round(chars / 450));
}

function isPostFile(name: string): boolean {
  return (
    name.endsWith(".md") &&
    !name.startsWith("_") &&
    name.toLowerCase() !== "template.md"
  );
}

function postFiles(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR).filter(isPostFile);
}

function publicAssetExists(src: string): boolean {
  const pathname = src.split(/[?#]/)[0].replace(/^\/+/, "");
  const fullPath = path.resolve(PUBLIC_DIR, pathname);
  const relativePath = path.relative(PUBLIC_DIR, fullPath);

  if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
    return false;
  }

  try {
    return fs.statSync(fullPath).isFile();
  } catch {
    return false;
  }
}

function resolveSlugCover(slug: string): string | undefined {
  for (const extension of COVER_EXTENSIONS) {
    const src = `/blog/covers/${slug}.${extension}`;
    if (publicAssetExists(src)) return src;
  }

  return undefined;
}

function resolveCover(cover: unknown, slug: string): string | undefined {
  if (typeof cover !== "string") return resolveSlugCover(slug);

  const src = cover.trim();
  if (!src) return resolveSlugCover(slug);
  if (/^https?:\/\//i.test(src)) return src;

  return publicAssetExists(src) ? src : resolveSlugCover(slug);
}

function buildMeta(file: string): { meta: PostMeta; content: string } {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
  const { data, content } = matter(raw);
  const meta: PostMeta = {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    date:
      typeof data.date === "string"
        ? data.date
        : data.date instanceof Date
          ? data.date.toISOString()
          : "",
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    author: typeof data.author === "string" ? data.author : undefined,
    cover: resolveCover(data.cover, slug),
    tags: Array.isArray(data.tags) ? data.tags : undefined,
    readingMinutes: readingMinutes(content),
  };
  return { meta, content };
}

export function getAllPostMeta(): PostMeta[] {
  return postFiles()
    .map((f) => buildMeta(f).meta)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export async function getPost(slug: string): Promise<Post | null> {
  const file = `${slug}.md`;
  if (!isPostFile(file)) return null;
  const full = path.join(POSTS_DIR, file);
  if (!fs.existsSync(full)) return null;
  const { meta, content } = buildMeta(file);
  const html = String(await remark().use(remarkHtml).process(content));
  return { ...meta, html };
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}.${m}.${d}`;
}
