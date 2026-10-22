# Blog categories — Step 0 audit (read-only)

Date: 2026-10-22
Result: **no STOP conditions found.** Waiting for approval before implementing.

## 1. Repo state

- Branch at audit time: `main` (clean, `git status -s` printed nothing). HEAD is `0791862`.
- Next.js: `15.5.19` (package.json `^15.1.6`), React 19, Tailwind v4.
- `/blog` index: `app/blog/page.tsx` (server component; `FeaturedCard`, `GalleryCard`, and `CoverImage` are defined in the same file).
- `/blog/[slug]`: `app/blog/[slug]/page.tsx`, plus `components/blog-article.tsx` and `components/post-footer.tsx` (related posts).
- Loader: `lib/blog.ts`.
- **Lint:** the repo has **no `lint` script** in package.json and no ESLint config or dependency, so `npm run lint` fails with "Missing script". `next build` prints "Linting and checking validity of types" but only type-checks. **Proposal:** for verification, run `npx tsc --noEmit` plus the type-check inside `next build`. Adding ESLint is out of scope unless you want it.
- No `.github/workflows` and no local `.vercel` link. On the PR, `gh pr checks` will only show the Vercel GitHub integration check, if one is configured.

## 2. Frontmatter fields and parsing

`lib/blog.ts` → `buildMeta()` parses each file with `gray-matter`. Only top-level `content/blog/*.md` files are read, minus files starting with `_` and `TEMPLATE.md`. `_archive-pre-seo/` is a directory and is never read.

| field | posts using it (incl. TEMPLATE) | parsing |
|---|---|---|
| title | 27 | string, else slug |
| date | 27 | string or Date → ISO |
| excerpt | 27 | string |
| author | 27 | string |
| tags | 27 | array (used only for related posts in `post-footer.tsx`) |
| cover | 16 | validated path; falls back to `/blog/covers/<slug>.<ext>` |
| featured | 2 (`malmijal-index-methodology`, TEMPLATE) | `=== true` |
| lastModified | 3 | used by the sitemap |
| schema | 0 | `false` disables JSON-LD |

- **`category` exists nowhere** (no post, no TEMPLATE, no code).
- The slug comes from the **file name**, and URLs, canonicals, the sitemap, and RSS are all built from the slug. No URL is derived from any frontmatter field, so adding `category` touches none of them.

## 3. "News"

The only occurrence in `app/`, `components/`, `lib/`, `scripts/`, and `public/` is:

- `app/blog/page.tsx:187`: the badge is **hard-coded** in `GalleryCard` (index grid cards only).

It is not in:

- the post page (which has no badge)
- JSON-LD: `BlogPosting` has **no `articleSection`**, so per the spec nothing will be added
- RSS (`app/feed.xml/route.ts`)
- the sitemap
- OG/Twitter metadata
- any route path

The built `blog.html` has 50 matches: 25 cards × (HTML + RSC payload).

## 4. Featured

- Selection: posts with `featured: true`, newest by date first. Fallback: the newest post. Only `malmijal-index-methodology` has `featured: true`, so it stays on top.
- The featured post **is excluded** from the grid (`rest = posts.filter(p => p.slug !== featured.slug)`), so the grid has 25 cards. I will keep this behavior.
- Consequence for counts: under `?category=practice` the grid will show **4** cards, because the methodology post is featured and excluded. Under 전체 it shows 25. All other categories show their full mapping count (interview-meeting 6, presentation 7, structure 3, delivery 5).

## 5. Posts (26) vs mapping

The diff against the mapping is **identical**: 26 = 26, with no extras, no missing slugs, and no duplicates.

