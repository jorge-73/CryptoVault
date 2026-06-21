import { HeroSection } from "@/components/landing/hero-section";
import { SocialProof } from "@/components/landing/social-proof";
import { FeaturesSection } from "@/components/landing/features-section";
import { MarketExplorerSection } from "@/components/landing/market-explorer-section";
import { AnalyticsSection } from "@/components/landing/analytics-section";
import { WatchlistSection } from "@/components/landing/watchlist-section";
import { CTASection } from "@/components/landing/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <SocialProof />
      <FeaturesSection />
      <MarketExplorerSection />
      <AnalyticsSection />
      <WatchlistSection />
      <CTASection />
    </>
  );
}
