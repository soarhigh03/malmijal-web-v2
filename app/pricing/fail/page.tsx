import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

export const metadata: Metadata = {
  title: "결제 실패",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PricingFailPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const code = first(params.code);
  const message = first(params.message);

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen pb-32 pt-32 sm:pt-40">
        <div className="mx-auto max-w-2xl px-6 sm:px-10">
          <h1 className="font-kopub text-black text-3xl sm:text-4xl font-bold leading-[1.2] tracking-[-0.035em] mb-6">
            결제에 실패했어요.
          </h1>
          <dl className="rounded-2xl bg-canvas px-6 py-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-base mb-8">
            <dt className="text-black/55">코드</dt>
            <dd className="text-black break-all">{code || "-"}</dd>
            <dt className="text-black/55">메시지</dt>
            <dd className="text-black break-all">{message || "-"}</dd>
          </dl>
          <Link
            href="/pricing"
            className="inline-block rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white"
          >
            이용권 페이지로 돌아가기
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
