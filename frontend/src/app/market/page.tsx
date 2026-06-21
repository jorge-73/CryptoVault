"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "@/lib/use-translations";
import dynamic from "next/dynamic";
import { api } from "@/lib/api";
import { MarketOverview } from "@/components/crypto/market-overview";
import { SectionHeader, AnimatedMount } from "@/components/ui";
import { ErrorState } from "@/components/ui/error-state";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

const MarketTable = dynamic(
  () => import("@/components/crypto/market-table").then((m) => ({ default: m.MarketTable })),
  { ssr: false, loading: () => <div className="space-y-3 mt-8">
    {Array.from({ length: 5 }).map((_, i) => (
      <Skeleton key={i} className="h-16 rounded-xl" />
    ))}
  </div> }
);

interface MarketCoin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number;
  market_cap_rank: number | null;
  price_change_percentage_24h: number | null;
  price_change_percentage_7d_in_currency: number | null;
  total_volume: number;
}

export default function MarketPage() {
  const t = useTranslations();
  const [coins, setCoins] = useState<MarketCoin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  const fetchCoins = useCallback(() => {
    setLoading(true);
    setError(null);
    api.crypto
      .getMarkets("usd", 100)
      .then(setCoins)
      .catch(() => setError(t.market.errorLoading))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchCoins(); }, [fetchCoins]);

  useEffect(() => {
    if (user) {
      api.favorites
        .getAll()
        .then((favs) => setFavorites(new Set(favs.map((f: any) => f.id))))
        .catch(() => {});
    }
  }, [user]);

  const toggleFavorite = useCallback(async (id: string) => {
    const isFav = favorites.has(id);
    try {
      if (isFav) {
        await api.favorites.remove(id);
        setFavorites((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        toast.success(t.market.toastRemoved);
      } else {
        await api.favorites.add(id);
        setFavorites((prev) => new Set(prev).add(id));
        toast.success(t.market.toastAdded);
      }
    } catch {
      toast.error(t.market.toastError);
    }
  }, [favorites]);

  return (
    <AnimatedMount>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <SectionHeader
          title={t.market.title}
          description={t.market.subtitle}
          className="mb-6"
        />

        <MarketOverview />

        {error && (
          <div className="mb-6">
            <ErrorState message={error} onRetry={fetchCoins} />
          </div>
        )}

        <section className="mt-8">
          <MarketTable
            coins={coins}
            isFavorite={(id) => favorites.has(id)}
            onToggleFavorite={user ? toggleFavorite : undefined}
            loading={loading}
            error={error}
            onRetry={fetchCoins}
          />
        </section>
      </div>
    </AnimatedMount>
  );
}
