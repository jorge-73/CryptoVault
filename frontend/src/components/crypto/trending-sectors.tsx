"use client";

import { TrendingUp } from "lucide-react";
import { cn, formatPercentage } from "@/lib/utils";
import { useTranslations } from "@/lib/use-translations";
import Link from "next/link";

interface TrendingSectorsProps {
  sectors: {
    id: string;
    name: string;
    market_cap_change_24h: number | null;
  }[];
}

export function TrendingSectors({ sectors }: TrendingSectorsProps) {
  const t = useTranslations();
  if (sectors.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-accent" />
        <h2 className="text-lg font-semibold">{t.dashboard.trendingSectors}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
        {sectors.map((sector, i) => {
          const change = sector.market_cap_change_24h;
          const isPositive = change !== null && change >= 0;
          return (
            <Link
              key={sector.id}
              href={`/categories/${sector.id}`}
              className="snap-start flex-shrink-0 w-56 rounded-xl border bg-card p-4 transition-all hover:shadow-lg hover:border-accent/30 hover:-translate-y-0.5 group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-muted-foreground">#{i + 1}</span>
                <span
                  className={cn(
                    "text-sm font-bold tabular-nums font-mono",
                    isPositive ? "text-green" : "text-red"
                  )}
                >
                  {change != null ? formatPercentage(change) : t.badge.na}
                </span>
              </div>
              <h3 className="font-semibold text-sm truncate group-hover:text-accent transition-colors">
                {sector.name}
              </h3>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export function TrendingSectorsSkeleton() {
  return (
    <div className="mb-8">
      <div className="h-6 w-40 rounded bg-muted animate-pulse mb-4" />
      <div className="flex gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="w-56 rounded-xl border bg-card p-4 animate-pulse flex-shrink-0"
          >
            <div className="h-4 w-12 rounded bg-muted mb-3" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
