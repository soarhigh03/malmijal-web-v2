export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://malmijal-web-v2.vercel.app"
).replace(/\/$/, "");

export const siteName = "말미잘";

export function absoluteUrl(path = ""): string {
  if (!path) return siteUrl;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  return `${siteUrl}${path.startsWith("/") ? path : `/${path}`}`;
}
