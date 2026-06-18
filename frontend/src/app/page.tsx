"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CryptoCard } from "@/components/crypto/crypto-card";
import { CryptoListSkeleton } from "@/components/crypto/crypto-list-skeleton";
import { MarketOverview } from "@/components/crypto/market-overview";
import { ErrorState } from "@/components/ui/error-state";
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
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Precios de criptomonedas en tiempo real
        </p>
      </div>

      <MarketOverview />

      {error && (
        <div className="mb-6">
          <ErrorState message={error} onRetry={fetchCoins} />
        </div>
      )}

      {loading ? (
        <CryptoListSkeleton count={10} />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {coins.map((coin) => (
            <CryptoCard
              key={coin.id}
              coin={coin}
              isFavorite={favorites.has(coin.id)}
              onToggleFavorite={toggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
