import { Skeleton } from "@/components/ui/skeleton";
import { MarketTableSkeleton } from "@/components/crypto/market-table";

export default function MarketLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <Skeleton className="h-6 w-32 mb-2" />
      <Skeleton className="h-4 w-64 mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
      <MarketTableSkeleton />
    </div>
  );
}
