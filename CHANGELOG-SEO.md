# SEO Improvement Change Log — September 2026

## Baseline (August 23 – September 19, 2026)

Source: Google Search Console, Web search, all countries and devices.

| Metric | Site-level |
|---|---:|
| Impressions | 713 |
| Clicks | 17 |
| CTR | 2.38% |
| Avg. position | ~9.2 |

| Target URL | Impressions | Clicks | CTR | Avg. position |
|---|---:|---:|---:|---:|
| `/blog/presentation-script-length` | 202 | 1 | 0.50% | 8.92 |
| `/blog/interview-answer-length` | 118 | 3 | 2.54% | 10.54 |
| `/blog/interview-top-down-answer-examples` | 110 | 1 | 0.91% | 10.12 |

Page-level totals (732 impressions, 18 clicks) differ from site-level totals; do not sum page rows as site totals.

No historical web conversion baseline was available at time of implementation.

## Implementation date

2026-09-22 (local changes prepared; not yet deployed)

## Deployment date

_Not yet deployed._

## Edited URLs

All three URLs are preserved without slug changes:

- `/blog/presentation-script-length`
- `/blog/interview-answer-length`
- `/blog/interview-top-down-answer-examples`

## Changes

### A. Content — presentation-script-length (highest priority)

| | Before | After |
|---|---|---|
| **Title** | 5분·10분·15분·20분 발표 대본 분량 — 몇 자가 적당할까? | 5분·10분·15분·20분 발표 대본 분량: 글자 수 계산 예시 |
| **Meta description** | 발표 대본 분량, 숫자로 먼저 알려드릴게요. 5분은 약 1,100~1,400자입니다. … | 발표 시간별 대본 글자 수를 계산하는 방법과 예시표를 정리했어요. 5분 발표는 약 1,125~1,575자(공백 제외)이고, … |

