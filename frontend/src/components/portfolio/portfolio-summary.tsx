"use client";

import { useTranslations } from "@/lib/use-translations";
import { formatPrice, formatPercentage, formatNumber } from "@/lib/formatters";
import { Wallet, TrendingUp, TrendingDown, PieChart } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioSummaryProps {
  totalValue: number;
  totalPnl: number;
  totalRoi: number | null;
  holdingsCount: number;
}

export function PortfolioSummary({ totalValue, totalPnl, totalRoi, holdingsCount }: PortfolioSummaryProps) {
  const t = useTranslations();

  const cards = [
    {
      label: t.portfolio.summary.totalValue,
      value: formatPrice(totalValue),
      icon: Wallet,
      accent: true,
    },
    {
      label: t.portfolio.summary.totalPnl,
      value: totalPnl >= 0 ? formatPrice(totalPnl) : `-${formatPrice(Math.abs(totalPnl))}`,
      icon: totalPnl >= 0 ? TrendingUp : TrendingDown,
      accent: false,
      positive: totalPnl >= 0,
    },
    {
      label: t.portfolio.summary.totalRoi,
      value: totalRoi != null ? formatPercentage(totalRoi) : "—",
      icon: PieChart,
      accent: false,
      positive: (totalRoi ?? 0) >= 0,
    },
    {
      label: t.portfolio.summary.holdings,
      value: t.portfolio.summary.holdingsCount(holdingsCount),
      icon: PieChart,
      accent: false,
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" suppressHydrationWarning>
      {cards.map((card) => {
        const Icon = card.icon;
        const isPositive = card.positive ?? true;
        return (
          <div
            key={card.label}
            className={cn(
              "rounded-2xl border p-4 transition-all duration-200 hover:shadow-md",
              card.accent
                ? "border-accent/30 bg-accent/5"
                : "border-border bg-card/50"
            )}
            suppressHydrationWarning
          >
            <div className="flex items-center gap-2 mb-2">
              <Icon className={cn(
                "h-4 w-4",
                card.accent ? "text-accent" : isPositive ? "text-green" : "text-red"
              )} />
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </div>
            <p className={cn(
              "text-lg font-semibold",
              card.accent ? "text-accent" : isPositive ? "text-foreground" : "text-red"
            )}>
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
