import { StatCard } from "@/components/ui/stat-card";
import { Badge } from "@/components/ui/badge";
import { formatMarketCap, formatPercentage } from "@/lib/utils";
import { DollarSign, Activity, BarChart3, Layers } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { CoinCategory } from "@/types/crypto";

interface CategoryDetailHeaderProps {
  category: CoinCategory;
  coinCount: number;
}

export function CategoryDetailHeader({ category, coinCount }: CategoryDetailHeaderProps) {
  return (
    <div>
      <Link
        href="/categories"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver a Crypto Sectors
      </Link>

      <div className="mb-6">
        <div className="flex items-center gap-3 mb-1">
          <h1 className="text-2xl sm:text-3xl font-bold">{category.name}</h1>
          <Badge value={category.market_cap_change_24h} className="text-sm px-2 py-0.5" />
        </div>
        {category.content && (
          <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
            {category.content}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <StatCard
          label="Capitalización"
          value={formatMarketCap(category.market_cap)}
          icon={<DollarSign className="h-4 w-4" />}
        />
        <StatCard
          label="Volumen 24h"
          value={formatMarketCap(category.volume_24h)}
          icon={<Activity className="h-4 w-4" />}
        />
        <StatCard
          label="Monedas"
          value={coinCount.toLocaleString()}
          icon={<Layers className="h-4 w-4" />}
        />
      </div>
    </div>
  );
}
