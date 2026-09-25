import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";

export async function markdownToHtml(content: string): Promise<string> {
  const raw_html = String(
    await remark().use(remarkGfm, { singleTilde: false }).use(remarkHtml).process(content),
  );
  return raw_html.replace(
    /<table>/g,
    '<div class="table-wrap"><table>',
  ).replace(/<\/table>/g, "</table></div>");
}
