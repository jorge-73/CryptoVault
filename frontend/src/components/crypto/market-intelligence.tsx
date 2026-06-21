"use client";

import { cn, formatPercentage } from "@/lib/utils";
import { formatMarketCap, formatNumber } from "@/lib/formatters";
import { useTranslations } from "@/lib/use-translations";
import { BarChart3, BrainCircuit, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";

interface MarketIntelligenceProps {
  btcDominance: number;
  marketCapChange24h: number | null;
  topSectors: {
    id: string;
    name: string;
    market_cap: number | null;
    market_cap_change_24h: number | null;
  }[];
}

export function MarketIntelligence({ btcDominance, marketCapChange24h, topSectors }: MarketIntelligenceProps) {
  const t = useTranslations();
  const sentiment = marketCapChange24h != null
    ? marketCapChange24h >= 0 ? "positive" : "negative"
    : null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
          <BrainCircuit className="h-3.5 w-3.5 text-accent" />
        </div>
        <h2 className="text-lg font-semibold">{t.dashboard.marketIntelligence}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-accent/20">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              {t.dashboard.btcDominance}
            </span>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex items-end justify-between mb-2">
            <span className="text-2xl font-bold tabular-nums">
              {formatNumber(btcDominance)}%
            </span>
            {sentiment && (
              <span className={cn(
                "flex items-center gap-1 text-xs font-medium",
                sentiment === "positive" ? "text-green" : "text-red"
              )}>
                {sentiment === "positive" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {t.dashboard.marketSentiment}
              </span>
            )}
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all"
              style={{ width: `${Math.min(btcDominance, 100)}%` }}
            />
          </div>
        </div>

        {topSectors.map((sector) => {
          const change = sector.market_cap_change_24h;
          const isPositive = change != null && change >= 0;
          return (
            <Link
              key={sector.id}
              href={`/categories/${sector.id}`}
              className="rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-accent/20 hover:-translate-y-0.5 group"
            >
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {sector.name}
              </span>
              <div className="flex items-end justify-between mt-1.5">
                <span className="text-lg font-bold tabular-nums group-hover:text-accent transition-colors">
                  {sector.market_cap != null ? formatMarketCap(sector.market_cap) : "—"}
                </span>
                {change != null && (
                  <span className={cn(
                    "text-xs font-semibold tabular-nums flex-shrink-0 ml-2",
                    isPositive ? "text-green" : "text-red"
                  )}>
                    {formatPercentage(change)}
                  </span>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function MarketIntelligenceSkeleton() {
  return (
    <div className="mb-8">
      <div className="h-6 w-40 rounded bg-muted animate-pulse mb-4" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 animate-pulse">
            <div className="h-3 w-24 rounded bg-muted mb-3" />
            <div className="h-6 w-20 rounded bg-muted mb-2" />
            <div className="h-2 w-full rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
