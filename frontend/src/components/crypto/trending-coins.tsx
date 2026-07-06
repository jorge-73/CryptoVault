"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/utils";
import { useTranslations } from "@/lib/use-translations";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface TrendingCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number | null;
  price_change_percentage_24h: number | null;
}

interface TrendingCoinsProps {
  gainers: TrendingCoin[];
  losers: TrendingCoin[];
}

function TrendingCoinCard({ coin, isLoser }: { coin: TrendingCoin; isLoser?: boolean }) {
  return (
    <Link
      href={`/coin/${coin.id}`}
      className="flex items-center gap-3 rounded-xl border bg-card p-3 transition-all hover:shadow-md hover:border-accent/20 hover:-translate-y-0.5 group"
    >
      <div className="relative h-8 w-8 flex-shrink-0">
        {coin.image ? (
          <Image
            src={coin.image}
            alt=""
            fill
            unoptimized
            className="rounded-full object-contain"
            sizes="32px"
          />
        ) : (
          <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">
            {coin.symbol[0].toUpperCase()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-medium text-sm truncate group-hover:text-accent transition-colors">
            {coin.name}
          </span>
          <span className="text-xs text-muted-foreground uppercase flex-shrink-0">
            {coin.symbol}
          </span>
        </div>
        <p className="text-xs font-medium tabular-nums font-mono">
          {formatPrice(coin.current_price)}
        </p>
      </div>
      <Badge value={coin.price_change_percentage_24h} className="flex-shrink-0" />
    </Link>
  );
}

export function TrendingCoins({ gainers, losers }: TrendingCoinsProps) {
  const t = useTranslations();
  if (gainers.length === 0 && losers.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-accent/10">
          {gainers.length > 0 ? (
            <TrendingUp className="h-3.5 w-3.5 text-green" />
          ) : (
            <Minus className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
        <h2 className="text-lg font-semibold">{t.dashboard.trending}</h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {gainers.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingUp className="h-3.5 w-3.5 text-green" />
              <span className="text-xs font-medium text-green uppercase tracking-wider">
                {t.dashboard.gainers}
              </span>
            </div>
            <div className="space-y-2">
              {gainers.map((coin) => (
                <TrendingCoinCard key={coin.id} coin={coin} />
              ))}
            </div>
          </div>
        )}

        {losers.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <TrendingDown className="h-3.5 w-3.5 text-red" />
              <span className="text-xs font-medium text-red uppercase tracking-wider">
                {t.dashboard.losers}
              </span>
            </div>
            <div className="space-y-2">
              {losers.map((coin) => (
                <TrendingCoinCard key={coin.id} coin={coin} isLoser />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

export function TrendingCoinsSkeleton() {
  return (
    <div className="mb-8">
      <div className="h-6 w-40 rounded bg-muted animate-pulse mb-4" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border bg-card p-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
              <div className="h-5 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border bg-card p-3 animate-pulse">
              <div className="h-8 w-8 rounded-full bg-muted" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 w-24 rounded bg-muted" />
                <div className="h-3 w-16 rounded bg-muted" />
              </div>
              <div className="h-5 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
