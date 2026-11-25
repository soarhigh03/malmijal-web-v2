# Blog CTA copy sweep — Step 0 audit (read-only)

Date: 2026-11-14 · Branch at audit: `main` @ 484be11 · No files edited. This report is local only and is not committed.

**Status: STOPPED.** Two in-body CTA sentences would need more than removing the free mention to stay grammatical (see §2.5). A few scope questions are listed in §6. Waiting for approval before Step 1.

---

## 1. Site-level blog CTA component

- **File:** `components/post-footer.tsx` (lines 37–45)
- **Rendered from one place:** yes. `PostFooter` is imported and rendered only in `app/blog/[slug]/page.tsx:158`. The sentence "60초만 말해보고" appears nowhere else in `app/`, `components/`, `lib/` or `content/`.
- **Current markup:**

```tsx
<p className="mt-10 pt-8 border-t border-black/10 text-black/70 text-base leading-relaxed">
  60초만 말해보고, 내 말하기를 분석받아보세요.{" "}
  <Link
    href="/download"
    className="text-black font-medium underline underline-offset-4 hover:text-black/70 transition-colors"
  >
    말미잘 첫 분석 무료
  </Link>
</p>
```

- **Note (not a stop condition):** `PostFooter` returns `null` when a post has no related posts (`if (related.length === 0) return null;`, line 33). In that case the CTA is not shown either. Today every post has related posts, so the CTA shows on all of them.

**Step 1a plan:** change only line 43, `말미잘 첫 분석 무료` → `말미잘로 분석받기 →`. The sentence and `href="/download"` stay the same.

---

## 2. Free-analysis wording in `content/blog/*.md`

Grep terms: `첫 분석`, `무료`. `content/blog/_archive-pre-seo/` has no matches. `TEMPLATE.md` is covered in §5.

Recommended edit: remove the whole "첫 분석 … 무료" construct, including "첫", which only exists to scope the free offer. This needs no particle changes in patterns B and C.
A stricter option is to remove only "무료"/"(무료)" and keep "첫 분석". That is also grammatical in B and C, but "첫 분석" alone still points at the trial. **Decision needed (§6 Q1).**

### 2.1 Pattern A: `[말미잘 첫 분석 무료](/download)` + 로 (8 files, all OK)

Edit: `[말미잘 첫 분석 무료](/download)` → `[말미잘](/download)`. 말미잘 ends in ㄹ, so the following `로` stays correct.
(Keeping "첫 분석" is not possible here: `[말미잘 첫 분석](/download)로` is ungrammatical because it needs 으로.)

| File:line | Current sentence |
|---|---|
| twenty-minute-presentation-outline.md:133 | 전체 시간은 타이머로 점검하고, 핵심 구간을 말할 때의 속도와 전달 방식은 [말미잘 첫 분석 무료](/download)로 확인해보세요. |
| five-minute-presentation-script-example.md:102 | 전체 시간은 타이머로 확인하고, 발표 일부를 말했을 때의 속도와 군말이 궁금하다면 [말미잘 첫 분석 무료](/download)로 확인해보세요. |
| sentence-ending-practice.md:112 | 내 문장으로 말해본 뒤 말끝과 말하기 습관에 대한 피드백이 궁금하다면 [말미잘 첫 분석 무료](/download)로 확인해보세요. |
| shorten-presentation-script.md:110 | 줄인 원고를 급하게 읽는 습관이 남았는지 궁금하다면, 일부를 말해보고 [말미잘 첫 분석 무료](/download)로 속도와 군말을 확인해보세요. |
| how-to-practice-speaking-alone.md:141 | 기본 녹음기로도 이 루틴을 진행할 수 있어요. 속도와 군말 같은 항목을 직접 세는 대신 분석을 참고하고 싶다면 [말미잘 첫 분석 무료](/download)로 확인해볼 수 있습니다. |
| speech-school-effect-checklist.md:113 | 속도와 군말 같은 항목을 직접 세기 번거롭다면 [말미잘 첫 분석 무료](/download)로 녹음 분석을 확인해볼 수 있어요. … |
| reduce-uncertain-endings.md:116 | 새로 만든 문장을 실제로 말할 때의 속도와 말끝도 살펴보고 싶다면 [말미잘 첫 분석 무료](/download)로 확인해보세요. |
| workplace-speech-school-guide.md:108 | … 녹음의 속도·군말 같은 항목을 확인하고 싶다면 [말미잘 첫 분석 무료](/download)로 분석을 받아볼 수도 있습니다. |

The 9th Pattern A file, `speaking-app-comparison.md:100`, is flagged in §2.5.

### 2.2 Pattern B: `[말미잘](/download)의 첫 분석(무료)으로` (11 files, all 8 admissions posts included)

