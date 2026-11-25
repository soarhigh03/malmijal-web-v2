# Toss 테스트 결제 페이지 — Step 0 감사 (읽기 전용)

날짜: 2026-11-12 · 상태: **중단, 승인 대기** (차단 사항 2건)

## 1. 위치

| 항목 | 결과 |
|---|---|
| 마케팅 사이트 | `/Users/bho/malmijal-web-v2` (`github.com/soarhigh03/malmijal-web-v2`) |
| 프레임워크 | Next.js 15.5.19, App Router (`app/`), React 19, Tailwind v4 |
| 배포 | Vercel. `next.config.ts`가 `malmijal-web-v2.vercel.app`을 `malmijal.kr`로 리다이렉트함. 로컬에 `.vercel/` 링크 없음 |
| 루트 레이아웃 | `app/layout.tsx`. footer를 렌더링하지 **않음** |
| Footer | `components/footer.tsx`. 공유 컴포넌트, 페이지별로 렌더링 |
| /terms | `app/terms/page.tsx`가 `LegalDocument`를 통해 `content/legal/terms.md`를 렌더링 |
| malmijal-dev | 다른 저장소(`Beeeeho/malmijal-app`, Flutter/FastAPI/Supabase). 손대지 않음 |

## 2. 결과

### Footer (`components/footer.tsx`)
- 상호: `에토세토라`
- 대표자: `대표자 박병호`
- 사업자등록번호: `사업자등록번호 418-23-02270`
- 사업장 주소: `서울특별시 서초구 강남대로61길 23`
- **유선 전화번호: 없음** ← F항 중단 조건. 저장소 어디에도 전화번호가 없음
- 그 외: `malmijal.team@gmail.com`, `© 2026 에토세토라`, 링크(개인정보 처리방침, 이용약관, 고객지원), 스토어 배지, Google Play 상표 문구

공유 Footer가 렌더링되는 곳: `/`, `/blog`, `/blog/[slug]`, `/terms`, `/privacy`, `/support`.
렌더링되지 **않는** 곳: `/download`(자체 최소 footer, 사업자 정보 없음), `/download/preview`.

### /terms의 환불 조항
- 조항 번호(제N조) 없이 `###` 제목으로만 구성됨
- `### 청약철회 및 환불` 섹션이 있음: 7일 청약철회와 제한 사유, 크레딧 팩 부분 환불, 인앱결제 환불은 앱마켓 정책을 따름, 과오금 환불. 문의처는 `malmijal.team@gmail.com`
- `### 유료 서비스 및 결제`에 "결제는 앱마켓 인앱결제 시스템을 통해 처리"된다고 적혀 있어, 웹 결제 추가 시 이 문구와 맞지 않게 됨(수정하지 않음, 참고용)

### 경로명
`/pricing`, `/pricing/success`, `/pricing/fail`에는 test/dev/staging이 들어가지 않음. 현재 `app/` 아래에도 해당 디렉터리 없음.

## 3. 도구
- 패키지 매니저: npm (`package-lock.json`만 존재). Node 24.14.1, npm 11.11.0
- `@tosspayments/tosspayments-sdk`: 미설치 (npm 최신 버전 2.10.0)
- `docs/reports/`는 git에 추적되며 gitignore 대상이 아님. 보고서는 untracked로 두고 stage하지 않음

## 4. 차단 사항 / 결정 필요
1. **origin/dev 없음.** 이 저장소의 원격 브랜치는 `main`뿐임. `origin/main`에서 분기할 것을 제안
2. **footer에 유선 전화번호 없음.** 지시대로 중단. 번호가 필요함(임의로 만들지 않음)
3. **/terms에 조항 번호 없음.** "마지막 조항 다음 번호" 규칙을 적용할 수 없음
4. **/download에 공유 Footer 없음.** "모든 페이지"에 해당하는지 결정 필요

## 5. 변경 예정 파일
- `package.json`, `package-lock.json`: `@tosspayments/tosspayments-sdk` 추가
- `lib/pricing.ts`: 상품 상수(단일 기준)
- `lib/toss.ts` (`server-only`): 결제 승인(confirm) 호출, `test_` 키 검사
- `app/pricing/page.tsx`: 서버 컴포넌트, metadata, `test_` 검사
- `app/pricing/checkout.tsx`: 클라이언트 위젯
- `app/pricing/success/page.tsx`, `app/pricing/fail/page.tsx`
- `content/legal/terms.md`: 새 섹션 추가
- `components/footer.tsx`: 전화번호 받은 후에만 수정
- 선택: `app/download/page.tsx` (4번 결정에 따라)
- 수정하지 않음: `app/sitemap.ts`, `components/header.tsx`, `.env.example`(키 기록 안 함)
