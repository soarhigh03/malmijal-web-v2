# Blog index categories + 많이 읽은 글. — final report

Date: 2026-10-22
Branch: `feat/blog-categories`
PR: https://github.com/soarhigh03/malmijal-web-v2/pull/4 (**not merged**)
Step 0 audit: `docs/reports/2026-10-22-blog-categories-step0.md`

## Vercel

`gh pr checks 4 --watch` shows two passing checks:

```
Vercel Preview Comments	pass	0	https://vercel.com/github
Vercel – malmijal-web-v2	pass	0	https://vercel.com/soarhigh03s-projects/malmijal-web-v2/29CLLJmkbQ9h33z8N3ZxjhKimELX	Deployment has completed
```

Preview URLs:

- Branch: https://malmijal-web-v2-git-feat-blog-categories-soarhigh03s-projects.vercel.app/blog
- Deployment: https://malmijal-web-v2-4bmq2yr9t-soarhigh03s-projects.vercel.app/blog

An anonymous `curl` returns `302`. This looks like Vercel Deployment Protection, so open the URLs while logged in to Vercel. I didn't try to bypass it.

## What changed

| file | change |
|---|---|
| `lib/blog-categories.ts` (new) | 5 keys → labels in display order, `전체` label, `isBlogCategory`, `categoryLabel`, `MOST_READ_SLUGS`. Single source for labels; no Node APIs, so it's client-safe. |
| `lib/blog.ts` | `PostMeta.category`. `buildMeta()` throws on a missing or unknown category. New `getMostReadPosts()` throws on an unknown slug. **`getAllPostMeta()` sort is unchanged.** |
| `content/blog/*.md` (26) | One `category: <key>` line after `date:`, per the mapping. No other content edits. |
| `content/blog/TEMPLATE.md` | `category:` with a comment listing the allowed keys and labels. |
| `components/blog-index.tsx` (new) | `CoverImage` (moved), `GalleryCard` (moved; badge `News` → category label; date label precomputed on the server), `CategoryTabs`, `CategoryGrid` (filters and sorts date desc, then `title.localeCompare(…, 'ko')`), `MostReadPosts`. |
| `components/blog-category-filter.tsx` (new, client) | Reads `useSearchParams().get("category")`. An unknown or missing value falls back to 전체. |
| `app/blog/page.tsx` | Order: H1 → Featured (unchanged) → 많이 읽은 글. → `<Suspense fallback={full grid}>` tabs + grid. The featured post stays excluded from the grid. |

Not changed:

- post page, related posts, homepage `PopularPosts` (its 3 posts and output)
- sitemap code, RSS, redirects, `_archive-pre-seo/`
- JSON-LD: there was no `articleSection`, and none was added

Notes:

- **Heading:** "많이 읽은 글." (with period) matches the homepage. I didn't reuse the homepage component: it's hard-coded to its own 3-item list and uses a full-width gray section, so reusing it would have meant modifying it.
- **Most-read layout:** rank (01–04) + category badge + title + date. 2 columns below `lg`, 4 columns at `lg`+.
- **Tabs:** underline style; links to `/blog?category=<key>` with `scroll={false}`; 전체 links to `/blog`; `aria-current="page"` on the active tab. On mobile the tab row scrolls horizontally, and its scroll area extends to a 16px gutter from the screen edge.
- **No lint:** the repo has no lint script. As agreed, I used `npx tsc --noEmit` + the type check inside `next build`, and didn't add ESLint.

## Verification

### Type check and build

- `npx tsc --noEmit`: no errors.
- `npm run build`: success. `/blog` is still static:
  ```
  ├ ○ /blog                                        3.4 kB         115 kB
  ```

### Build-time validation (temporarily broke a file, ran `npm run build`, then restored it)

| case | result |
|---|---|
| remove `category` from `presentation-order.md` | exit 1, `[blog] content/blog/presentation-order.md: missing category. Allowed: interview-meeting, presentation, structure, delivery, practice` |
| `category: xyz` | exit 1, `[blog] content/blog/presentation-order.md: unknown category "xyz". Allowed: …` |
| `"no-such-post"` in `MOST_READ_SLUGS` | exit 1, `[blog] MOST_READ_SLUGS: no post found for "no-such-post" (lib/blog-categories.ts)` |

