import { Skeleton } from "@/components/ui/skeleton";
import { MarketIntelligenceSkeleton } from "@/components/crypto/market-intelligence";
import { TrendingCoinsSkeleton } from "@/components/crypto/trending-coins";
import { CryptoListSkeleton } from "@/components/crypto/crypto-list-skeleton";

export default function DashboardLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Skeleton className="h-8 w-48 mb-2" />
      <Skeleton className="h-5 w-72 mb-6" />
      <MarketIntelligenceSkeleton />
      <TrendingCoinsSkeleton />
      <CryptoListSkeleton count={10} />
    </div>
  );
}