| slug | title | date |
|---|---|---|
| ai-speech-coach-meaning | AI 스피치 코치란? 사람 코치와 무엇이 다른지 정리했어요 | 2026-08-25 |
| answer-unexpected-questions-in-meetings | 회의에서 갑자기 질문받았을 때, 3문장으로 답하세요 | 2026-08-13 |
| conclusion-first-speaking | 결론부터 말하는 화법: 두괄식 예시와 4주 연습법 | 2026-09-02 |
| five-minute-presentation-script-example | 5분 발표 대본 예시: 도입부터 마무리까지 한 편으로 보기 | 2026-10-07 |
| how-to-practice-speaking-alone | 혼자서 하는 말하기 연습, 3단계 방법 | 2026-07-09 |
| how-to-speak-persuasively | 왜 내 말은 설득력이 없을까 | 2026-07-09 |
| how-to-speak-up-in-meetings | 회의에서 말 잘하는 법, 원인별 3가지 처방 | 2026-07-09 |
| interview-answer-length | 면접 답변 길이: 질문별 시간 기준과 짧게 줄이는 예시 | 2026-08-13 |
| interview-top-down-answer-examples | 두괄식 답변 예시: 면접·보고에서 결론부터 말하는 법 | 2026-08-25 |
| malmijal-index-methodology | 말미잘이 매긴 말하기 점수, 의심부터 하셔도 됩니다 | 2026-07-15 |
| one-minute-self-introduction | 1분 자기소개 만드는 법, 4블록 공식과 예시 | 2026-07-09 |
| presentation-order | 발표 순서 정하는 법, 3블록만 먼저 잡으세요 | 2026-08-13 |
| presentation-script-length | 5분·10분·15분·20분 발표 대본 분량: 글자 수 계산 예시 | 2026-08-13 |
| presentation-script-memorization | 발표 대본 외우는 법: 통암기 대신 블록 암기가 안전합니다 | 2026-08-13 |
| presentation-script-recovery | 발표 중 대본을 까먹었을 때, 되감지 말고 다음 블록으로 가세요 | 2026-08-13 |
| reduce-filler-words | “음, 어, 그…”를 줄이는 법, 군말 대신 침묵을 쓰세요 | 2026-08-13 |
| reduce-uncertain-endings | ‘것 같아요’ 말버릇 줄이기: 상황별 대체 표현과 예시 | 2026-10-07 |
| report-to-your-boss | 상사에게 보고할 때 핵심만 말하는 법, 30초 보고 공식 | 2026-08-13 |
| sentence-ending-practice | 말끝 안 흐리는 연습 문장 10개: 면접·보고에서 또렷하게 끝내기 | 2026-10-07 |
| shorten-presentation-script | 발표 시간 초과할 때 대본 줄이는 법: 수정 전후 예시 | 2026-10-07 |
| speech-app-selection | 스피치 앱 고르는 법, 설치 전에 확인할 5가지 | 2026-08-25 |
| speech-school-alternative-checklist | 스피치 학원 비용, 얼마나 들까? 3곳 상담 다녀와서 정리한 체크리스트 | 2026-08-25 |
| stop-trailing-off | 말끝 흐리는 습관 고치는 법: 원인 3가지와 마지막 5단어 연습 | 2026-08-13 |
| top-down-vs-bottom-up-meaning | 두괄식·미괄식 뜻과 차이: 결론은 언제 먼저 말해야 할까? | 2026-09-02 |
| twenty-minute-presentation-outline | 20분 발표 구성 예시: 시간 배분표와 중간 요약 넣는 법 | 2026-10-07 |
| voice-gets-quieter | 말할수록 목소리가 작아지는 이유, 문장 끝 성량부터 확인하세요 | 2026-08-13 |

## 6. /blog rendering and canonical

- `next build` output: `○ /blog  2.21 kB  113 kB` means static (prerendered). `/blog/[slug]` is SSG (26 paths), and `/sitemap.xml` is static.
- Canonical in the built `blog.html` is `<link rel="canonical" href="https://malmijal.kr/blog"/>`. It comes from `alternates.canonical: "/blog"` + `metadataBase`. Because the page is static, `?category=…` gets the same HTML and therefore the same canonical.
- The built HTML has 26 unique `/blog/<slug>` hrefs (all posts).

## 7. Sitemap

- `app/sitemap.ts` (Next metadata route) has 32 URLs:
  - 3 static routes (`/`, `/blog`, `/download`)
  - 26 posts, from `getAllPostMeta()`, in its order
  - 3 legal pages
- Snapshot: `docs/reports/2026-10-22-blog-categories-sitemap-before.xml`, copied from `.next/server/app/sitemap.xml.body`.
- **Caveat:** `/`, `/blog`, and `/download` use `lastModified: new Date()`, so their `<lastmod>` changes on every build. The before/after comparison will ignore those 3 build-time `<lastmod>` lines; everything else must be byte-identical.
- **Caveat:** post order in the sitemap, RSS, and related posts comes from `getAllPostMeta()` (date desc, ties in readdir order). To keep the sitemap identical, I **will not change `getAllPostMeta()`'s sort**. The new date-desc/title-asc (`ko`) ordering will be applied only inside the /blog index grid.

## Other observations (no action planned)

- The homepage already has `components/popular-posts.tsx` with the heading "많이 읽은 글." and a different hard-coded list of 3 posts. It is out of scope, so I'll leave it alone. The /blog row will have its own config list as specified.

## Implementation plan (after approval)

- `lib/blog-categories.ts` holds:
  - `BLOG_CATEGORIES`: ordered keys + labels
  - `isBlogCategory()`
  - `MOST_READ_SLUGS`
- `lib/blog.ts`:
  - add `category: BlogCategory` to `PostMeta`
  - `buildMeta()` throws `[blog] <file>: missing/unknown category "<v>"`
  - `getAllPostMeta()` asserts every `MOST_READ_SLUGS` entry exists
- Frontmatter: add a `category:` line to each of the 26 posts, plus a commented `category:` line in TEMPLATE.md.
- `app/blog/page.tsx` order: H1 → Featured → `MostRead` (server) → `<Suspense fallback={<CategoryGrid posts={rest} active={null} />}><BlogCategoryFilter posts={rest} /></Suspense>`. The client component reads `useSearchParams()`, renders underline tabs as `<Link href="?category=…" scroll={false}>`, and renders the filtered grid.
- `GalleryCard` badge → category label. `GalleryCard`/`CoverImage` move to a shared file so the client component can use them.
- Verification: `npx tsc --noEmit` (in place of lint), `next build`, sitemap diff, `next start` + curl checks, and screenshots at 375/1280.