### Sitemap vs Step 0 snapshot

Ignoring only the 3 build-time `<lastmod>` values:

```
$ diff <(sed -E 's#<lastmod>2026-10-22T[0-9:.]+Z</lastmod>#<lastmod>BUILD_TIME</lastmod>#' docs/reports/2026-10-22-blog-categories-sitemap-before.xml) \
       <(sed -E 's#<lastmod>2026-10-22T[0-9:.]+Z</lastmod>#<lastmod>BUILD_TIME</lastmod>#' .next/server/app/sitemap.xml.body) \
  && echo "SITEMAP IDENTICAL (excluding build-time lastmod)"
SITEMAP IDENTICAL (excluding build-time lastmod)
```

The pattern replaced exactly 3 lines in the new sitemap. The raw diff shows only lines 5, 11 and 17 (`/`, `/blog`, `/download`):

```
$ diff docs/reports/2026-10-22-blog-categories-sitemap-before.xml .next/server/app/sitemap.xml.body
5c5
< <lastmod>2026-10-22T10:02:25.401Z</lastmod>
---
> <lastmod>2026-10-22T10:07:16.865Z</lastmod>
11c11
< <lastmod>2026-10-22T10:02:25.401Z</lastmod>
---
> <lastmod>2026-10-22T10:07:16.865Z</lastmod>
17c17
< <lastmod>2026-10-22T10:02:25.401Z</lastmod>
---
> <lastmod>2026-10-22T10:07:16.865Z</lastmod>
```

### Built `/blog` HTML (`.next/server/app/blog.html`)

- Has an `href="/blog/<slug>"` for every one of the 26 mapped slugs.
- "News" count: 0 (it was 50 before).
- Canonical: `<link rel="canonical" href="https://malmijal.kr/blog"/>`.
- Has the `BAILOUT_TO_CLIENT_SIDE_RENDERING` marker for the filter. The Suspense fallback (the full grid) is what's prerendered.

### Local production server (`next start`)

- `/blog/<slug>`: 26/26 return 200. Archived redirects still work, e.g. `/blog/filler-words-reduce` → 308 → `/blog/how-to-practice-speaking-alone`.
- `/blog?category=presentation` canonical: `https://malmijal.kr/blog`. Response headers are `x-nextjs-prerender: 1` and `x-nextjs-cache: HIT`.
- Grid counts after hydration, from headless Chrome:

| URL | grid cards | active tab | "News" |
|---|---|---|---|
| `/blog` | 25 | 전체 | 0 |
| `?category=interview-meeting` | 6 | 면접·회의 | 0 |
| `?category=presentation` | 7 | 발표 | 0 |
| `?category=structure` | 3 | 두괄식·논리 | 0 |
| `?category=delivery` | 5 | 말끝·목소리 | 0 |
| `?category=practice` | 4 (methodology is Featured, excluded as agreed) | 연습법·도구 | 0 |
| `?category=xyz` | 25 | 전체 | 0 |

- Sort check (발표): the three 2026-10-07 posts are ordered by `localeCompare('ko')`: 20분 발표 구성… → 5분 발표 대본… → 발표 시간 초과할 때…. "20분" sorts before "5분" because this is a string comparison, as specified.
- Client navigation, via Chrome DevTools at 1280:
  - Clicking 두괄식·논리 gives `?category=structure` with 3 cards. Scroll position is kept (1019 → 1019).
  - `history.back()` returns to `/blog` with 25 cards.

### Visual (375 / 1280)

| width | page `scrollWidth` | tab nav | most-read cols | grid cols |
|---|---|---|---|---|
| 375 | 375 (no horizontal scroll) | left 16, right 359; content 429 > 343, scrolls inside | 2 | 1 |
| 1280 | 1280 | 1200 wide, no overflow | 4 | 3 |

Screenshots are in `docs/reports/2026-10-22-blog-categories-screenshots/`:

- `blog-presentation-1280.png`: two covers are gray because their lazy-loaded images hadn't loaded at capture time.
- `blog-presentation-375.png`
- `most-read-tabs-375.png`

A faint white fade on the right edge of the mobile captures comes from the existing off-canvas mobile menu in `components/header.tsx`. It isn't from this change.
