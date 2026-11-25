# Play "Delete account URL" → malmijal.kr/privacy#account-deletion — Step 0

- Date checked: 2026-11-23 (filename kept as specified)
- Repo: `soarhigh03/malmijal-web-v2`, production branch `main` @ `968e8aa`
- Worktree: `/Users/bho/malmijal-web-v2-privacy-anchor`, branch `fix/privacy-account-deletion-anchor` (off `origin/main`, no changes yet)
- Status: **STOPPED, stop condition hit** (email is missing from raw HTML because of a Cloudflare setting). No code changed.

## 1. Source locations

| What | Path:line |
|---|---|
| Route | `app/privacy/page.tsx:43-46`: `getLegalDoc("privacy")` → `<LegalDocument doc={doc} />` (server component) |
| Renderer | `components/legal-document.tsx:6-38`. h1 = `doc.title` (`:12-14`), date line (`:16-30`), body via `dangerouslySetInnerHTML` (`:32`) |
| Loader | `lib/legal.ts:48-52` → `lib/markdown.ts:5-13` (remark + remark-gfm + remark-html; GFM autolinks bare emails into `mailto:`) |
| Content | `content/legal/privacy.md` |
| Deletion section | `content/legal/privacy.md:72-83` (`### 계정 및 데이터 삭제`) |
| Fixed header | `components/header.tsx:139-140`: `<header className="fixed top-0 inset-x-0 z-50">`, inner `h-24` (96px) |
| Footer | `components/footer.tsx:6` `<footer id="contact">`, `:47-52` mailto link |

Shared code: `LegalDocument` and `getLegalDoc` are also used by `/terms` and `/support`, and `markdownToHtml` is also used by the blog. Any change there would reach other pages, so the change belongs in `app/privacy/page.tsx`.

## 2. Production HTML (`curl`, not source)

`curl -sIL https://malmijal.kr/privacy` returns **HTTP/2 200** with no redirects. Headers: `server: cloudflare`, `x-vercel-cache: HIT`, `x-nextjs-prerender: 1` (static prerender), `cf-cache-status: DYNAMIC`.

| String | Whole file | Outside `<script>` (visible HTML) |
|---|---|---|
| `말미잘` | 28 | 15 |
| `Byungho Park` | 2 | 1 |
| `회원 탈퇴` | 2 | 1 |
| `malmijal.team@gmail.com` | 8 | **0** |
| `mailto:` | 4 | **0** |

All email/mailto hits are inside the Next.js RSC flight payload (`self.__next_f.push(...)`). None are in the HTML markup.

The deletion section text is server-rendered: `회원 탈퇴`, `이메일 요청`, `삭제되는 데이터`, etc. are all in the markup. No client-only rendering problem.

## 3. Support email: why it is missing → **Cloudflare Email Address Obfuscation**

The code is fine. The RSC payload, which reflects what Vercel/Next renders, contains:

```
이메일 요청: 앱을 사용할 수 없는 경우 <a href="mailto:malmijal.team@gmail.com">malmijal.team@gmail.com</a> 으로 …
```

What the browser or crawler actually receives (the rewritten markup):

```html
<li>이메일 요청: 앱을 사용할 수 없는 경우 <a href="/cdn-cgi/l/email-protection#107d717c7d797a717c3e6475717d50777d71797c3e737f7d"><span class="__cf_email__" data-cfemail="c1aca0adaca8aba0adefb5a4a0ac81a6aca0a8adefa2aeac">[email&#160;protected]</span></a> 으로 삭제를 요청해 주시면 합리적인 기간 내에 처리해 드립니다.</li>
```

There is also an injected `<script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js">`. The same rewrite hits all four addresses: deletion item, 아동 section, 문의처, and the footer.

- DNS: `malmijal.kr` NS = `kira/wilson.ns.cloudflare.com`, proxied (A = 104.21.x / 172.67.x).
- `https://malmijal-web-v2.vercel.app/privacy` 308s to `malmijal.kr`, so the origin cannot be fetched past Cloudflare. The RSC payload above is the origin evidence.

**Setting:** Cloudflare dashboard → zone `malmijal.kr` → **Scrape Shield → Email Address Obfuscation**. In the newer dashboard it is under Security → Settings.

Recommended options (your call; I did not work around this in code):
- **A (narrowest):** Rules → **Configuration Rules** → new rule `URI Path equals /privacy` → set **Email Obfuscation: Off**. Every other page stays obfuscated.
- **B:** Turn Email Address Obfuscation off for the whole zone.

`cf-cache-status: DYNAMIC` means Cloudflare is not caching this page, so the change should show up on the next request without a purge.

## 4. Anchors / TOC / header

