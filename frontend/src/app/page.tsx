"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "@/lib/use-translations";
import { api } from "@/lib/api";
import { CryptoCard } from "@/components/crypto/crypto-card";
import { CryptoListSkeleton } from "@/components/crypto/crypto-list-skeleton";
import { MarketOverview } from "@/components/crypto/market-overview";
import { TrendingCoins, TrendingCoinsSkeleton } from "@/components/crypto/trending-coins";
import { MarketIntelligence, MarketIntelligenceSkeleton } from "@/components/crypto/market-intelligence";
import { ErrorState, AnimatedMount, StaggerGrid, StaggerItem, SectionHeader } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import type { CoinCategory } from "@/types/crypto";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number | null;
  price_change_percentage_24h: number;
  total_volume: number;
}

export default function DashboardPage() {
  const t = useTranslations();
  const [coins, setCoins] = useState<Coin[]>([]);
  const [categories, setCategories] = useState<CoinCategory[]>([]);
  const [globalData, setGlobalData] = useState<{ btc_dominance: number; market_cap_change_24h: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const trendingGainers = useMemo(
    () =>
      [...coins]
        .filter((c) => (c.price_change_percentage_24h ?? 0) > 0)
        .sort((a, b) => (b.price_change_percentage_24h ?? 0) - (a.price_change_percentage_24h ?? 0))
        .slice(0, 3),
    [coins]
  );

  const trendingLosers = useMemo(
    () =>
      [...coins]
        .filter((c) => (c.price_change_percentage_24h ?? 0) < 0)
        .sort((a, b) => (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0))
        .slice(0, 3),
    [coins]
  );

  const topSectors = useMemo(
    () =>
      [...categories]
        .sort((a, b) => ((b.market_cap ?? 0) - (a.market_cap ?? 0)))
        .slice(0, 3),
    [categories]
  );

  const fetchData = () => {
    setLoading(true);
    setError(null);
    Promise.all([
      api.crypto.getMarkets(),
      api.crypto.getCategories().catch(() => [] as CoinCategory[]),
      api.crypto.getGlobal().catch(() => null),
    ])
      .then(([coinsData, catsData, global]) => {
        setCoins(coinsData);
        setCategories(catsData as CoinCategory[]);
        if (global) setGlobalData(global as any);
      })
      .catch(() => setError(t.dashboard.errorLoading))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchData(); }, []);

  useEffect(() => {
    if (user) {
      api.favorites
        .getAll()
        .then((favs) => setFavorites(new Set(favs.map((f: any) => f.id))))
        .catch(() => {});
    }
  }, [user]);

  const toggleFavorite = async (id: string) => {
    const isFav = favorites.has(id);
    try {
      if (isFav) {
        await api.favorites.remove(id);
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success(t.coinDetail.toastRemoved);
      } else {
        await api.favorites.add(id);
        setFavorites((prev) => new Set(prev).add(id));
        toast.success(t.coinDetail.toastAdded);
      }
    } catch {
      toast.error(t.coinDetail.toastError);
    }
  };

  return (
    <AnimatedMount>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <SectionHeader
          title={t.dashboard.title}
          description={t.dashboard.subtitle}
          className="mb-6"
        />

        <MarketOverview />

        {error && (
          <div className="mb-6">
            <ErrorState message={error} onRetry={fetchData} />
          </div>
        )}

        {loading ? (
          <>
            <MarketIntelligenceSkeleton />
            <TrendingCoinsSkeleton />
            <CryptoListSkeleton count={10} />
          </>
        ) : (
          <>
            {globalData && (
              <MarketIntelligence
                btcDominance={globalData.btc_dominance}
                marketCapChange24h={globalData.market_cap_change_24h}
                topSectors={topSectors}
              />
            )}
            <TrendingCoins gainers={trendingGainers} losers={trendingLosers} />
            <section>
              <SectionHeader
                title={t.dashboard.allCoins}
                description={t.dashboard.coinsCount(coins.length)}
                className="mb-4"
              />
              <StaggerGrid className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {coins.map((coin) => (
                  <StaggerItem key={coin.id}>
                    <CryptoCard
                      coin={coin}
                      isFavorite={favorites.has(coin.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  </StaggerItem>
                ))}
              </StaggerGrid>
            </section>
          </>
        )}
      </div>
    </AnimatedMount>
  );
}
