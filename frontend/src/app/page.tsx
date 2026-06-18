"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CryptoCard } from "@/components/crypto/crypto-card";
import { CryptoListSkeleton } from "@/components/crypto/crypto-list-skeleton";
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

  useEffect(() => {
    api.crypto
      .getMarkets()
      .then(setCoins)
      .catch(() => setError("Error al cargar las criptomonedas"))
      .finally(() => setLoading(false));
  }, []);

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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Precios de criptomonedas en tiempo real
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-red/20 bg-red/5 p-4 text-red text-sm">
          {error}
        </div>
      )}

      {loading ? (
        <CryptoListSkeleton count={10} />
      ) : (
        <div className="space-y-3">
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
