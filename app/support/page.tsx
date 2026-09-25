import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { getLegalDoc } from "@/lib/legal";
import { siteName } from "@/lib/site";

const title = "고객지원 | 말미잘";
const description = "말미잘 앱 문의 방법과 자주 묻는 질문을 안내합니다.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/support",
  },
  openGraph: {
    type: "website",
    url: "/support",
    siteName,
    title,
    description,
    images: [
      {
        url: "/og/og-default.png",
        width: 1200,
        height: 630,
        alt: "말미잘 — 한국어 AI 스피치 코치",
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

export default async function SupportPage() {
  const doc = await getLegalDoc("support");
  return <LegalDocument doc={doc} />;
}
