import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { markdownToHtml } from "./markdown";

const LEGAL_DIR = path.join(process.cwd(), "content/legal");

export type LegalSlug = "privacy" | "terms";

export type LegalMeta = {
  slug: LegalSlug;
  title: string;
  effectiveDate: string;
  updatedAt?: string;
};

export type LegalDoc = LegalMeta & {
  html: string;
};

function toDateString(value: unknown): string | undefined {
  if (typeof value === "string" && value) return value;
  if (value instanceof Date) return value.toISOString();
  return undefined;
}

function readLegalFile(slug: LegalSlug): { meta: LegalMeta; content: string } {
  const raw = fs.readFileSync(path.join(LEGAL_DIR, `${slug}.md`), "utf-8");
  const { data, content } = matter(raw);
  const effectiveDate = toDateString(data.effectiveDate);
  if (typeof data.title !== "string" || !effectiveDate) {
    throw new Error(`content/legal/${slug}.md: frontmatter needs title and effectiveDate`);
  }
  const meta: LegalMeta = {
    slug,
    title: data.title,
    effectiveDate,
    updatedAt: toDateString(data.updatedAt),
  };
  return { meta, content };
}

export function getLegalMeta(slug: LegalSlug): LegalMeta {
  return readLegalFile(slug).meta;
}

export async function getLegalDoc(slug: LegalSlug): Promise<LegalDoc> {
  const { meta, content } = readLegalFile(slug);
  const html = await markdownToHtml(content);
  return { ...meta, html };
}
