"use client";

import { useEffect, useState, useMemo } from "react";
import { api } from "@/lib/api";
import { CategoryCard } from "@/components/crypto/category-card";
import { SectorOverview, SectorOverviewSkeleton } from "@/components/crypto/sector-overview";
import { TrendingSectors, TrendingSectorsSkeleton } from "@/components/crypto/trending-sectors";
import { AnimatedMount } from "@/components/ui";
import { ErrorState } from "@/components/ui/error-state";
import { EmptyState } from "@/components/ui/empty-state";
import { ArrowUpDown, Search, LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CoinCategory } from "@/types/crypto";
import { toast } from "sonner";

type SortKey = "market_cap" | "market_cap_change_24h";
type SortDir = "desc" | "asc";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CoinCategory[]>([]);
  const [globalData, setGlobalData] = useState<{
    total_market_cap: number;
    total_volume_24h: number;
    btc_dominance: number;
    active_cryptocurrencies: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>("market_cap");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api.crypto.getCategories(),
      api.crypto.getGlobal().catch(() => null),
    ])
      .then(([cats, global]) => {
        if (cancelled) return;
        setCategories(cats as CoinCategory[]);
        setGlobalData(global);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Error al cargar los sectores");
        toast.error("Error al cargar los sectores");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let list = categories;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((c) => c.name.toLowerCase().includes(q));
    }
    return [...list].sort((a, b) => {
      const aVal = a[sortKey] ?? 0;
      const bVal = b[sortKey] ?? 0;
      return sortDir === "desc" ? bVal - aVal : aVal - bVal;
    });
  }, [categories, query, sortKey, sortDir]);

  const trending = useMemo(
    () =>
      [...categories]
        .filter((c) => c.market_cap_change_24h != null)
        .sort((a, b) => (b.market_cap_change_24h ?? 0) - (a.market_cap_change_24h ?? 0))
        .slice(0, 4),
    [categories]
  );

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "desc" ? "asc" : "desc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  }

  if (error) {
    return (
      <AnimatedMount>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      </AnimatedMount>
    );
  }

  return (
    <AnimatedMount>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Crypto Sectors</h1>
          <p className="text-muted-foreground mt-1">
            Explora los principales sectores del mercado crypto
          </p>
        </div>

        {loading ? (
          <>
            <SectorOverviewSkeleton />
            <TrendingSectorsSkeleton />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card p-5 animate-pulse">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-9 w-9 rounded-full bg-muted" />
                    <div className="h-4 w-28 rounded bg-muted" />
                  </div>
                  <div className="h-3 w-full rounded bg-muted mb-1" />
                  <div className="h-3 w-3/4 rounded bg-muted mb-4" />
                  <div className="h-4 w-20 rounded bg-muted" />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {globalData && (
              <SectorOverview
                totalMarketCap={globalData.total_market_cap}
                totalVolume24h={globalData.total_volume_24h}
                btcDominance={globalData.btc_dominance}
                sectorCount={categories.length}
              />
            )}

            <TrendingSectors sectors={trending} />

            <section>
              <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                <h2 className="text-lg font-semibold">Top Crypto Sectors</h2>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
                    <input
                      type="text"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Filtrar sectores..."
                      className="h-8 w-40 rounded-lg border bg-muted/50 pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-accent/50 focus:bg-background transition-colors"
                      aria-label="Filtrar sectores"
                    />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleSort("market_cap")}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        sortKey === "market_cap"
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                      Cap
                    </button>
                    <button
                      onClick={() => toggleSort("market_cap_change_24h")}
                      className={cn(
                        "flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        sortKey === "market_cap_change_24h"
                          ? "bg-accent/10 text-accent"
                          : "text-muted-foreground hover:text-foreground hover:bg-muted"
                      )}
                    >
                      <ArrowUpDown className="h-3 w-3" />
                      Crecimiento
                    </button>
                  </div>
                </div>
              </div>

              {filtered.length === 0 ? (
                <EmptyState
                  icon={<LayoutGrid className="h-8 w-8" />}
                  title="Sin resultados"
                  description={query ? `No hay sectores que coincidan con "${query}"` : "No hay sectores disponibles"}
                />
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((category) => (
                    <CategoryCard key={category.id} category={category} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </AnimatedMount>
  );
}