Edit: `의 첫 분석(무료)으로` → `의 분석으로`
(Stricter option: `의 첫 분석(무료)으로` → `의 첫 분석으로`)

| File:line | Current sentence (CTA part) |
|---|---|
| conclusion-first-speaking.md:75 | 녹음에서 결론 도달 시간과 말끝 처리를 직접 세는 게 번거롭다면 [말미잘](/download)의 첫 분석(무료)으로 확인할 수 있습니다. |
| top-down-vs-bottom-up-meaning.md:76 | 내 말하기가 실제로 두괄식으로 나오는지 확인하고 싶다면, [말미잘](/download)의 첫 분석(무료)으로 답변 구조를 점검해볼 수 있습니다. |
| interview-top-down-answer-examples.md:103 | … 직접 세기 번거롭다면 [말미잘](/download)의 첫 분석(무료)으로 구조와 말끝 처리를 함께 확인할 수 있어요. |
| arts-sports-admission-interview.md:77 *(admissions)* | 설명을 녹음해 두었다면 [말미잘](/download)의 첫 분석(무료)으로 속도와 말끝 처리, 답변 구조를 확인할 수 있어요. |
| essay-prompt-interview-answer-structure.md:74 *(admissions)* | 답변을 녹음해 두었다면 [말미잘](/download)의 첫 분석(무료)으로 답변 구조와 속도, 말끝 처리를 함께 확인할 수 있습니다. |
| help-your-child-practice-interview.md:67 *(admissions)* | 녹음한 답변의 속도, 군말, 말끝 처리는 [말미잘](/download)의 첫 분석(무료)으로 확인할 수 있어요. |
| interview-filler-words.md:71 *(admissions)* | 녹음한 답변에서 군말과 쉼을 하나하나 세기 번거롭다면 [말미잘](/download)의 첫 분석(무료)으로 확인할 수 있습니다. |
| interview-nervous-fast-speech.md:72 *(admissions)* | … 녹음한 답변의 속도와 쉼, 군말을 직접 세기 번거롭다면 [말미잘](/download)의 첫 분석(무료)으로 확인할 수 있어요. |
| medical-school-mmi-answer-structure.md:86 *(admissions)* | 녹음한 답변의 구조와 속도, 말끝 처리는 [말미잘](/download)의 첫 분석(무료)으로 확인할 수 있어요. |
| university-interview-one-minute-answer.md:71 *(admissions)* | … 녹음한 답변의 속도와 군말을 직접 확인하기 번거롭다면 [말미잘](/download)의 첫 분석(무료)으로 볼 수 있습니다. |
| university-interview-school-record-questions.md:94 *(admissions)* | 녹음한 답변의 속도, 군말, 말끝 처리를 직접 세기 번거롭다면 [말미잘](/download)의 첫 분석(무료)으로 확인할 수 있어요. |

All 8 admissions posts (`date: 2026-11-12`, `category: admissions`) have exactly one occurrence, and all are Pattern B.

### 2.3 Pattern C1: `에서 첫 분석을 무료로 해볼 수` (5 files)

Edit: `첫 분석을 무료로 해볼 수` → `분석을 해볼 수`
(Stricter option: → `첫 분석을 해볼 수`)

| File:line | Current sentence |
|---|---|
| reduce-filler-words.md:103 | 군말을 직접 세기 번거롭다면 [말미잘](/download)에서 첫 분석을 무료로 해볼 수 있습니다. |
| presentation-script-recovery.md:101 | 발표 연습을 녹음하고 이런 항목을 직접 확인하기 어렵다면 [말미잘](/download)에서 첫 분석을 무료로 해볼 수 있어요. |
| stop-trailing-off.md:107 | 전체 녹음에서 문장 끝과 성량을 직접 확인하기 번거롭다면 [말미잘](/download)에서 첫 분석을 무료로 해볼 수 있어요. |
| presentation-script-memorization.md:109 | 이 세 가지를 직접 듣는 게 번거롭다면 [말미잘](/download)에서 첫 분석을 무료로 해볼 수 있어요. |
| voice-gets-quieter.md:113 | 녹음에서 문장 끝과 성량 변화를 직접 비교하기 번거롭다면 [말미잘](/download)에서 첫 분석을 무료로 해볼 수 있어요. |

### 2.4 Pattern C2: `에서 첫 분석을 무료로 받아볼 수` (3 files)

Edit: `첫 분석을 무료로 받아볼 수` → `분석을 받아볼 수`
(Stricter option: → `첫 분석을 받아볼 수`)

