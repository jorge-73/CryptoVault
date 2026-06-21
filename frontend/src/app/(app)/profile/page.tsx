"use client";

import { useEffect, useState, useMemo } from "react";
import { useTranslations } from "@/lib/use-translations";
import { api } from "@/lib/api";
import { CryptoCard } from "@/components/crypto/crypto-card";
import { CryptoListSkeleton } from "@/components/crypto/crypto-list-skeleton";
import { AnimatedMount, EmptyState } from "@/components/ui";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Star, ArrowUpDown } from "lucide-react";
import type { CoinMarket } from "@/types/crypto";

type SortKey = "name" | "price" | "change24h" | "marketCap";

export default function ProfilePage() {
  const t = useTranslations();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const SORT_OPTIONS: { key: SortKey; label: string }[] = [
    { key: "name", label: t.watchlist.sortName },
    { key: "price", label: t.watchlist.sortPrice },
    { key: "change24h", label: t.watchlist.sortChange24h },
    { key: "marketCap", label: t.watchlist.sortMarketCap },
  ];

  const [favorites, setFavorites] = useState<CoinMarket[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortAsc, setSortAsc] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }

    if (user) {
      api.favorites
        .getAll()
        .then(setFavorites)
        .catch(() => toast.error(t.watchlist.toastLoadError))
        .finally(() => setLoading(false));
    }
  }, [user, authLoading, router]);

  const removeFavorite = async (id: string) => {
    try {
      await api.favorites.remove(id);
      setFavorites((prev) => prev.filter((c) => c.id !== id));
      toast.success(t.watchlist.toastRemoved);
    } catch {
      toast.error(t.watchlist.toastError);
    }
  };

  const sorted = useMemo(() => {
    const list = [...favorites];
    list.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case "name":
          cmp = a.name.localeCompare(b.name);
          break;
        case "price":
          cmp = (a.current_price ?? 0) - (b.current_price ?? 0);
          break;
        case "change24h":
          cmp = (a.price_change_percentage_24h ?? 0) - (b.price_change_percentage_24h ?? 0);
          break;
        case "marketCap":
          cmp = a.market_cap - b.market_cap;
          break;
      }
      return sortAsc ? cmp : -cmp;
    });
    return list;
  }, [favorites, sortKey, sortAsc]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortAsc((prev) => !prev);
    } else {
      setSortKey(key);
      setSortAsc(key === "name");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <Skeleton className="h-9 w-48 rounded mb-6" />
        <CryptoListSkeleton count={5} />
      </div>
    );
  }

  return (
    <AnimatedMount>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">{t.watchlist.title}</h1>
          <p className="text-muted-foreground mt-1">
            {favorites.length > 0
              ? t.watchlist.count(favorites.length)
              : t.watchlist.empty}
          </p>
        </div>

        {favorites.length === 0 ? (
          <EmptyState
            icon={<Star className="h-8 w-8" />}
            title={t.watchlist.emptyTitle}
            description={t.watchlist.emptyDescription}
            action={
              <button
                onClick={() => router.push("/market")}
                className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
              >
                {t.watchlist.exploreButton}
              </button>
            }
          />
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider mr-1">
                {t.watchlist.sortLabel}
              </span>
              {SORT_OPTIONS.map((opt) => {
                const active = sortKey === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => toggleSort(opt.key)}
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap active:scale-95 cursor-pointer ${
                      active
                        ? "bg-accent/10 text-accent"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {opt.label}
                    {active && (
                      <ArrowUpDown className={`h-3 w-3 transition-transform ${sortAsc ? "rotate-180" : ""}`} />
                    )}
                  </button>
                );
              })}
            </div>
            <div className="space-y-3">
              {sorted.map((coin) => (
                <CryptoCard
                  key={coin.id}
                  coin={coin}
                  isFavorite
                  onToggleFavorite={removeFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </AnimatedMount>
  );
}
