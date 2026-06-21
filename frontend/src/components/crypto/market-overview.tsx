"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "@/lib/use-translations";
import { formatNumber, formatMarketCap } from "@/lib/formatters";
import { Globe, DollarSign, BarChart3, Activity } from "lucide-react";

interface GlobalData {
  total_market_cap: number;
  total_volume_24h: number;
  btc_dominance: number;
  market_cap_change_24h: number;
  active_cryptocurrencies: number;
}

export function MarketOverview() {
  const t = useTranslations();
  const [data, setData] = useState<GlobalData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.crypto
      .getGlobal()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
      <StatCard
        label={t.dashboard.totalMarketCap}
        value={formatMarketCap(data.total_market_cap)}
        trend={data.market_cap_change_24h}
        icon={<DollarSign className="h-4 w-4" />}
      />
      <StatCard
        label={t.dashboard.volume24h}
        value={formatMarketCap(data.total_volume_24h)}
        icon={<Activity className="h-4 w-4" />}
      />
      <StatCard
        label={t.dashboard.btcDominance}
        value={`${formatNumber(data.btc_dominance)}%`}
        icon={<BarChart3 className="h-4 w-4" />}
      />
      <StatCard
        label={t.dashboard.activeCryptos}
        value={formatNumber(data.active_cryptocurrencies)}
        icon={<Globe className="h-4 w-4" />}
      />
    </div>
  );
}
