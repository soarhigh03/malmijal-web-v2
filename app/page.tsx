import { Header } from "@/components/header";
import { Hero } from "@/components/hero";
import { Features } from "@/components/features";
import { Scoring } from "@/components/scoring";
import { Faq } from "@/components/faq";
import { PopularPosts } from "@/components/popular-posts";
import { Footer } from "@/components/footer";
import { StructuredData } from "@/components/structured-data";

export default function Home() {
  return (
    <>
      <StructuredData />
      <Header />
      <main>
        <Hero />
        <Features />
        <Scoring />
        <Faq />
        <PopularPosts />
      </main>
      <Footer />
    </>
  );
}
