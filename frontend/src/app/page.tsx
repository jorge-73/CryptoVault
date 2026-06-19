"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { CryptoCard } from "@/components/crypto/crypto-card";
import { CryptoListSkeleton } from "@/components/crypto/crypto-list-skeleton";
import { MarketOverview } from "@/components/crypto/market-overview";
import { TrendingCoins, TrendingCoinsSkeleton } from "@/components/crypto/trending-coins";
import { ErrorState, AnimatedMount, StaggerGrid, StaggerItem, SectionHeader } from "@/components/ui";
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";

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
  const [coins, setCoins] = useState<Coin[]>([]);
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

  const fetchCoins = () => {
    setLoading(true);
    setError(null);
    api.crypto
      .getMarkets()
      .then(setCoins)
      .catch(() => setError("Error al cargar las criptomonedas"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCoins(); }, []);

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
        toast.success("Eliminado de favoritos");
      } else {
        await api.favorites.add(id);
        setFavorites((prev) => new Set(prev).add(id));
        toast.success("Añadido a favoritos");
      }
    } catch {
      toast.error("Error al actualizar favoritos");
    }
  };

  return (
    <AnimatedMount>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <SectionHeader
          title="Crypto Market"
          description="Precios, tendencias y datos del mercado en tiempo real"
          className="mb-6"
        />

        <MarketOverview />

        {error && (
          <div className="mb-6">
            <ErrorState message={error} onRetry={fetchCoins} />
          </div>
        )}

        {loading ? (
          <>
            <TrendingCoinsSkeleton />
            <CryptoListSkeleton count={10} />
          </>
        ) : (
          <>
            <TrendingCoins gainers={trendingGainers} losers={trendingLosers} />
            <section>
              <SectionHeader
                title="Todas las Criptomonedas"
                description={`${coins.length} monedas ordenadas por capitalización de mercado`}
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
