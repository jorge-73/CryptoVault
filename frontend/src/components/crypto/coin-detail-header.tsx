"use client";

import { useTranslations } from "@/lib/use-translations";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import type { CoinDetail } from "@/types/crypto";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface CoinDetailHeaderProps {
  coin: CoinDetail;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  isAuthenticated: boolean;
}

export function CoinDetailHeader({
  coin,
  isFavorite,
  onToggleFavorite,
  isAuthenticated,
}: CoinDetailHeaderProps) {
  const t = useTranslations();

  return (
    <div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        {t.coinDetail.backLink}
      </Link>

      <div className="flex items-center gap-5 mb-8">
        <div className="relative h-16 w-16 flex-shrink-0">
          <Image
            src={coin.image}
            alt={t.coinDetail.imageAlt(coin.name)}
            fill
            unoptimized
            className="rounded-full object-contain"
            sizes="64px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">
              {coin.name}
            </h1>
            <span className="text-base sm:text-lg text-muted-foreground uppercase tracking-wide">
              {coin.symbol}
            </span>
            <span className="hidden sm:inline text-xs text-muted-foreground">
              {t.coinDetail.stats.ranking} #{coin.market_cap_rank ?? t.badge.na}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-3xl sm:text-4xl font-bold tabular-nums">
              {formatPrice(coin.current_price ?? 0)}
            </span>
            <Badge value={coin.price_change_percentage_24h ?? 0} className="text-sm px-2 py-0.5" />
          </div>
        </div>

        {isAuthenticated && (
          <button
            onClick={onToggleFavorite}
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border transition-colors hover:scale-105 active:scale-95",
              isFavorite
                ? "border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                : "border-border text-muted-foreground hover:text-yellow-500 hover:border-yellow-500/30"
            )}
            aria-label={
              isFavorite
                ? t.coinDetail.favoriteRemove(coin.name)
                : t.coinDetail.favoriteAdd(coin.name)
            }
          >
            <Star className={cn("h-5 w-5", isFavorite && "fill-current")} />
          </button>
        )}
      </div>
    </div>
  );
}