- Heading ids in the page: **none**. The only `id` on the page is `footer#contact`.
- Headings: h1 `말미잘 개인정보 처리방침`; h2 `개인정보 처리방침`; h3 (in order): 정보 수집 및 이용, 음성 및 영상 데이터의 처리, 제3자 접근 및 AI 서비스 데이터 전송, 결제, 구독 및 크레딧 정보, 수집 거부 권리, **계정 및 데이터 삭제**, 아동에 관한 사항, 보안, 변경 사항, 이용자의 동의, 문의처.
- The deletion heading has **no id**.
- **No TOC.**
- **Fixed header, 96px** (`h-24`). `app/globals.css:37` has `section[id] { scroll-margin-top: 96px; }`, but that only applies to `<section>` elements and not to the markdown `<h3>`. An `#account-deletion` jump would land the heading underneath the header, so scroll-margin is needed.
- `html { scroll-behavior: smooth; }` is set globally. Harmless.

## 5. Position and identity

- Deletion section = 6th of 11 h3 sections, about 69% of the way through the visible markup. It is not visible without the anchor.
- `말미잘` appears in the h1 (`말미잘 개인정보 처리방침`) and in the `<title>` (`개인정보 처리방침 | 말미잘`).
- `Byungho Park` appears in the first paragraph: `본 개인정보 처리방침은 Byungho Park(이하 "서비스 제공자")이 제작한 모바일 디바이스용 말미잘 앱…`.
- Both match the Play listing (app 말미잘, developer Byungho Park).
- The footer shows 에토세토라 / 대표자 박병호, which does not match the Play developer name. The first paragraph already covers the requirement, so I am noting this only, not proposing a change.

## 6. Retention: every relevant line

- `privacy.md:33` (음성): "…분석 완료 후에도 삭제되지 않고 이용자가 계정을 삭제하거나 삭제를 요청할 때까지 보관됩니다."
- `privacy.md:66` (결제): "…해당 정보는 유료 기능 제공, 구매 복원, 결제 관련 문의 대응 및 부정 이용 방지 목적으로 이용되며, 계정 삭제 시까지 보관됩니다. 다만 거래 기록 중 관련 법령에 따라 보존이 요구되는 정보는 해당 법령이 정한 기간 동안 보관됩니다."
- `privacy.md:76`: "삭제 시 계정 정보, 음성 녹음, 진단 결과, 훈련 기록 및 크레딧 잔액이 삭제됩니다."
- `privacy.md:79`: "삭제되는 데이터: 계정 정보(이메일), 음성 녹음 및 전사문, 스피치 진단 결과, 훈련 기록, 크레딧 잔액. 계정 삭제 시 잔여 크레딧은 소멸하며 환불되지 않습니다."
- `privacy.md:83`: "법령에 따라 보존이 필요한 일부 데이터는 관련 법령에서 정한 기간 동안 보관될 수 있습니다."
- There is no `보유 기간` section.

**A concrete period for transaction records does not appear anywhere.** The deletion section also does not name which data is retained; it only says "일부 데이터". Play asks for the data types that are retained and any retention period, so this is the remaining policy-content risk. Fixing it is a wording change, so I have **not** applied it. Proposed text, to replace `privacy.md:83` (needs your or a legal check that it matches what is actually kept):

> 다만 관련 법령에 따라 보존이 필요한 다음 정보는 계정 삭제 후에도 해당 기간 동안 보관된 뒤 파기됩니다: 앱마켓 거래 식별자 등 대금결제 및 재화 등의 공급에 관한 기록 5년, 결제 관련 소비자 불만 또는 분쟁처리에 관한 기록 3년(「전자상거래 등에서의 소비자보호에 관한 법률」).

## 7. Effective-date inconsistency (confirmed, not fixed)

- Frontmatter (`privacy.md:3-4`): `effectiveDate: "2026-09-28"`, `updatedAt: "2026-09-26"`. Rendered header: `시행일 2026.09.28 · 최종 수정일 2026.09.26`.
- Body (`privacy.md:99`): "본 개인정보 처리방침은 2026년 10월 2일부터 시행됩니다."
- So the header says 09.28 and the body says 10.02. Separately, 최종 수정일 (09.26) is earlier than both.

## 8. Deploy path

- Vercel Git integration, project `malmijal/malmijal-web-v2`. There is no `vercel.json` or `.github/` workflow.
- Production = `main`. The latest Production deployment is `968e8aa` (2026-11-14), which equals `origin/main`.
- Every pushed branch/PR gets a Preview at `malmijal-web-v2-git-<branch>-malmijal.vercel.app`, posted by the Vercel bot as a PR comment.
- **Preview URLs are behind Vercel Authentication.** A plain `curl` gets 302'd to `vercel.com/login`. The verification curl needs `vercel curl` or a protection-bypass token.
- Previews are not behind Cloudflare. The email grep will pass on preview whatever the Cloudflare setting is, so the real email check has to be re-run on `malmijal.kr` after the merge and the Cloudflare change.

## Proposed change (awaiting approval)

Only `app/privacy/page.tsx` changes. No content or wording edit, no new route, no shared-component change:

```tsx
const DELETION_HEADING = "<h3>계정 및 데이터 삭제</h3>";

export default async function PrivacyPage() {
  const doc = await getLegalDoc("privacy");
  if (!doc.html.includes(DELETION_HEADING)) {
    throw new Error("privacy.md: account-deletion heading not found (Play Delete account URL anchor)");
  }
  const html = doc.html.replace(
    DELETION_HEADING,
    '<h3 id="account-deletion" class="scroll-mt-28">계정 및 데이터 삭제</h3>',
  );
  return <LegalDocument doc={{ ...doc, html }} />;
}
```

