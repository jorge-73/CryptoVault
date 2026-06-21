"use client";

import { StatCard } from "@/components/ui/stat-card";
import { useTranslations } from "@/lib/use-translations";
import { formatNumber, formatMarketCap } from "@/lib/formatters";
import { DollarSign, Activity, BarChart3, Layers } from "lucide-react";

interface SectorOverviewProps {
  totalMarketCap: number;
  totalVolume24h: number;
  btcDominance: number;
  sectorCount: number;
}

export function SectorOverview({
  totalMarketCap,
  totalVolume24h,
  btcDominance,
  sectorCount,
}: SectorOverviewProps) {
  const t = useTranslations();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      <StatCard
        label={t.categories.capTotalMercado}
        value={formatMarketCap(totalMarketCap)}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <StatCard
        label={t.categories.volume24h}
        value={formatMarketCap(totalVolume24h)}
        icon={<Activity className="h-4 w-4" />}
      />
      <StatCard
        label={t.categories.dominanciaBTC}
        value={`${formatNumber(btcDominance)}%`}
        icon={<BarChart3 className="h-4 w-4" />}
      />
      <StatCard
        label={t.categories.sectoresActivos}
        value={formatNumber(sectorCount)}
        icon={<Layers className="h-4 w-4" />}
      />
    </div>
  );
}

export function SectorOverviewSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="rounded-xl border bg-card p-4 animate-pulse">
          <div className="h-3 w-20 rounded bg-muted mb-2" />
          <div className="h-5 w-28 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}
