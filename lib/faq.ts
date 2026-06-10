import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

const FAQ_FILE = path.join(process.cwd(), "content/faq/faq.md");

export type FaqItem = {
  question: string;
  answerHtml: string;
};

export async function getFaqItems(): Promise<FaqItem[]> {
  if (!fs.existsSync(FAQ_FILE)) return [];

  const raw = fs.readFileSync(FAQ_FILE, "utf-8");
  const { content } = matter(raw);

  // Split on "## " headings. The first segment (before any heading) is ignored.
  const segments = content.split(/^##\s+/m);
  const items: FaqItem[] = [];

  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    const newlineIdx = segment.indexOf("\n");
    const question =
      newlineIdx === -1 ? segment.trim() : segment.slice(0, newlineIdx).trim();
    const body = newlineIdx === -1 ? "" : segment.slice(newlineIdx + 1).trim();
    if (!question) continue;

    const html = body
      ? String(await remark().use(remarkHtml).process(body))
      : "";
    items.push({ question, answerHtml: html });
  }

  return items;
}
