import { HeroSection } from "@/components/home/HeroSection";
import { ProductsSection } from "@/components/home/ProductsSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FaqSection } from "@/components/home/FaqSection";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ProductsSection />
      <HowItWorks />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
