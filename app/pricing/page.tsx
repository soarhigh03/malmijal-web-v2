import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { isTestKey } from "@/lib/pricing";
import { Checkout } from "./checkout";

export const metadata: Metadata = {
  title: "말미잘 Pro 이용권",
  robots: { index: false, follow: false },
};

export default function PricingPage() {
  const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen pb-32 pt-32 sm:pt-40">
        <div className="mx-auto max-w-2xl px-6 sm:px-10">
          <h1 className="font-kopub text-black text-3xl sm:text-4xl font-bold leading-[1.2] tracking-[-0.035em] mb-5">
            말미잘 Pro 이용권
          </h1>
          <p className="text-base sm:text-lg text-black/70 leading-relaxed mb-10">
            면접·발표·회의 답변을 녹음하면 음성과 답변 구조를 분석해 개선 피드백을 드려요. 이용권을 결제하면 분석, 훈련 드릴, 실전연습을 이용할 수 있어요.
          </p>

          {isTestKey(clientKey) ? (
            <Checkout clientKey={clientKey} />
          ) : (
            <p className="rounded-2xl bg-canvas px-6 py-8 text-center text-black/70">
              결제 준비 중입니다.
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
