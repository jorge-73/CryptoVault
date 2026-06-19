import { SectionHeader } from "@/components/ui";
import { MarketTableSkeleton } from "@/components/crypto/market-table";

export default function MarketLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="h-6 w-32 rounded bg-muted animate-pulse mb-2" />
      <div className="h-4 w-64 rounded bg-muted animate-pulse mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 animate-pulse">
            <div className="h-3 w-20 rounded bg-muted mb-2" />
            <div className="h-5 w-28 rounded bg-muted" />
          </div>
        ))}
      </div>
      <MarketTableSkeleton />
    </div>
  );
}
