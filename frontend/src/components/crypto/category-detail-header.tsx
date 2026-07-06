"use client";

import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { formatMarketCap, formatPercentage } from "@/lib/utils";
import { formatNumber } from "@/lib/formatters";
import { formatCategoryDescription } from "@/lib/crypto-transform";
import { useTranslations } from "@/lib/use-translations";
import { DollarSign, Activity, BarChart3, Layers } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CoinCategory } from "@/types/crypto";

interface CategoryDetailHeaderProps {
  category: CoinCategory;
  coinCount: number;
}

export function CategoryDetailHeader({ category, coinCount }: CategoryDetailHeaderProps) {
  const t = useTranslations();
  const description = formatCategoryDescription(category.content);

  return (
    <div>
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.categories.backLink}
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold">{category.name}</h1>
          <Badge value={category.market_cap_change_24h} size="lg" />
        </div>
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <StatCard
          label={t.categories.marketCap}
          value={formatMarketCap(category.market_cap)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label={t.categories.volume24h}
          value={formatMarketCap(category.volume_24h)}
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          label={t.categories.coins}
          value={formatNumber(coinCount)}
          icon={<Layers className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
