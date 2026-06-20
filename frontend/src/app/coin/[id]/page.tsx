"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { ArrowLeft, DollarSign, Activity, BarChart3, Layers, PieChart, Hash } from "lucide-react";
import { api } from "@/lib/api";
import { formatPrice, formatMarketCap } from "@/lib/utils";
import { StatCard } from "@/components/ui/stat-card";
import { Skeleton } from "@/components/ui/skeleton";
import { AnimatedMount, ErrorState } from "@/components/ui";
import { CoinDetailHeader } from "@/components/crypto/coin-detail-header";
import { CoinAbout } from "@/components/crypto/coin-about";

const PriceChart = dynamic(
  () => import("@/components/crypto/price-chart").then((m) => ({ default: m.PriceChart })),
  { ssr: false, loading: () => <Skeleton className="h-64 rounded-xl" /> }
);
import { useAuth } from "@/providers/auth-provider";
import { toast } from "sonner";
import type { CoinDetail } from "@/types/crypto";

export default function CoinDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [coin, setCoin] = useState<CoinDetail | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"overview" | "about">("overview");

  useEffect(() => {
    if (!id) return;
    setLoading(true);

    api.crypto.getCoinById(id)
      .then((detail) => {
        if (detail) {
          setCoin(detail);
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

  const supplyFormatted = coin.circulating_supply
    ? coin.circulating_supply.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "—";

  const totalSupplyFormatted = coin.total_supply
    ? coin.total_supply.toLocaleString("en-US", { maximumFractionDigits: 0 })
    : "—";

  const volumeToCapRatio = coin.market_cap > 0
    ? (coin.total_volume / coin.market_cap).toFixed(4)
    : "—";

  const stats = [
    {
      label: "Capitalización",
      value: formatMarketCap(coin.market_cap),
      icon: <DollarSign className="h-4 w-4" />,
    },
    {
      label: "Volumen 24h",
      value: formatMarketCap(coin.total_volume),
      icon: <Activity className="h-4 w-4" />,
    },
    {
      label: "Ranking",
      value: `#${coin.market_cap_rank ?? "—"}`,
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      label: "Suministro circ.",
      value: supplyFormatted,
      icon: <Layers className="h-4 w-4" />,
    },
  ];

  const extraStats = [
    {
      label: "Suministro total",
      value: totalSupplyFormatted,
      icon: <PieChart className="h-4 w-4" />,
    },
    {
      label: "Suministro máx.",
      value: coin.max_supply
        ? coin.max_supply.toLocaleString("en-US", { maximumFractionDigits: 0 })
        : "—",
      icon: <Hash className="h-4 w-4" />,
    },
  ];

  return (
    <AnimatedMount>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
        <CoinDetailHeader
          coin={coin}
          isFavorite={isFavorite}
          onToggleFavorite={toggleFavorite}
          isAuthenticated={!!user}
        />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          {extraStats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
          <div className="col-span-2 flex items-center gap-4 rounded-xl border bg-card px-4 py-3 text-sm">
            <span className="text-muted-foreground">Vol / Cap:</span>
            <span className="font-medium tabular-nums">{volumeToCapRatio}</span>
          </div>
        </div>

        <div className="flex gap-1 mb-6 border-b">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px active:scale-95 cursor-pointer ${
              activeTab === "overview"
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Gráfico
          </button>
          <button
            onClick={() => setActiveTab("about")}
            className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px active:scale-95 cursor-pointer ${
              activeTab === "about"
                ? "border-accent text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Acerca de
          </button>
        </div>

        {activeTab === "overview" && (
          <div className="rounded-xl border bg-card p-4 sm:p-6">
            <PriceChart coinId={coin.id} coinName={coin.name} />
          </div>
        )}

        {activeTab === "about" && (
          <CoinAbout
            description={coin.description}
            homepage={coin.homepage}
            explorer={coin.explorer}
          />
        )}
      </div>
    </AnimatedMount>
  );
}
