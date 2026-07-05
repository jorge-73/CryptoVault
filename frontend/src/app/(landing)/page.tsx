import { HeroSection } from "@/components/landing/hero-section";
import { MarketTicker } from "@/components/landing/market-ticker";
import { BentoFeatures } from "@/components/landing/bento-features";
import { PortfolioSection } from "@/components/landing/portfolio-section";
import { DemoSection } from "@/components/landing/demo-section";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <MarketTicker />
      <BentoFeatures />
      <PortfolioSection />
      <DemoSection />
      <CTASection />
    </>
  );
}
