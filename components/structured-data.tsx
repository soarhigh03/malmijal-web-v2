import { brandName, siteName, siteUrl, absoluteUrl } from "@/lib/site";
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

  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    alternateName: brandName,
    url: siteUrl,
  };

  const softwareApp = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: brandName,
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
      <script
        id="structured-data-website"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
      <script
        id="structured-data-software-app"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApp) }}
      />
      <script
        id="structured-data-faq"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
      />
    </>
  );
}
