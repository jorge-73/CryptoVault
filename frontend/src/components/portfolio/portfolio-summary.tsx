"use client";

import { useTranslations } from "@/lib/use-translations";
import { formatPrice, formatPercentage } from "@/lib/formatters";
import { Wallet, DollarSign, TrendingUp, TrendingDown, Percent } from "lucide-react";
import { cn } from "@/lib/utils";

interface PortfolioSummaryProps {
  totalValue: number;
  totalCostBasis: number;
  totalPnl: number;
  totalRoi: number | null;
}

type CardTheme = "accent" | "neutral" | "positive" | "negative";

const cardStyles = {
  base: "rounded-2xl border p-5 transition-all duration-200 hover:shadow-md flex flex-col justify-between",
  label: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
  value: "text-xl font-semibold font-mono tracking-tight mt-1.5",
  iconWrap: "flex items-center justify-between",
};

function cardClass(theme: CardTheme): string {
  switch (theme) {
    case "accent": return "border-accent/30 bg-accent/5";
    case "positive": return "border-green/20 bg-green/5";
    case "negative": return "border-red/20 bg-red/5";
    default: return "border-border bg-card/50";
  }
}

function iconClass(theme: CardTheme): string {
  switch (theme) {
    case "accent": return "text-accent";
    case "positive": return "text-green";
    case "negative": return "text-red";
    default: return "text-muted-foreground";
  }
}

function valueClass(theme: CardTheme): string {
  switch (theme) {
    case "accent": return "text-accent";
    case "positive": return "text-green";
    case "negative": return "text-red";
    default: return "text-foreground";
  }
}

export function PortfolioSummary({ totalValue, totalCostBasis, totalPnl, totalRoi }: PortfolioSummaryProps) {
  const t = useTranslations();

  const cards: { label: string; value: string; icon: React.ComponentType<{ className?: string }>; theme: CardTheme }[] = [
    {
      label: t.portfolio.summary.totalValue,
      value: formatPrice(totalValue),
      icon: Wallet,
      theme: "accent",
    },
    {
      label: t.portfolio.summary.totalInvested,
      value: formatPrice(totalCostBasis),
      icon: DollarSign,
      theme: "neutral",
    },
    {
      label: t.portfolio.summary.totalPnl,
      value: totalPnl >= 0 ? `+${formatPrice(totalPnl)}` : `-${formatPrice(Math.abs(totalPnl))}`,
      icon: totalPnl >= 0 ? TrendingUp : TrendingDown,
      theme: totalPnl >= 0 ? "positive" : "negative",
    },
    {
      label: t.portfolio.summary.totalRoi,
      value: totalRoi != null ? formatPercentage(totalRoi) : "—",
      icon: Percent,
      theme: totalRoi != null && totalRoi >= 0 ? "positive" : "negative",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" suppressHydrationWarning>
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className={cn(cardStyles.base, cardClass(card.theme))}
            suppressHydrationWarning
          >
            <div className={cardStyles.iconWrap}>
              <span className={cardStyles.label}>{card.label}</span>
              <Icon className={cn("h-4 w-4 shrink-0", iconClass(card.theme))} />
            </div>
            <p className={cn(cardStyles.value, valueClass(card.theme))}>
              {card.value}
            </p>
          </div>
        );
      })}
    </div>
  );
}
