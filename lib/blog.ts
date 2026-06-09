import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const POSTS_DIR = path.join(process.cwd(), "content/blog");

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

function buildMeta(file: string): { meta: PostMeta; content: string } {
  const slug = file.replace(/\.md$/, "");
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf-8");
  const { data, content } = matter(raw);
  const meta: PostMeta = {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    date: typeof data.date === "string" ? data.date : "",
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    author: typeof data.author === "string" ? data.author : undefined,
    cover: typeof data.cover === "string" ? data.cover : undefined,
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
