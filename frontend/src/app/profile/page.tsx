"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CryptoCard } from "@/components/crypto/crypto-card";
import { CryptoListSkeleton } from "@/components/crypto/crypto-list-skeleton";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star } from "lucide-react";

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

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Coin[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      api.favorites
        .getAll()
        .then(setFavorites)
        .catch(() => toast.error("Error al cargar favoritos"))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const removeFavorite = async (id: string) => {
    try {
      await api.favorites.remove(id);
      setFavorites((prev) => prev.filter((c) => c.id !== id));
      toast.success("Eliminado de favoritos");
    } catch {
      toast.error("Error al eliminar favorito");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="h-9 w-48 rounded bg-muted animate-pulse mb-6" />
        <CryptoListSkeleton count={5} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Mis Favoritos</h1>
        <p className="text-muted-foreground mt-1">
          {favorites.length > 0
            ? `${favorites.length} criptomoneda(s) guardada(s)`
            : "Aún no tienes favoritos"}
        </p>
      </div>

      {favorites.length === 0 ? (
        <div className="rounded-xl border bg-card p-12 text-center">
          <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-lg font-semibold mb-2">Sin favoritos</h2>
          <p className="text-muted-foreground mb-6">
            Añade criptomonedas a tu lista desde el dashboard
          </p>
          <button
            onClick={() => router.push("/")}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
          >
            Explorar mercado
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {favorites.map((coin) => (
            <CryptoCard
              key={coin.id}
              coin={coin}
              isFavorite
              onToggleFavorite={removeFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