- (a) Adds the id. There is no existing id to preserve.
- (b) N/A: there is no TOC.
- (c) No code change needed. Cloudflare setting per §3.
- (d) `scroll-mt-28` (112px, which clears the 96px header) on that heading only. Tailwind picks the class up from `page.tsx`.
- (e) No route or redirect.
- If someone renames the heading in the markdown, the build fails loudly instead of silently dropping the anchor.
- Why not edit the markdown with raw `<h3 id>`? remark-html sanitizes by default, which would either strip the id or prefix it as `user-content-…`.

---

# Implementation and verification (2026-11-23)

Decisions: the `page.tsx` change was approved. You handled the email obfuscation with a Cloudflare Configuration Rule, so no code workaround (the `<!--email_off-->` plan was cancelled). Retention wording and the effective-date mismatch are deferred to a separate policy revision.

## Change
- PR: https://github.com/soarhigh03/malmijal-web-v2/pull/11. Commit `cfd090d`, merged as `b778d49`.
- File: `app/privacy/page.tsx` only (+14/−1). It replaces `<h3>계정 및 데이터 삭제</h3>` with `<h3 id="account-deletion" class="scroll-mt-28">…</h3>`, and throws at build if the heading isn't found. No content, wording or shared-component changes. `git diff --name-only 968e8aa b778d49` = `app/privacy/page.tsx`.

## Build / lint
- `npx tsc --noEmit`: OK.
- `npm run build`: OK (55 static pages, `/privacy` static).
- The repo has no ESLint config and no `lint` script. `next build`'s "Linting and checking validity of types" step passed.
- Built `/privacy` HTML: 1 × `id="account-deletion"`, 4 × `mailto:`, and the `.scroll-mt-28{scroll-margin-top:calc(var(--spacing) * 28)}` CSS rule was generated.

## Preview (before merge)
- URL: https://malmijal-web-v2-git-fix-privacy-account-deletio-2bb9f2-malmijal.vercel.app
- `vercel curl /privacy`: 200. `id="account-deletion"` = 1. 말미잘 28, Byungho Park 2, 회원 탈퇴 2, `mailto:malmijal.team@gmail.com` 8 (includes the RSC payload).
- Headless Chrome via CDP, opening `/privacy#account-deletion` with the OIDC header scoped to the preview host: desktop 1280×900 and mobile 390×844 both show heading top = 112px and header bottom = 96px. The heading is fully visible below the header.
- Side effect: `vercel curl` generated a deployment-protection bypass token on project `malmijal/malmijal-web-v2`. Revoke it in Settings → Deployment Protection if you don't want it.

## Production deploy
- `dpl_52vqs7uFjvFEY31NAXywEVMBH3nP` (team `malmijal`): READY, target production, commit `b778d49`, aliases `malmijal.kr`, `www.malmijal.kr`.
- Note: the repo also deploys to a second Vercel project, `soarhigh03s-projects/malmijal-web-v2` (`malmijal-web-v2-e0jjz29bb-soarhigh03s-projects.vercel.app`). It does not serve the domain and was left untouched.

## Cloudflare (done by you)
- NS = `kira/wilson.ns.cloudflare.com`. `server: cloudflare`, `cf-ray: a5efc136daac27ec-LAX`.
- Configuration Rule `URI Path equals /privacy → Email Obfuscation Off`. `/privacy` purged (apex and www).

## Production verification (after the Cloudflare rule)
```
$ curl -sL https://malmijal.kr/privacy | grep -c 'id="account-deletion"'
1
$ curl -sL https://malmijal.kr/privacy | grep -c 'mailto:malmijal.team@gmail.com'
4
$ curl -sL https://malmijal.kr/privacy | grep -c '\[email&#160;protected\]\|email-protection'
0
```
- `https://malmijal.kr/privacy`: HTTP/2 200, `cf-cache-status: DYNAMIC`.
- `https://www.malmijal.kr/privacy`: 308 to the apex, then 200. Same counts (1 / 4 / 0).
- Visible markup only (scripts stripped): `mailto:` 4, email text 8, 말미잘 15, Byungho Park 1.
- Deletion item as served:
  `<li>이메일 요청: 앱을 사용할 수 없는 경우 <a href="mailto:malmijal.team@gmail.com">malmijal.team@gmail.com</a> 으로 삭제를 요청해 주시면 합리적인 기간 내에 처리해 드립니다.</li>`
- `/terms` and `/support`: 200, no `account-deletion` id, still Cloudflare-obfuscated (`email-protection` = 4 each). They are unaffected by the code change and outside the rule, as expected.

## Play Console
- Delete account URL to submit: **https://malmijal.kr/privacy#account-deletion**

## Still open (separate policy revision)
- Concrete retention period for transaction records (proposed wording in §6).
- Effective date: header 2026.09.28 / 최종 수정일 2026.09.26 vs body 2026-10-02.
