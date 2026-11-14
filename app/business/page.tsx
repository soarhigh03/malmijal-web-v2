import type { Metadata } from "next";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { normalizeSource } from "@/lib/org-inquiry-fields";
import { ogImageAlt, siteName } from "@/lib/site";
import { InquiryForm } from "./inquiry-form";

const title = "기관 도입 문의 | 말미잘";
const description =
  "학교, 학원, 기업, 공공기관에서 말미잘을 함께 쓰고 싶다면 아래 내용을 남겨 주세요. 확인 후 이메일로 연락드립니다.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/business",
  },
  openGraph: {
    type: "website",
    url: "/business",
    siteName,
    title,
    description,
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: ogImageAlt,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/og/og-default.png"],
  },
};

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function BusinessPage({ searchParams }: Props) {
  const { source: rawSource } = await searchParams;
  const source = normalizeSource(Array.isArray(rawSource) ? rawSource[0] : rawSource);
  // Server time, so the API's "too fast" check is not affected by client clocks.
  const renderedAt = Date.now();

  return (
    <>
      <Header />
      <main className="bg-white min-h-screen pb-32 pt-32 sm:pt-40">
        <div className="mx-auto max-w-2xl px-6 sm:px-10">
          <h1 className="font-kopub text-black text-3xl sm:text-4xl font-bold leading-[1.2] tracking-[-0.035em] mb-5">
            기관 도입 문의
          </h1>
          <p className="text-base sm:text-lg text-black/70 leading-relaxed mb-10">
            학교, 학원, 기업, 공공기관에서 말미잘을 함께 쓰고 싶다면 아래 내용을 남겨 주세요. 확인 후 이메일로 연락드립니다.
          </p>

          <InquiryForm source={source} renderedAt={renderedAt} />
        </div>
      </main>
      <Footer />
    </>
  );
}
