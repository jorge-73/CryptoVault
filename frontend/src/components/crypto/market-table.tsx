"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Star } from "lucide-react";
import { cn, formatPrice, formatMarketCap } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { AnimatedMount } from "@/components/ui";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

type SortField = "market_cap_rank" | "current_price" | "price_change_percentage_24h" | "price_change_percentage_7d_in_currency" | "market_cap" | "total_volume";
type SortDir = "asc" | "desc";

interface Coin {
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

interface MarketTableProps {
  coins: Coin[];
  isFavorite?: (id: string) => boolean;
  onToggleFavorite?: (id: string) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

type TopFilter = 10 | 50 | 100 | 0;

const TOP_OPTIONS: { label: string; value: TopFilter }[] = [
  { label: "Top 10", value: 10 },
  { label: "Top 50", value: 50 },
  { label: "Top 100", value: 100 },
  { label: "Todos", value: 0 },
];

export function MarketTable({ coins, isFavorite, onToggleFavorite, loading, error, onRetry }: MarketTableProps) {
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("market_cap_rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [topFilter, setTopFilter] = useState<TopFilter>(100);

  const filtered = useMemo(() => {
    let list = coins;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }
    if (topFilter > 0) {
      list = list.slice(0, topFilter);
    }
    return [...list].sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [coins, query, sortField, sortDir, topFilter]);

  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "market_cap_rank" ? "asc" : "desc");
    }
  }, [sortField]);

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  }

  const sortableHeader = (label: string, field: SortField, align = "right", hideAt?: string) => (
    <th
      className={cn(
        hideAt,
        "px-4 py-3 text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors select-none",
        align === "right" ? "text-right" : "text-left"
      )}
      onClick={() => toggleSort(field)}
    >
      <div className={cn("flex items-center gap-1", align === "right" && "justify-end")}>
        {label}
        <SortIcon field={field} />
      </div>
    </th>
  );

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  return (
    <div suppressHydrationWarning>
      <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar moneda..."
              className="h-8 w-40 rounded-lg border bg-muted/50 pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-accent/50 focus:bg-background transition-colors"
              aria-label="Buscar moneda"
            />
          </div>
        </div>
        <div className="flex items-center gap-1">
          {TOP_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTopFilter(opt.value)}
              className={cn(
                "px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors",
                topFilter === opt.value
                  ? "bg-accent/10 text-accent"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <MarketTableSkeleton />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8" />}
          title="Sin resultados"
          description={query ? `No hay monedas que coincidan con "${query}"` : "No hay monedas disponibles"}
        />
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-xl border bg-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    {sortableHeader("#", "market_cap_rank", "left", "w-16")}
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Moneda
                    </th>
                    {sortableHeader("Precio", "current_price")}
                    {sortableHeader("24h", "price_change_percentage_24h")}
                    {sortableHeader("7d", "price_change_percentage_7d_in_currency")}
                    {sortableHeader("Cap. Mercado", "market_cap", "right", "hidden lg:table-cell")}
                    {sortableHeader("Volumen", "total_volume", "right", "hidden lg:table-cell")}
                    {onToggleFavorite && <th className="px-4 py-3 w-10" />}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((coin, i) => (
                    <motion.tr
                      key={coin.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.25, delay: i * 0.02 }}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                    >
                      <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums w-16">
                        {coin.market_cap_rank ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/coin/${coin.id}`}
                          className="flex items-center gap-2 hover:text-accent transition-colors"
                        >
                          {coin.image ? (
                            <div className="relative h-6 w-6 flex-shrink-0">
                              <Image
                                src={coin.image}
                                alt=""
                                fill
                                unoptimized
                                className="rounded-full object-contain"
                                sizes="24px"
                              />
                            </div>
                          ) : (
                            <div className="h-6 w-6 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold text-muted-foreground">
                              {coin.symbol[0]}
                            </div>
                          )}
                          <span className="font-medium truncate max-w-[120px]">{coin.name}</span>
                          <span className="text-xs text-muted-foreground uppercase flex-shrink-0">
                            {coin.symbol}
                          </span>
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right text-sm font-medium tabular-nums">
                        {formatPrice(coin.current_price)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge value={coin.price_change_percentage_24h} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Badge value={coin.price_change_percentage_7d_in_currency} />
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 text-right text-sm font-medium tabular-nums">
                        {formatMarketCap(coin.market_cap)}
                      </td>
                      <td className="hidden lg:table-cell px-4 py-3 text-right text-sm font-medium tabular-nums">
                        {formatMarketCap(coin.total_volume)}
                      </td>
                      {onToggleFavorite && (
                        <td className="px-4 py-3 text-center w-10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onToggleFavorite(coin.id);
                            }}
                            className={cn(
                              "flex h-7 w-7 items-center justify-center rounded-md transition-colors mx-auto",
                              isFavorite?.(coin.id)
                                ? "text-yellow-500 hover:text-yellow-600"
                                : "text-muted-foreground/40 hover:text-yellow-500"
                            )}
                            aria-label={isFavorite?.(coin.id) ? `Quitar ${coin.name} de favoritos` : `Añadir ${coin.name} a favoritos`}
                          >
                            <Star className={cn("h-4 w-4", isFavorite?.(coin.id) && "fill-current")} />
                          </button>
                        </td>
                      )}
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-2">
            {filtered.map((coin, i) => (
              <motion.div
                key={coin.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: i * 0.03 }}
              >
                <div className="group relative rounded-xl border bg-card p-3 transition-all hover:shadow-md hover:border-accent/20">
                  <Link href={`/coin/${coin.id}`} className="block">
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground tabular-nums w-5 flex-shrink-0">
                        {coin.market_cap_rank ?? "—"}
                      </span>
                      {coin.image ? (
                        <div className="relative h-8 w-8 flex-shrink-0">
                          <Image
                            src={coin.image}
                            alt=""
                            fill
                            unoptimized
                            className="rounded-full object-contain"
                            sizes="32px"
                          />
                        </div>
                      ) : (
                        <div className="h-8 w-8 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-[9px] font-bold text-muted-foreground">
                          {coin.symbol[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-medium text-sm truncate group-hover:text-accent transition-colors">
                            {coin.name}
                          </span>
                          <span className="text-xs text-muted-foreground uppercase flex-shrink-0">
                            {coin.symbol}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-sm font-bold tabular-nums">
                            {formatPrice(coin.current_price)}
                          </span>
                          <Badge value={coin.price_change_percentage_24h} />
                        </div>
                      </div>
                      {onToggleFavorite && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            onToggleFavorite(coin.id);
                          }}
                          className={cn(
                            "flex h-7 w-7 items-center justify-center rounded-md transition-colors flex-shrink-0",
                            isFavorite?.(coin.id)
                              ? "text-yellow-500 hover:text-yellow-600"
                              : "text-muted-foreground/40 hover:text-yellow-500"
                          )}
                          aria-label={isFavorite?.(coin.id) ? `Quitar ${coin.name} de favoritos` : `Añadir ${coin.name} a favoritos`}
                        >
                          <Star className={cn("h-3.5 w-3.5", isFavorite?.(coin.id) && "fill-current")} />
                        </button>
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2 pl-8">
                      <div className="text-[11px] text-muted-foreground">
                        <span className="uppercase tracking-wider">Cap. </span>
                        <span className="font-medium tabular-nums">{formatMarketCap(coin.market_cap)}</span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        <span className="uppercase tracking-wider">Vol </span>
                        <span className="font-medium tabular-nums">{formatMarketCap(coin.total_volume)}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function MarketTableSkeleton() {
  return (
    <div>
      <div className="hidden md:block rounded-xl border bg-card overflow-hidden">
        <div className="divide-y divide-border/50">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-3 animate-pulse">
              <Skeleton className="h-4 w-6 rounded" />
              <Skeleton className="h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24 rounded flex-1" />
              <Skeleton className="h-4 w-20 rounded ml-auto" />
              <Skeleton className="h-5 w-14 rounded" />
              <Skeleton className="h-5 w-14 rounded" />
              <Skeleton className="hidden lg:block h-4 w-24 rounded" />
              <Skeleton className="hidden lg:block h-4 w-20 rounded" />
            </div>
          ))}
        </div>
      </div>
      <div className="md:hidden space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-3 animate-pulse">
            <div className="flex items-center gap-3">
              <Skeleton className="h-4 w-5 rounded" />
              <Skeleton className="h-8 w-8 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-28 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