| File:line | Current sentence |
|---|---|
| interview-answer-length.md:164 | 귀로 직접 군말과 속도를 확인하는 게 번거롭다면 [말미잘](/download)에서 첫 분석을 무료로 받아볼 수 있어요. |
| presentation-script-length.md:49 | 대본의 한 블록을 소리 내어 말한 뒤 속도가 궁금하다면 [말미잘](/download)에서 첫 분석을 무료로 받아볼 수 있어요. |
| speech-school-alternative-checklist.md:81 | 말하기를 수치로 추적하는 쪽이 궁금하다면 [말미잘](/download)에서 첫 분석을 무료로 받아볼 수 있습니다. … **월 6,900원의 구독은** 성격이 다른 지출입니다. … ⚠ see §6 Q3 |

### 2.5 ⛔ STOP: removing the free mention alone leaves an ungrammatical sentence

1. **ai-speech-coach-meaning.md:69**
   > 말미잘은 이 글에서 말한 측정 기반 방식으로 만든 한국어 전용 AI 스피치 코치예요. 무엇을 어떻게 재는지는 [말미잘 점수가 만들어지는 방식](/blog/malmijal-index-methodology)에 공개해뒀고, [첫 분석은 무료](/download)라 제 말하기가 어떻게 측정되는지 직접 확인해볼 수 있습니다.

   The whole link text is the free claim ("첫 분석은 무료"), and the connective "라" depends on it. Removing it leaves no link text and a broken clause. This needs a rewrite, so I need approved copy.

2. **speaking-app-comparison.md:100**
   > 녹음의 속도와 군말 같은 항목을 분석으로 확인하고 싶다면 [말미잘 첫 분석 무료](/download)를 이용해볼 수 있습니다.

   `[말미잘](/download)를` is ungrammatical because 말미잘 ends in ㄹ and needs 을. `[말미잘 첫 분석](/download)를` has the same problem. Fixing it means changing 를→을 as well, which is more than removing the free mention.

### 2.6 Other free wording in blog bodies (not linked CTAs, so no edit proposed until scope is confirmed)

| File:line | Current text | Note |
|---|---|---|
| ai-speech-coach-meaning.md:75 (FAQ answer) | … 무료 분석에 같은 녹음을 두 번 넣어보면 어느 쪽인지 확인됩니다. | Implicitly means Malmijal's free analysis. If in scope, the minimal edit `무료 분석에` → `분석에` is grammatical, but the meaning gets vaguer. |
| speech-app-selection.md:45 | 측정에 기반한 판정은 같은 입력에 같은 결과가 나옵니다. 무료 분석이 있는 앱이라면 같은 녹음 파일을 두 번 넣어보는 것만으로 확인할 수 있어요. | About apps in general, not a CTA. |
| speech-app-selection.md:67 | 위 다섯 가지 질문을 저희 스스로에게 던지면서 만든 앱이 [말미잘](/download)입니다. 첫 분석은 무료예요. 다섯 질문을 … | **Malmijal CTA.** Proposed edit: delete the sentence `첫 분석은 무료예요. ` The text before and after stays grammatical. |
| speech-app-selection.md:71 (FAQ H3) | ### 무료 앱과 유료 앱, 뭐가 다른가요? | General comparison, not a CTA. |
| speech-app-selection.md:73 | 가격보다 … 무료여도 근거 없는 점수는 …, 유료여도 측정이 성실하면 … 무료 분석이 있다면 그걸로 판정 일관성부터 확인해보세요. | General comparison, not a CTA. |

**Summary:** 30 occurrences in 30 posts. 28 are in Patterns A–C: 8 + 1 flagged in A, 11 in B, 5 in C1, 3 in C2. The other 2 are linked CTAs that don't fit a pattern: ai-speech-coach-meaning:69 (flagged) and speech-app-selection:67. Separately, 5 lines are non-CTA free wording (§2.6).

---

## 3. Non-blog pages (report only, out of scope)

| File:line | Text |
|---|---|
| app/download/preview/download-design.tsx:52 | `첫 분석 무료` (freeNote label; the `/download/preview` route) |
| app/download/preview/download-design.tsx:70 | `첫 분석 이후 훈련은 유료 구독으로 이용할 수 있어요.` |
| content/faq/faq.md:28 (rendered on home `app/page.tsx` and blog posts via `lib/faq.ts`) | 첫 분석은 무료로 체험할 수 있습니다. 이후 모든 기능은 월 6,900원 구독으로 제공되며, 구독은 언제든 해지할 수 있습니다. |
| content/legal/support.md:28 | **Q. 무료로 쓸 수 있는 범위는 어디까지인가요?** |
| content/legal/support.md:30 | 첫 스피치 분석 1회는 무료이며, 다섯 축 점수와 피드백 전체를 받아볼 수 있습니다. 이후의 드릴(…)은 말미잘 Pro 구독이 필요합니다. … |
| content/legal/privacy.md:9 | … 애플리케이션은 무료로 이용 가능하며, 일부 기능은 인앱 유료 상품(말미잘 Pro 구독 및 크레딧)을 통해 제공됩니다. … |
| content/legal/terms.md:9 | … 애플리케이션은 무료로 제공되는 기능과, 유료 상품(구독 또는 크레딧)을 구매한 이용자에게 제공되는 기능으로 구성됩니다. |

