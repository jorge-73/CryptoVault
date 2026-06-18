"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { api } from "@/lib/api";
import { cn, formatPrice, formatPercentage, formatMarketCap } from "@/lib/utils";
import { PriceChart } from "@/components/crypto/price-chart";
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
  circulating_supply: number;
}

export default function CoinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.crypto
      .getMarkets("usd", 250)
      .then((coins) => {
        const found = coins.find((c: Coin) => c.id === id);
        if (found) {
          setCoin(found);
        } else {
          setError("Criptomoneda no encontrada");
        }
      })
      .catch(() => setError("Error al cargar la criptomoneda"))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user && coin) {
      api.favorites
        .getAll()
        .then((favs) => setIsFavorite(favs.some((f: any) => f.id === coin.id)))
        .catch(() => {});
    }
  }, [user, coin]);

  const toggleFavorite = async () => {
    if (!coin) return;
    try {
      if (isFavorite) {
        await api.favorites.remove(coin.id);
        setIsFavorite(false);
        toast.success("Eliminado de favoritos");
      } else {
        await api.favorites.add(coin.id);
        setIsFavorite(true);
        toast.success("Añadido a favoritos");
      }
    } catch {
      toast.error("Error al actualizar favoritos");
    }
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-24 rounded bg-muted" />
          <div className="h-64 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>
        <div className="rounded-xl border border-red/20 bg-red/5 p-4 text-red text-sm">
          {error || "Criptomoneda no encontrada"}
        </div>
      </div>
    );
  }

  const isPositive = coin.price_change_percentage_24h >= 0;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al dashboard
      </Link>

      <div className="flex items-center gap-4 mb-8">
        <div className="relative h-14 w-14 flex-shrink-0">
          <Image
            src={coin.image}
            alt={`Logo de ${coin.name}`}
            fill
            unoptimized
            className="rounded-full object-contain"
            sizes="56px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold truncate">
              {coin.name}
            </h1>
            <span className="text-lg text-muted-foreground uppercase">
              {coin.symbol}
            </span>
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-3xl font-bold">
              {formatPrice(coin.current_price)}
            </span>
            <span
              className={cn(
                "text-lg font-medium",
                isPositive ? "text-green" : "text-red"
              )}
            >
              {formatPercentage(coin.price_change_percentage_24h)}
            </span>
          </div>
        </div>

        {user && (
          <button
            onClick={toggleFavorite}
            className={cn(
              "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border transition-colors",
              isFavorite
                ? "border-yellow-500/30 text-yellow-500 hover:bg-yellow-500/10"
                : "border-border text-muted-foreground hover:text-yellow-500 hover:border-yellow-500/30"
            )}
            aria-label={
              isFavorite
                ? `Quitar ${coin.name} de favoritos`
                : `Añadir ${coin.name} a favoritos`
            }
          >
            <Star className={cn("h-5 w-5", isFavorite && "fill-current")} />
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mb-8">
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Capitalización</p>
          <p className="font-semibold mt-1">{formatMarketCap(coin.market_cap)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Volumen 24h</p>
          <p className="font-semibold mt-1">{formatMarketCap(coin.total_volume)}</p>
        </div>
        <div className="rounded-xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Ranking</p>
          <p className="font-semibold mt-1">
            #{coin.market_cap_rank ?? "—"}
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-4 sm:p-6">
        <PriceChart coinId={coin.id} coinName={coin.name} />
      </div>
    </div>
  );
}
