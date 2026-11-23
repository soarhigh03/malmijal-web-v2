import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal-document";
import { getLegalDoc } from "@/lib/legal";
import { ogImageAlt, siteName } from "@/lib/site";

const title = "개인정보 처리방침 | 말미잘";
const description = "말미잘 앱의 개인정보 처리방침입니다.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: "/privacy",
  },
  openGraph: {
    type: "website",
    url: "/privacy",
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

// Google Play's "Delete account URL" points at /privacy#account-deletion.
const DELETION_HEADING = "<h3>계정 및 데이터 삭제</h3>";

export default async function PrivacyPage() {
  const doc = await getLegalDoc("privacy");
  if (!doc.html.includes(DELETION_HEADING)) {
    throw new Error(
      "content/legal/privacy.md: account-deletion heading not found (anchor used by the Google Play Delete account URL)",
    );
  }
  const html = doc.html.replace(
    DELETION_HEADING,
    '<h3 id="account-deletion" class="scroll-mt-28">계정 및 데이터 삭제</h3>',
  );
  return <LegalDocument doc={{ ...doc, html }} />;
}
