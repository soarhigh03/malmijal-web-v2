# Toss 테스트 결제 페이지: 구현 보고서

날짜: 2026-11-12 · 브랜치: `feat/pricing-toss-checkout`(`origin/main`에서 분기, upstream 미설정, 푸시 안 함)
워크트리: `/Users/bho/malmijal-web-v2-pricing` · 커밋: `a60b68b`

## 변경 내용
| 파일 | 내용 |
|---|---|
| `lib/pricing.ts` | 상품 상수(pro_1m 6,900원 / pro_12m 59,000원), `isTestKey()` |
| `lib/toss.ts` | `server-only`. 결제 승인(confirm). `TOSS_SECRET_KEY`가 `test_`로 시작하지 않으면 거부. 금액이 상품 가격과 다르면 거부. 응답의 `totalAmount`·`orderId`도 다시 대조. DB 쓰기 없음 |
| `app/pricing/page.tsx` | 서버 컴포넌트. client key가 `test_`가 아니면 "결제 준비 중입니다."만 렌더링 |
| `app/pricing/checkout.tsx` | 클라이언트 위젯. key를 한 번 더 검사(이중 가드). 라디오 선택, 이메일 입력, 위젯, 안내문 |
| `app/pricing/success/page.tsx` | 서버에서 승인 후 성공/실패 표시 |
| `app/pricing/fail/page.tsx` | code/message 표시, /pricing으로 돌아가는 링크 |
| `content/legal/terms.md` | 3a 문장 삽입, 3b 섹션 추가(①–③ 문단 분리) |
| `package.json`, `package-lock.json` | `@tosspayments/tosspayments-sdk@^2.10.0`, `server-only` |

세 페이지 모두 `robots: noindex, nofollow`를 출력하며(googlebot 메타 없음), nav·footer·sitemap에서 링크하지 않음.
`components/footer.tsx`, `app/download`는 수정하지 않음.

## 3c: 약관 시행일·개정 이력 (수정하지 않음, 결정 필요)
- frontmatter: `effectiveDate: "2026-09-28"`, `updatedAt: "2026-09-25"`
- 본문(`### 본 약관의 변경` 마지막 문단): "2026년 5월 24일 최초 시행되었으며, 2026년 7월 5일 개정을 거쳐, 본 개정 약관은 2026년 10월 2일부터 시행됩니다. 본 개정은 연간 구독 상품 및 크레딧 제도의 신설을 반영한 것으로…"
- 참고: 기존 값끼리도 맞지 않음. frontmatter 시행일은 09-28, 본문 시행일은 10-02이고, updatedAt(09-25)이 시행일보다 이름

## 검증
| 항목 | 결과 |
|---|---|
| `npm run build` (키 없음 / live_ 키 / test_ 키) | 모두 통과. `tsc --noEmit` 통과 |
| test_ 키(토스 공개 문서 키, `.env.local`)로 /pricing 렌더링 | 위젯 iframe 렌더링, "테스트 환경이에요" 배너, 결제수단·약관 표시, 버튼 활성화. prod·dev(Strict Mode) 모두 확인 |
| test 시크릿으로 승인 호출 | 가짜 paymentKey로 호출 시 토스 API가 "결제 시간이 만료되어…"를 반환(인증은 통과, 실제 API 호출 확인) |
| 금액 위조 (amount=1000) | "결제 금액이 상품 가격과 일치하지 않습니다.", 네트워크 호출 없음 |
| client key `live_gck_fake`로 빌드 | /pricing에 "결제 준비 중입니다.", 위젯 div 없음 |
| `TOSS_SECRET_KEY=live_gsk_fake` | /pricing/success에서 승인 거부("결제 준비 중입니다."), 호출 없음 |
| Footer | `/`, `/pricing`, `/pricing/success`, `/pricing/fail`, `/terms`에 사업자 정보 표시 |
| 경로명 | test/dev/staging 없음. sitemap에 pricing 없음 |
| 키 커밋 여부 | 소스·커밋에 키 없음. `.env.local`은 gitignore 대상 |

실제 결제 흐름(카드 입력 후 success 리다이렉트까지)은 브라우저에서 직접 해 보지 않음.

## 환경 변수 (Vercel에서 직접 설정)
- `NEXT_PUBLIC_TOSS_CLIENT_KEY`: 결제위젯 **클라이언트 키** (`test_gck_…`). 빌드 시점에 인라인되므로 설정 후 **재배포 필요**
- `TOSS_SECRET_KEY`: 결제위젯 **시크릿 키** (`test_gsk_…`). 서버 전용, Sensitive 설정 권장
- 위젯 키(gck/gsk)와 API 개별 연동 키(ck/sk)는 서로 호환되지 않음. 둘 다 위젯 키를 쓸 것
- variantKey는 `DEFAULT`(결제수단), `AGREEMENT`(약관)을 사용. 상점 결제위젯 어드민에 이 이름이 없으면 위젯이 에러를 냄

## 남은 일
- 유선 전화번호를 받으면 `components/footer.tsx`에 별도로 작은 변경
- 약관 시행일·개정 이력 결정 (3c)

## 후속 (2026-11-12)
- 3c 반영(`23c2822`): 시행일 2026-11-20, 최종 수정일 2026-11-13, 개정 이력에 "2026-11-20 개정(웹 결제 이용권 조항 추가)" 문단 추가. 기존 이력 문단은 그대로 둠
- 푸시 후 PR #5 생성: https://github.com/soarhigh03/malmijal-web-v2/pull/5
- `gh pr checks`: Vercel 프리뷰 배포와 Preview Comments 모두 통과. **머지하지 않음**(Vercel 환경 변수 설정 대기)
- 약관 문구 수정(`a3c2d55`): "본 개정 약관은 2026년 10월 2일부터 시행됩니다" → "개정 약관은 2026년 10월 2일부터 시행되었습니다". 푸시 후 체크 통과, 머지하지 않음
- 2026-11-13 머지: PR #5 → main `89a87b5`(merge commit). 프로덕션 확인: /pricing 위젯 렌더링(test_gck_ 키), /pricing/success가 test 시크릿으로 토스 API까지 도달, noindex·nofollow 적용, sitemap에 pricing 없음
