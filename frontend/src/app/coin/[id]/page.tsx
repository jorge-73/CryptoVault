"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star, DollarSign, BarChart3, Globe, Activity, Layers } from "lucide-react";
import { api } from "@/lib/api";
import { cn, formatPrice, formatMarketCap } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedMount, ErrorState } from "@/components/ui";
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
        <Skeleton className="h-5 w-24 mb-8" />
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-8 w-36" />
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-72 rounded-xl" />
      </div>
    );
  }

  if (error || !coin) {
    return (
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>
        <ErrorState message={error || "Criptomoneda no encontrada"} />
      </div>
    );
  }

  const volumeToCapRatio = coin.total_volume / coin.market_cap;
  const supplyFormatted = coin.circulating_supply
    ? coin.circulating_supply.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "—";

  return (
    <AnimatedMount>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al dashboard
        </Link>

        <div className="flex items-center gap-5 mb-8">
          <div className="relative h-16 w-16 flex-shrink-0">
            <Image
              src={coin.image}
              alt={`Logo de ${coin.name}`}
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
                Rank #{coin.market_cap_rank ?? "—"}
              </span>
            </div>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-3xl sm:text-4xl font-bold tabular-nums">
                {formatPrice(coin.current_price)}
              </span>
              <Badge value={coin.price_change_percentage_24h} className="text-sm px-2 py-0.5" />
            </div>
          </div>

          {user && (
            <button
              onClick={toggleFavorite}
              className={cn(
                "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl border transition-colors hover:scale-105 active:scale-95",
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <StatCard
            label="Capitalización"
            value={formatMarketCap(coin.market_cap)}
            icon={<DollarSign className="h-4 w-4" />}
          />
          <StatCard
            label="Volumen 24h"
            value={formatMarketCap(coin.total_volume)}
            icon={<Activity className="h-4 w-4" />}
          />
          <StatCard
            label="Ranking"
            value={`#${coin.market_cap_rank ?? "—"}`}
            icon={<BarChart3 className="h-4 w-4" />}
          />
          <StatCard
            label="Suministro"
            value={supplyFormatted}
            icon={<Layers className="h-4 w-4" />}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <div className="col-span-2 sm:col-span-4 flex items-center gap-4 rounded-xl border bg-card px-4 py-3 text-sm">
            <span className="text-muted-foreground">Volumen / Capitalización:</span>
            <span className="font-medium tabular-nums">{volumeToCapRatio.toFixed(4)}</span>
            <span className="text-muted-foreground ml-auto">
              Suministro circulante: <span className="font-medium">{supplyFormatted}</span>
            </span>
          </div>
        </div>

        <div className="rounded-xl border bg-card p-4 sm:p-6">
          <PriceChart coinId={coin.id} coinName={coin.name} />
        </div>
      </div>
    </AnimatedMount>
  );
}