- Replaced ambiguous range table with transparent hypothetical calculation table (T × 0.90 × R, R = 250/300/350).
- Added prominent disclosure: values are hypothetical calculation inputs, not measured averages or recommendations.
- Added worked example: 10 × 0.90 × 300 = 2,700 characters.
- Defined counting convention: non-whitespace script characters; excludes slide headings and stage directions.
- Added personalization method: time a representative excerpt, compute personal rate, rehearse with slides.
- Clarified that rehearsal-measured speed already includes transitions — do not double-reserve.
- Added new FAQ item about table values not matching personal speed.
- Added contextual CTA (first free analysis) after personalization section.
- Preserved all existing practical advice (time blocks, don't speed up, three rehearsals).

### B. Content — interview-answer-length

| | Before | After |
|---|---|---|
| **Title** | 면접 답변 길이, 몇 초가 적당할까? 질문별 기준 정리 | 면접 답변 길이: 질문별 시간 기준과 짧게 줄이는 예시 |
| **Meta description** | (updated to mention before/after trimming example) | … 연습을 시작하고, 줄이는 방법까지 예시로 정리했어요. |

- Clarified time ranges as rehearsal starting points, not hiring rules. Added: "면접관의 안내가 있다면 그 지시가 우선합니다."
- Added before/after example: same conflict-resolution question, showing what was cut (unnecessary background, filler phrases, post-conclusion rambling) and why.
- Added cross-link to top-down answer examples article in the "결론이 너무 늦게 나온다" section.
- Fixed tilde strikethrough rendering issue in existing content (double-asterisk escaping).
- Preserved all existing question-type guidance, examples, and FAQ.

### C. Content — interview-top-down-answer-examples

| | Before | After |
|---|---|---|
| **Title** | 두괄식 답변 예시 모음 — 면접부터 보고까지, 결론부터 말하는 법 | 두괄식 답변 예시: 면접·보고에서 결론부터 말하는 법 |
| **Meta description** | (updated to mention before/after comparison) | … 같은 답변을 미괄식과 두괄식으로 비교한 예시, … |

- Added before/after comparison near the beginning: same "강점" question answered in 미괄식 then 두괄식, with labeled structure (결론/이유/근거/결론).
- Updated cross-link to answer-length article to use new title.
- Preserved all existing interview examples, workplace examples, and FAQ.

### D. CTAs and download journey

- **PostFooter CTA**: Replaced "말미잘 무료로 시작하기" with "말미잘 첫 분석 무료" (one-analysis free offer, no ongoing-free implication).
- **Desktop QR code**: Added QR code in PostFooter (visible on sm+ breakpoints) pointing to `/download?from={slug}&entry=qr`. Destination URL shown as text below QR code.
- **Mobile store badges**: Added App Store and Google Play badge links in PostFooter (visible on mobile only). Links work without JavaScript/analytics.
- **In-article CTAs**: Each article has a contextual CTA linking to `/download` mentioning "첫 분석을 무료로". The BlogArticle component rewrites these links to include `?from={slug}` for journey tracking.

### E. Analytics events

| Event | Trigger | Properties |
|---|---|---|
| `blog_cta_click` | Click on a `/download` link within an article body or PostFooter | `article_slug`, `cta_placement` (body_inline \| post_footer), `destination_type` |
| `store_outbound_click` | Click on an App Store or Google Play link | `article_slug` (when available), `store` (ios \| android), `entry_method` (direct \| qr), `cta_placement` |
| `download_qr_landing` | Page load on `/download` with `entry=qr` param | `article_slug` (when available), `entry_method=qr` |
| `blog_internal_click` | _(existing, unchanged)_ Click on internal blog link | `from_slug`, `to_slug`, `position` |

- Renamed download page button event from `store_button_click` to `store_outbound_click` with richer properties.
- `article_slug` is validated against `^[a-z0-9]([a-z0-9-]{0,98}[a-z0-9])?$` before inclusion in events.
- `DownloadTracker` component fires `download_qr_landing` at most once per page load via ref guard.
- BlogArticle click handler uses capture phase to prevent duplicate event bubbling.
- All store links use plain `<a>` tags with `href`; navigation works without analytics.

### F. Infrastructure

- Added `lastModified` field to blog PostMeta type and frontmatter parsing.
- Sitemap uses `lastModified` when present, falling back to `date`.
- Updated PopularPosts component titles to match new article titles.

## Hypothetical calculation model

Used in the presentation-script-length article:

- T = total allotted presentation time (minutes)
- Reserve = 10% of T for transitions/non-speaking time (planning assumption)
- R = assumed script-delivery rate: 250, 300, or 350 non-whitespace characters per speaking minute
- **Formula: T × 0.90 × R**
- These are hypothetical inputs, not measured averages, ideal speeds, or scoring thresholds.

## GA4 custom-dimension setup required

The following event-scoped custom dimensions must be created in the GA4 property before event parameters appear in reports:

| Parameter name | Scope | Used by events |
|---|---|---|
| `article_slug` | Event | blog_cta_click, store_outbound_click, download_qr_landing |
| `cta_placement` | Event | blog_cta_click, store_outbound_click |
| `destination_type` | Event | blog_cta_click |
| `store` | Event | store_outbound_click |
| `entry_method` | Event | store_outbound_click, download_qr_landing |

Steps: GA4 Admin → Custom definitions → Create custom dimension → Enter the parameter name, select Event scope.

## Remaining manual steps

1. **Deploy** the changes to production (not done by this implementation).
2. **Create GA4 custom dimensions** listed above in the GA4 property settings.
3. **Verify GA4 measurement ID** is set via `NEXT_PUBLIC_GA_MEASUREMENT_ID` environment variable in production.
4. **Record deployment date** in this file once deployed.
5. **Post-release evaluation**: After 28 full days in production, compare GSC metrics for the three URLs against the baseline above. Record export dates and partial days.

## Verification results

_See task #9 output — build/validation results recorded separately._
