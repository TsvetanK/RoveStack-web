import { HeroSection } from "@/components/home/HeroSection";
import { CountryGrid } from "@/components/home/CountryGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FaqSection } from "@/components/home/FaqSection";
import { CtaBanner } from "@/components/home/CtaBanner";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CountryGrid />
      <HowItWorks />
      <FaqSection />
      <CtaBanner />
    </>
  );
}
