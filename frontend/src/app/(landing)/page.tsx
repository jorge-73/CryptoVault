import { HeroSection } from "@/components/landing/hero-section";
import { MarketTicker } from "@/components/landing/market-ticker";
import { BentoFeatures } from "@/components/landing/bento-features";
import { MarketPreview } from "@/components/landing/market-preview";
import { AnalyticsSection } from "@/components/landing/analytics-section";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <MarketTicker />
      <BentoFeatures />
      <MarketPreview />
      <AnalyticsSection />
      <CTASection />
    </>
  );
}
