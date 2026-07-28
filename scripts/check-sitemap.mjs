const canonicalOrigin = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://malmijal.kr"
).replace(/\/+$/, "");
const sitemapUrl =
  process.env.SITEMAP_URL || `${canonicalOrigin}/sitemap.xml`;

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function comparableUrl(value) {
  const url = new URL(value);
  return `${url.origin}${url.pathname === "/" ? "" : url.pathname}${url.search}`;
}

function followsCanonicalFormat(value) {
  const url = new URL(value);
  return (
    url.origin === canonicalOrigin &&
    url.protocol === "https:" &&
    !url.search &&
    !url.hash &&
    (url.pathname === "/" || !url.pathname.endsWith("/"))
  );
}

function extractCanonical(html) {
  const linkTags = html.match(/<link\b[^>]*>/gi) || [];

  for (const tag of linkTags) {
    const rel = tag.match(/\brel=["']([^"']+)["']/i)?.[1];
    if (!rel?.split(/\s+/).includes("canonical")) continue;
    return tag.match(/\bhref=["']([^"']+)["']/i)?.[1] || "";
  }

  return "";
}

async function inspectUrl(startUrl) {
  const redirectChain = [];
  let currentUrl = startUrl;
  let initialStatus = 0;

  for (let hop = 0; hop < 10; hop += 1) {
    const response = await fetch(currentUrl, {
      redirect: "manual",
      headers: { "user-agent": "malmijal-sitemap-check/1.0" },
    });

    if (hop === 0) initialStatus = response.status;

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) {
        return {
          initialStatus,
          redirectChain,
          finalUrl: currentUrl,
          finalStatus: response.status,
          canonical: "",
        };
      }

      const nextUrl = new URL(location, currentUrl).toString();
      redirectChain.push(nextUrl);
      currentUrl = nextUrl;
      continue;
    }

    const contentType = response.headers.get("content-type") || "";
    const body = contentType.includes("text/html") ? await response.text() : "";

    return {
      initialStatus,
      redirectChain,
      finalUrl: currentUrl,
      finalStatus: response.status,
      canonical: extractCanonical(body),
    };
  }

  throw new Error(`Too many redirects: ${startUrl}`);
}

const sitemapResponse = await fetch(sitemapUrl, {
  headers: { "user-agent": "malmijal-sitemap-check/1.0" },
});

if (!sitemapResponse.ok) {
  throw new Error(
    `Sitemap request failed: ${sitemapResponse.status} ${sitemapUrl}`,
  );
}

const sitemapXml = await sitemapResponse.text();
const urls = [...sitemapXml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)].map((match) =>
  decodeXml(match[1].trim()),
);

if (urls.length === 0) {
  throw new Error(`No <loc> entries found in ${sitemapUrl}`);
}

const checks = await Promise.all(
  urls.map(async (url) => {
    const result = await inspectUrl(url);
    const expectedCanonical = url;
    const finalMatchesExpected =
      comparableUrl(result.finalUrl) === comparableUrl(expectedCanonical);
    const canonicalMatchesExpected =
      result.canonical &&
      comparableUrl(result.canonical) === comparableUrl(expectedCanonical);
    const formatMatches =
      followsCanonicalFormat(expectedCanonical) &&
      followsCanonicalFormat(result.finalUrl) &&
      (!result.canonical || followsCanonicalFormat(result.canonical));

    return {
      url,
      expectedCanonical,
      initialStatus: result.initialStatus,
      redirects: result.redirectChain.length > 0 ? "yes" : "no",
      finalDestination: result.finalUrl,
      finalStatus: result.finalStatus,
      pageCanonical: result.canonical || "(missing)",
      finalMatchesExpected,
      canonicalMatchesExpected: Boolean(canonicalMatchesExpected),
      canonicalFormat: formatMatches,
    };
  }),
);

console.table(checks);

const failures = checks.filter(
  (check) =>
    check.initialStatus !== 200 ||
    check.redirects !== "no" ||
    check.finalStatus !== 200 ||
    !check.finalMatchesExpected ||
    !check.canonicalMatchesExpected ||
    !check.canonicalFormat,
);

if (failures.length > 0) {
  console.error(`SEO check failed for ${failures.length} sitemap URL(s).`);
  process.exitCode = 1;
} else {
  console.log(
    `SEO check passed: ${checks.length} sitemap URL(s) return 200 without redirects and use matching self-canonicals.`,
  );
}