No free wording in `app/page.tsx` (home), `app/download/page.tsx`, the site footer components, or `app/pricing/`.

---

## 4. Report-only term scan (content/blog plus all site copy in app/, components/, lib/, content/, public/)

| Term | Hits |
|---|---|
| 등급, 티어, 100점, 90점, 오디오 삭제, 분석 후 삭제, aggregateRating | **0** |
| 무료로 시작 | 1: content/blog/TEMPLATE.md:44 (the guide rule itself) |
| 점수 | many (below) |

**점수 hits:**
- ai-speech-coach-meaning.md:37, 69, 73 (H3 "AI가 점수를 대충 주는 건 아닌가요?")
- how-to-speak-up-in-meetings.md:77: [말미잘](/download)은 속도·군말·문장 끝 처리를 점수로 보여줘서 …
- one-minute-self-introduction.md:85: … 군말을 점수로 보여주는 도구를 쓰는 방법도 있어요.
- how-to-speak-persuasively.md:69: … 어디가 나아지는지 점수로 확인할 수 있어요.
- speaking-app-comparison.md:51: 점수의 의미와 확인할 항목이 궁금하다면 …
- speech-school-effect-checklist.md:121 (H3 "녹음 점수가 높아졌으면 말을 잘하게 된 건가요?")
- speech-app-selection.md:5 (excerpt), 10, 17, 29, 31, 35, 37, 43, 49, 51, 67, 73
- how-to-practice-speaking-alone.md:121, 129
- malmijal-index-methodology.md:3 (title), 9 (excerpt), 16, 19, 23, 25, 29, 33, 35, 67, 85, 87, 103 (H2 "점수의 목적은 평가가 아니라 다음 연습입니다"), 107
- app/download/page.tsx:54 (meta description "한국어 말하기를 점수로 확인하고 …"), 125 (hero "한국어 말하기를 점수로 확인하고,")
- content/legal/support.md:26, 30, 40
- components/features.tsx:5: "… 5개 차원 전부로 점수가 매겨지는 메인 드릴."

**Related, for context (not on the list):** no "오디오 삭제" or "분석 후 삭제" claims exist. The data-retention copy actually says the opposite. support.md:48 says "분석이 끝난 뒤에도 자동으로 삭제되지는 않으며", and privacy.md:33 says "분석 완료 후에도 삭제되지 않고". faq.md:24 and support.md:52 say *video* is deleted on-device after the session.

**`featured: true`:** `content/blog/malmijal-index-methodology.md` is the only published post with it. (TEMPLATE.md also has it, but TEMPLATE isn't published.)
- Title: 말미잘이 매긴 말하기 점수, / 의심부터 하셔도 됩니다
- Excerpt: 말미잘 지표는 여러분의 말하기에서 무엇을, 어떻게 듣고 있을까요. / 점수를 믿어달라고 하는 대신, 점수가 만들어지는 방식을 보여드립니다.
- date 2026-07-15, category practice

---

## 5. TEMPLATE.md guide item 9 (current)

`content/blog/TEMPLATE.md` lines 43–44:

```
9. 무료 체험 표현은 "첫 분석 무료"만 허용.
   "무료로 시작" 등 상시 무료를 암시하는 표현은 사용하지 않는다.
```

Step 1c will replace both lines with the single approved line.

---

## 6. Decisions needed before Step 1

1. **Keep or drop "첫" (Patterns B/C):** recommended is to drop it (`의 분석으로`, `분석을 해볼/받아볼 수`). The stricter option keeps `첫 분석`.
2. **Approved copy for the two STOP items (§2.5):** ai-speech-coach-meaning.md:69 needs a rewrite. For speaking-app-comparison.md:100, is the 를→을 particle fix (`[말미잘](/download)을 이용해볼 수 있습니다`) approved?
3. **Paid mentions inside CTA paragraphs:** the brief says "free/paid" but Step 0 #2 only covers free wording, so these are left alone unless you say otherwise:
   - speech-school-alternative-checklist.md:81: "… 월 6,900원의 구독은 성격이 다른 지출입니다."
   - "Pro의 실전연습에서 …" in arts-sports-admission-interview:77, help-your-child-practice-interview:67, medical-school-mmi-answer-structure:86, university-interview-school-record-questions:94
4. **Non-CTA free wording (§2.6):** confirm whether speech-app-selection.md:67 (delete `첫 분석은 무료예요.`) is in scope. Confirm that ai-speech-coach-meaning.md:75 and speech-app-selection.md:45/71/73 stay as they are.
