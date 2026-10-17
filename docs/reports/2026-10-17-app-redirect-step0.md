# /app redirect — Step 0 report (2026-10-17)

Read-only investigation before adding a device-aware download redirect at `malmijal.kr/app`.

## 1. Is `/app` already handled?

No.

- `app/` has no `app/` segment (existing: `blog`, `download`, `privacy`, `support`, `terms`, `feed.xml`, `robots.ts`, `sitemap.ts`, root `page.tsx`/`layout.tsx`).
- `public/` has no `app` file or folder (`assets`, `badges`, `blog`, `fonts`, `og`).
- `next.config.ts` has `redirects()` only, no rewrites:
  - host redirects `www.malmijal.kr` / `malmijal-web-v2.vercel.app` → `https://malmijal.kr/:path*` (permanent). This keeps the original path, so `www.malmijal.kr/app` → `malmijal.kr/app` and then lands on the new route. No conflict.
  - archived `/blog/<slug>` redirects. These don't touch `/app`.
- No `vercel.json` / `vercel.ts`.
- Grep for `"/app"` across `app/`, `components/`, `lib/` finds only asset paths (`/assets/logo/app-icon.png`, `/assets/download/app-*.png`), no route references.

## 2. Middleware

None. There is no `middleware.ts|js` or `proxy.ts|js` at the root, and there is no `src/` directory. Nothing would intercept `/app`.

## 3. Store URL definitions

The URLs are hard-coded in four places, and no shared constants module exists:

| File | App Store | Google Play |
|---|---|---|
| `app/download/page.tsx:9-12` | `IOS_URL` (module-local const) | `ANDROID_URL` … `&hl=ko` |
| `app/download/preview/download-design.tsx:10,16` | inline in `stores` array | inline, `&hl=ko` |
| `components/hero.tsx:32,46` | inline `href` | inline, **no `hl=ko`** |
| `components/footer.tsx:9,23` | inline `href` | inline, **no `hl=ko`** |

`/download`'s constants aren't exported, and a Next.js `page.tsx` can't export arbitrary names without failing the build's type check. Reusing them would mean editing `page.tsx`, and Step 1's scope forbids that.

**Assessment: no refactor needed.** The new route can import from a new `lib/store-links.ts`, which Step 1 explicitly allows because no shared constants file exists yet. Existing callers stay as they are. Moving all four call sites onto the shared module is optional follow-up work, and so is making `hl=ko` consistent in hero/footer. This task doesn't depend on either.

## 4. Sitemap

`app/sitemap.ts` builds the list by hand: three static routes (`/`, `/blog`, `/download`), blog posts from `getAllPostMeta()`, and the legal slugs (`privacy`, `terms`, `support`). It doesn't scan the file system, so a new `app/app/route.ts` **will not appear** in the sitemap. No exclusion change is needed. `robots.ts` allows `/`. `/app` sends `X-Robots-Tag: noindex` on its own response.

## Verdict

None of the stop conditions applies. Proceeding to Step 1:

- new `lib/store-links.ts` (shared constants, App Store + Play with `hl=ko`, the same values as `/download`)
- new `app/app/route.ts`
