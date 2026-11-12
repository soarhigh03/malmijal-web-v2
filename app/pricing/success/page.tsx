import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { formatKrw } from "@/lib/pricing";
import { confirmPayment } from "@/lib/toss";

export const metadata: Metadata = {
  title: "결제 결과",
  robots: { index: false, follow: false },
};

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function PricingSuccessPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const result = await confirmPayment({
    paymentKey: first(params.paymentKey),
    orderId: first(params.orderId),
    amount: first(params.amount),
  });

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen pb-32 pt-32 sm:pt-40">
        <div className="mx-auto max-w-2xl px-6 sm:px-10">
          {result.ok ? (
            <>
              <h1 className="font-kopub text-black text-3xl sm:text-4xl font-bold leading-[1.2] tracking-[-0.035em] mb-8">
                결제가 완료되었어요.
              </h1>
              <dl className="rounded-2xl bg-canvas px-6 py-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-3 text-base">
                <dt className="text-black/55">상품</dt>
                <dd className="font-medium text-black">{result.orderName}</dd>
                <dt className="text-black/55">결제 금액</dt>
                <dd className="font-medium text-black">{formatKrw(result.amount)}</dd>
                <dt className="text-black/55">주문번호</dt>
                <dd className="text-black/70 break-all">{result.orderId}</dd>
              </dl>
            </>
          ) : (
            <>
              <h1 className="font-kopub text-black text-3xl sm:text-4xl font-bold leading-[1.2] tracking-[-0.035em] mb-6">
                결제를 완료하지 못했어요.
              </h1>
              <p className="text-base text-black/70 mb-8">{result.message}</p>
              <Link
                href="/pricing"
                className="inline-block rounded-2xl bg-black px-6 py-3 text-sm font-semibold text-white"
              >
                이용권 페이지로 돌아가기
              </Link>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
