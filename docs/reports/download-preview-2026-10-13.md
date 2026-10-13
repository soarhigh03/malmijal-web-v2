# Malmijal download redesign comparison

Implemented two reviewable variants on 2026-10-13 (Asia/Seoul). Public `/download`, homepage, shared navigation/footer, global CSS, and sitemap remain unchanged. No push or deployment.

## Review

Run `npm run dev` or `npm run build && npm run start`, then open:

- A, restrained: <http://localhost:3000/download/preview?variant=a>
- B, expressive: <http://localhost:3000/download/preview?variant=b>
- Missing or invalid variant selects A.

The comparison navigation sits above the design, uses native full-page links, and identifies the selected variant with `aria-current`. Both variants share identical copy, images, store destinations, markup, and responsive layout. A has a neutral product area and a small coral accent. B adds a broad pale-blue product area, modest image depth, and a wider coral accent. Neither includes QR blocks, floating cards, extra device frames, score messaging, or platform detection/reordering.

## Files

| File | Purpose |
| --- | --- |
| `app/download/preview/page.tsx` | Query-based A/B selection, separate comparison controls, noindex/nofollow metadata and preview canonical |
| `app/download/preview/download-design.tsx` | Shared branded page, verified destinations, untracked store anchors, compact footer |
| `app/download/preview/preview.module.css` | Scoped app-derived tokens, theme overrides, desktop/mobile layout and keyboard focus |
| `lib/analytics.tsx` | Preview-path guards for scripts, delayed initialization, and event dispatch |
| `public/assets/download/daily-speaking-preview-003.png` | Unmodified supplied daily-speaking promotional image |
| `docs/reports/download-preview-screenshots/*.jpg` | Four production-rendered review captures |
| This report | Implementation and validation record |

No repository `AGENTS.md` or `claude/design.md`, `claude/decision-log.md`, `claude/open-items.md` was present. User-scope delegation instructions, `README.md`, `DESIGN.md`, and `FEATURES.md` were audited. The older Air style reference in `DESIGN.md` was superseded for this preview by the user's explicit app-brand values. The supplied PDF was read across all 19 pages and relevant color, typography, component, and product-screen pages were rendered for visual review. The [Wellspoken download reference](https://www.wellspoken.me/download) informed the concise headline/actions/footer structure.

## Assets and font

The supplied attachments arrived with clipboard filenames, rather than the KakaoTalk filenames mentioned in the request. All six were inspected. Mapping is recorded by actual attachment identity and visible content; unused images were not copied or modified.

| Attachment | Visible content | Use |
| --- | --- | --- |
| Image 1, `codex-clipboard-2501c5b4-6032-4752-a324-8d949315358c.png` | Analysis/radar and numeric score | Excluded |
| Image 2, `codex-clipboard-c0c6ca16-9465-4949-950f-eadb50470156.png` | Reading drill | Deferred |
| Image 3, `codex-clipboard-cce75b8b-a3ed-4ee0-8534-a13e50ffd566.png` | Three-sentence summary drill | Deferred |
| Image 4, `codex-clipboard-bd31fe34-ede4-4c11-a5f7-8fafeb56fecb.png` | Interview results with numeric scores | Excluded |
| Image 5, `codex-clipboard-e307b8b6-f5ff-410c-920c-fdbcafe4193a.png` | Daily speaking drill without score; matches requested 003 by content | Copied to `public/assets/download/daily-speaking-preview-003.png` |
| Image 6, `codex-clipboard-66d9cd42-1488-4b75-93a6-5f2f0c00e152.png` | Underwater brand/splash composition | Deferred |

The main image stays upright at its original 1242 x 2688 aspect ratio with all embedded content intact. Source and public copy have identical SHA-256: `fb19fead0f5a22e90772fdb81dc4003b11ddb63a3bf9f84f044af4f191225ccd`. Existing Next Image optimization, explicit dimensions, priority loading, and responsive sizes are used; no new image dependency. Official `/assets/logo/mijal_logo_v1.svg` is unchanged, with its original aspect ratio. Existing `/assets/store/apple.png` and `/assets/store/google-play.png` are reused.

No usable Asta Sans font or licensing information exists in the repository. The preview retains the site's existing Pretendard Variable/body stack, with system fallbacks; no font downloaded. Heading weight is 600, desktop size 52px at 1440px, mobile size 32px, with deliberate Korean phrase breaks. Supporting copy is 17px desktop / 16px mobile. Existing remote font loading remains a dependency of the site.

Stores and footer destinations match the existing public download page: App Store ID `6769989593`, Google Play package `com.malmijal.malmijal` with `hl=ko`, `/privacy`, `/terms`, and the existing Notion support URL.

## Validation

- Final `npm run build`: passed compilation, lint/type validation, and page generation. No test or lint scripts are separately defined. No dependencies added.
- `npm run seo:check`: passed for all 32 live production sitemap URLs (200, no redirects, matching canonicals). This existing check targets production; local preview was separately inspected.
- Local production HTTP checks: both variants and invalid-variant fallback return 200; general and Googlebot metadata both say noindex/nofollow; explicit canonical targets `/download/preview`. Local sitemap contains no preview route. `/download`, `/privacy`, and `/terms` return 200. No public navigation links were added.
- App Store, Google Play, and existing Notion support URLs returned HTTP 200 to HTTP HEAD requests. Rendered outbound hrefs match verified repository values. Native device installation was not exercised.
- Browser inspection: A and B at 1440 x 900 and 375 x 812. No horizontal overflow, clipping, failed images, or runtime errors. Product image is upright and clearly rendered. Both mobile store buttons finish by approximately y=461px, before the product image; logo, headline, support, free note, and buttons appear first.
- Keyboard: Shift+Tab from Google Play reaches App Store, with a visible 2px strong-text outline and 5px offset. Shared focus rule covers all links. Native A/B selection works and preserves identical content.
- Web text contrast against rendered `#F8F8FA`: strong 16.55:1, primary 11.87:1, secondary 5.07:1. Accent marks carry no essential text. Embedded promotional-image typography remains unchanged as requested. Large surfaces do not use backdrop blur.
- Analytics: browser preview loads contain no GA script/bootstrap. Isolated TypeScript/VM regression check with a fake GA ID confirmed exact/descendant preview guards, delayed-bootstrap suppression, and unchanged public initialization/conversion payloads without contacting Google. Preview anchors emit no `store_outbound_click` or `download_qr_landing`.
- Source audit confirms public download/homepage/navigation/footer/global CSS/sitemap are untouched. `git diff --check` passed. Report directory is not ignored, so force-add was unnecessary.

Analytics limitation: an already-loaded Google runtime cannot be unloaded by returning null. Client-router entry from a previously initialized public page could still trigger enhanced history pageviews. The intended direct review URLs and native full-page comparison links avoid that lifecycle; event dispatch is independently guarded. Real production analytics and native iOS/Android browsers were not exercised.

## Captures

Full-page JPEG captures use a 1440 x 900 desktop viewport (1440 x 912 document) and 375 x 812 mobile viewport (375 x 1322 document).

- [A desktop](download-preview-screenshots/a-desktop-1440.jpg)
- [B desktop](download-preview-screenshots/b-desktop-1440.jpg)
- [A mobile](download-preview-screenshots/a-mobile-375.jpg)
- [B mobile](download-preview-screenshots/b-mobile-375.jpg)
