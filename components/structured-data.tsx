import Script from "next/script";
import { siteUrl, absoluteUrl } from "@/lib/site";
import { getFaqItems } from "@/lib/faq";

function htmlToPlainText(html: string): string {
  return html
    .replace(/<[^>]+>/g, "")
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export async function StructuredData() {
  const faqItems = await getFaqItems();

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "말미잘",
    alternateName: "Malmijal",
    description:
      "60초 녹음에서 속도, 군말, 문장 끝 처리, 억양을 직접 측정하는 한국어 AI 스피치 코치",
    operatingSystem: "iOS, Android",
    applicationCategory: "EducationalApplication",
    offers: {
      "@type": "Offer",
      price: "4400",
      priceCurrency: "KRW",
    },
    url: siteUrl,
    installUrl: absoluteUrl("/download"),
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: htmlToPlainText(item.answerHtml),
      },
    })),
  };

  return (
    <>
      <Script
        id="structured-data-software-app"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <Script
        id="structured-data-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
