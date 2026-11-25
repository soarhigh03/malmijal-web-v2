# 기관 도입 문의 (/business) — Step 0 audit (read-only)

Date: 2026-11-14 · Audited from working tree on `chore/blog-cta-remove-free-mentions` (PR #9, open). That branch differs from `main` only in blog copy, the post-footer CTA and TEMPLATE.md. Nothing in this audit depends on those changes, except the exact CTA paragraph text in §8. No files edited. This report is local only and is not committed.

**Status: STOPPED (stop condition 1).** The repo has no server-side Supabase setup and no service role env var name. The proposed names are in §2. Stop condition 2 does **not** apply (see §4).

---

## 1. Router and route handler patterns

- **App Router only** (`app/`). There is no `pages/` or `src/`. Next 15.1, React 19, Tailwind v4.
- **Existing route handlers:** `app/app/route.ts` (GET, QR redirect) and `app/feed.xml/route.ts`. There are no `app/api/*` routes and no POST handlers yet.
- **Server-side integration pattern:** `lib/toss.ts`. It starts with `import "server-only"`, reads a non-public secret (`process.env.TOSS_SECRET_KEY`), calls an external API with plain `fetch`, and returns a discriminated `{ ok: true … } | { ok: false … }` result. It is called from a server component (`app/pricing/success/page.tsx`). There are no Server Actions (`"use server"`) anywhere.
- **Proposal for Step 1d:** add a `POST` route handler at `app/api/business-inquiry/route.ts` (the spec's suggestion). It would call `lib/org-inquiry.ts` (`import "server-only"`), mirroring `lib/toss.ts`.

## 2. Supabase server-side and env var names ⛔

- **No Supabase anywhere in the repo:**
  - no `@supabase/*` dependency
  - no import
  - no `SUPABASE_*` reference in code
  - nothing in `.env.example`
- **Service role key referenced server-side today:** **no**.
- `.env.example` defines only `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`.
- **Env vars referenced in code** (names only):
  - `APPSTORE_PROVIDER_TOKEN`
  - `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
  - `NEXT_PUBLIC_TOSS_CLIENT_KEY`
  - `TOSS_SECRET_KEY`
  - `NEXT_PUBLIC_GA_MEASUREMENT_ID`
  - `NEXT_PUBLIC_SITE_URL`
  - `SITEMAP_URL` (script)
  - `NODE_ENV`
- **Vercel project env:** could not check. The local repo isn't linked (`vercel env ls` → "codebase isn't linked"), and I did not link it.

**Proposed env var names for 병호 to add in Vercel** (Preview and Production, server-only, **no `NEXT_PUBLIC_` prefix**):

| Name | Value |
|---|---|
| `SUPABASE_URL` | `https://vuzdabwmtljhmulkdryz.supabase.co` (project "말미잘 MVP") |
| `SUPABASE_SERVICE_ROLE_KEY` | service_role key (Supabase → Project Settings → API) |

These are the same names the Supabase/Vercel Marketplace integration sets, so they won't collide if the integration is connected later. I'll also add both names, with empty values, to `.env.example`.

**Client approach (decision for Step 1):**
- **(Recommended)** Use plain `fetch` to PostgREST: `POST {SUPABASE_URL}/rest/v1/org_inquiries` with `apikey` and `Authorization: Bearer <service role>`, plus `Prefer: return=minimal`. It adds no dependency and matches the `lib/toss.ts` pattern.
- **Alternative:** add `@supabase/supabase-js` and create the client with `auth: { persistSession: false }`.

Both use the service role key only on the server.

**Table check** (read-only query via the Supabase connector; no data read): `public.org_inquiries` matches the spec.

| Column | Type | Null | Default | Check |
|---|---|---|---|---|
| id | uuid | no | gen_random_uuid() | PK |
| created_at | timestamptz | no | now() | |
| org_name | text | no | | 1–100 chars |
| org_type | text | no | | university / academy / company / public / other |
| contact_name | text | no | | 1–50 chars |
| email | text | no | | ≤254 and `^[^@\s]+@[^@\s]+\.[^@\s]+$` (case-insensitive) |
| purpose | text | yes | | ≤2000 |
| source | text | yes | | ≤100 |
| consent_version | text | no | | |
| consented_at | timestamptz | no | | |

- RLS is on, with no policies. Grants exist only for `postgres` and `service_role`, with no anon or authenticated grants. This is as described.
- **Implementation notes:**
  - Use the same email regex as the DB check on both client and server.
  - Count length by code points (`[...s].length`) to match Postgres `char_length`. JS `.length` counts UTF-16 units.
  - Trim inputs before validating.

## 3. Email sending

None. There is no provider SDK (Resend, Nodemailer, SendGrid, Postmark, Mailgun, SES), no SMTP or mail env var, and no mail-sending code. The only email-related code is `mailto:` links and the Toss `customerEmail` field. **Per the spec, the Step 1d notification is skipped entirely.**

## 4. Header / nav: `components/header.tsx` (client component)

- **Where it's rendered:** `<Header />` and `<Footer />` are rendered per page, not in `app/layout.tsx`. They appear on `/`, `/blog`, `/blog/[slug]`, `/pricing`, `/pricing/success` and `/pricing/fail`. They do not appear on `/download` or the legal pages (those use `LegalDocument`). `/business` will render both itself, the same way `app/pricing/page.tsx` does.
- **Desktop (`md+`):** a flex `justify-between` row with three items:
  1. logo
  2. centered pill `<nav>` with HOME / ABOUT / FAQ / BLOG
  3. 다운로드 `<a>` (lines 190–195)

  다운로드 classes: `hidden md:inline-flex items-center justify-center px-6 py-3 rounded-full font-kopub text-sm text-white bg-black hover:bg-black/85 transition-colors`
- **Mobile menu:** yes. A hamburger toggle (`md:hidden`) opens a right-side drawer `<aside>` (lines 242–283). The drawer has the nav links stacked, plus a full-width 다운로드 pinned to the bottom with `mt-auto … w-full px-4 py-3.5 rounded-full … bg-black` (lines 275–281).
- **Secondary/outline button variant:** **none**. There is no shared Button component, and every button is inline Tailwind. The closest existing "outline" styles are the FAQ toggle circle (`border border-black/30`) and the `/download` gradient buttons, which are unrelated.
- **Stop condition 2 does not apply:** a new outline button can be added without touching 다운로드.
- **Step 1a plan:**
  - **Desktop:** wrap 다운로드 and the new link in `hidden md:flex items-center gap-3`. The new link gets the same box as 다운로드 (`px-6 py-3 rounded-full font-kopub text-sm`) with `bg-white text-black border border-current`. Its height and radius match 다운로드. To keep the heights equal, 다운로드 gets a transparent 1px border, or the outline button uses an inset ring. 다운로드's classes otherwise stay as they are. (Decision in §9.)
  - **Mobile:** add 기관 도입 문의 to the drawer, as an outline button above the bottom 다운로드. It is not placed next to 다운로드 in the top bar.

## 5. Footer: `components/footer.tsx`

The footer has:
- App Store and Google Play badges
- business info line: 에토세토라 | 대표자 | 사업자등록번호 | 전화 | `mailto:malmijal.team@gmail.com`
- address and © line
- **link list (lines 59–65):** 개인정보 처리방침 (`/privacy`, `font-medium`) | 이용약관 (`/terms`) | 고객지원 (`/support`), separated by `|` spans, using `next/link`
- Google Play trademark note

**Step 1b plan:** append `| 기관 도입 문의` → `/business?source=footer` to that link list, with the same classes as 이용약관 and 고객지원.

## 6. Reusable form styles

There are no shared form components. The only form is `app/pricing/checkout.tsx` (client), and its styles can be reused directly:

| Element | Classes |
|---|---|
| Label | `text-sm font-medium text-black/80` |
| Text input | `rounded-xl border border-black/15 px-4 py-3 text-base outline-none focus:border-black` |
| Checkbox/radio | `h-4 w-4 accent-black` |
| Error | `<p role="alert" className="text-sm text-red-600">` |
| Submit | `rounded-2xl bg-black px-6 py-4 text-base font-semibold text-white transition-opacity disabled:opacity-40` |
| Fine print | `text-xs sm:text-sm text-black/55 leading-relaxed` |
| Success box | `rounded-2xl bg-canvas px-6 py-8 text-center text-black/70` |

The page shell is in `app/pricing/page.tsx`:
- `<main className="bg-white min-h-screen pb-32 pt-32 sm:pt-40">` → `max-w-2xl px-6 sm:px-10`
- H1: `font-kopub text-black text-3xl sm:text-4xl font-bold leading-[1.2] tracking-[-0.035em]`
- Intro: `text-base sm:text-lg text-black/70 leading-relaxed`

The select and textarea will reuse the input classes. Indexable-page metadata follows `app/support/page.tsx`: `title: { absolute }`, description, robots index, `alternates.canonical`, and openGraph with `/og/og-default.png`.

For `source`, the page will read `searchParams` on the server (Next 15: async `searchParams` prop) and pass it to the client form. That keeps the page statically shaped, with no `useSearchParams` Suspense boundary. (`/pricing` is `noindex`; `/business` will be indexable.)

## 7. Sitemap: `app/sitemap.ts`

It is hand-built from three groups:
1. `staticRoutes` array: `/`, `/blog`, `/download`
2. blog posts from `getAllPostMeta()`
3. legal slugs: privacy, terms, support

**Step 1c plan:** add `{ url: absoluteUrl("/business"), lastModified: now, changeFrequency: "monthly", priority: 0.5 }` to `staticRoutes`. The priority value is my proposal.

`app/robots.ts` has no disallow rules that would affect `/business`. `scripts/check-sitemap.mjs` checks URLs generically and needs no change.

## 8. Candidate posts for the B2B line

These are all 8 posts with `category: admissions`, plus posts whose title or slug matches 스피치학원 / 스피치 학원 / academy. No slug contains "academy". 3 matched on title, with or without the space.

The B2B line would be inserted after the in-body CTA paragraph, which is the paragraph containing `(/download)`. In every candidate the next H2 is `## 자주 묻는 질문 (FAQ)`, so no post needs the "before FAQ" fallback.

| # | Slug | Title | Category | In-body CTA paragraph | FAQ H2 | Insert at |
|---|---|---|---|---|---|---|
| 1 | arts-sports-admission-interview | 예체능 입시 면접: 전공 동기와 작품·실기를 말로 설명하는 법 | admissions | L77 | L79 | after L77 |
| 2 | essay-prompt-interview-answer-structure | 제시문 면접 답변법: 준비 시간에 결론부터 정리하는 구조 | admissions | L74 | L76 | after L74 |
| 3 | help-your-child-practice-interview | 자녀 대입 면접 준비, 집에서 부모가 도와주는 법 | admissions | L67 | L69 | after L67 |
| 4 | interview-filler-words | 면접 답변에서 '음, 어' 줄이는 법: 군말 대신 쉼을 쓰세요 | admissions | L71 | L73 | after L71 |
| 5 | interview-nervous-fast-speech | 면접에서 긴장하면 말이 빨라질 때: 속도를 늦추는 연습법 | admissions | L72 | L74 | after L72 |
| 6 | medical-school-mmi-answer-structure | 의대 MMI 면접 준비: 상황·윤리 질문에 답하는 4단계 구조 | admissions | L86 | L88 | after L86 |
| 7 | university-interview-one-minute-answer | 입시 면접 1분 답변, 몇 글자일까? 내 말 속도로 분량 재는 법 | admissions | L71 | L73 | after L71 |
| 8 | university-interview-school-record-questions | 학생부종합 면접 준비: 생기부로 예상 질문 뽑고 1분 안에 답하는 법 | admissions | L94 | L96 | after L94 |
| 9 | speech-school-alternative-checklist | 스피치 학원 비용, 얼마나 들까? 3곳 상담 다녀와서 정리한 체크리스트 | practice | L81 | L83 | after L81 |
| 10 | speech-school-effect-checklist | 스피치학원 효과, 어떻게 확인할까? 등록 전후 비교할 5가지 | practice | L113 | L115 | after L113 |
| 11 | workplace-speech-school-guide | 직장인 스피치학원 고르는 법: 회의·보고·발표 목적별 선택 기준 | practice | L108 | L112 | after L108, before the closing paragraph at L110 |

**Notes:**
- `workplace-speech-school-guide` has one more paragraph between the CTA and the FAQ (L110: "앱의 기록과 수업 피드백을 참고하되, …"). "Directly after the CTA paragraph" puts the B2B line between L108 and L110.
- `speech-school-alternative-checklist` matches only with the space (스피치 학원). Approve whether 스피치 학원 counts.
- `speech-school-effect-checklist` and `workplace-speech-school-guide` are aimed at people choosing an academy as customers. Whether a "학교·학원·기관에서 함께 쓰고 싶다면" line fits them is an editorial call.
- **Branch dependency:** PR #9 edits the CTA paragraph in all 11 of these posts. The B2B line is a new paragraph, not an edit to the CTA line, so it won't conflict as long as the new branch is cut from `main` *after* PR #9 merges. Otherwise both PRs touch adjacent lines. **Recommendation: merge PR #9 first.**

## 9. Decisions needed before Step 1

1. **Env vars:** 병호 adds `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` (server-only) in Vercel for Preview and Production, or names different ones.
2. **Supabase client:** plain `fetch` to PostgREST (recommended, no new dependency) or `@supabase/supabase-js`.
3. **B2B posts:** approve all 11, or a subset.
4. **Branch order:** merge PR #9 before Step 1, or branch from current `main` and accept a possible rebase.
5. **Outline button height:** it has a 1px border and 다운로드 doesn't, so they'd differ by 2px. Either give the outline button `ring-1 ring-inset ring-current` (no layout change, 다운로드 untouched), or use a real `border` and accept the 2px difference. Recommendation: the inset ring. The spec says "1px border", and visually it reads the same.

---

## Step 0 / Step 1 log (2026-11-14)

**Step 0 (pre-flight): passed**
- `git fetch`: PR #9 is merged (`968e8aa`, 2026-11-14 07:05Z). Local `main` = `origin/main`.
- Header, drawer, footer link list, pricing form/layout, `app/sitemap.ts`, `lib/toss.ts` match §4–§7. There is still no `app/api`.
- The 8 admissions posts: CTA paragraph and FAQ H2 line numbers match §8 exactly, with a blank line between them in every post.

**Step 1: branch `feat/business-inquiry`**
- a. Header: on desktop, a 기관 도입 문의 outline button (`shadow-[inset_0_0_0_1px_currentColor]`, same `px-6 py-3 rounded-full font-kopub text-sm` as 다운로드) sits left of 다운로드 inside a new `hidden md:flex gap-3` wrapper. In the drawer it sits above 다운로드 inside a `mt-auto flex-col gap-3` wrapper. The 다운로드 classes are unchanged in both places. Measured: both buttons are 44px tall on desktop and 52px in the drawer.
  - **Extra change:** the nav pill's gap is `gap-10` → `gap-5` at md only (`lg:gap-14` unchanged). At 768px in the scrolled state, the wider right-hand group pushed the row ~35px past the content edge. After the change it fits exactly at 768/900/1024/1280.
- b. Footer: `| 기관 도입 문의` → `/business?source=footer`, with the same classes as 이용약관/고객지원.
- c. `/business` page plus `app/business/inquiry-form.tsx`, using the pricing layout and form classes. The meta description reuses the intro copy. The 기관 유형 select has a blank, disabled placeholder option, so no new copy was added. `source` is read server-side and `renderedAt` is server time, so there is no client clock skew. Added to `staticRoutes` in the sitemap with priority 0.5.
- d. Files:
  - `lib/org-inquiry-fields.ts`: shared rules (code-point lengths, the DB's email regex).
  - `lib/org-inquiry.ts`: server-only. It handles the honeypot and the 3 s check, re-validates, and does the PostgREST insert. The Bearer header is sent only when the key starts with `eyJ`. Logs contain only the HTTP status and PostgREST error code.
  - `app/api/business-inquiry/route.ts`: 20 KB body cap. Responses are `{ok}` only, with status 200/400/413/500.
  - `.env.example`: both names, no values.
- e. The B2B line was added after the CTA paragraph in the 8 admissions posts (+2 lines each). No other changes.
- Local verification (no Supabase env locally, so nothing was written):
  - honeypot, <3 s, or no timestamp → `{ok:true}`
  - no consent, bad email, bad org_type, or bad JSON → 400
  - valid submission → 500, logging "not set"
  - Client-side, an empty submit shows 5× 필수 message and a bad email shows the format message.
- `npm run build` passes. `seo:check` fails only for `https://malmijal.kr/business` (404 on production until deploy). This is expected.
