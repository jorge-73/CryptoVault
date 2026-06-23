"use client";

import { useState, useMemo } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn, formatPrice, formatMarketCap } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useTranslations } from "@/lib/use-translations";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number | null;
  market_cap: number;
  market_cap_rank: number | null;
  price_change_percentage_24h: number | null;
}

type SortField = "market_cap_rank" | "current_price" | "price_change_percentage_24h" | "market_cap";
type SortDir = "asc" | "desc";

export function CategoryCoinTable({ coins }: { coins: Coin[] }) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [sortField, setSortField] = useState<SortField>("market_cap_rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    let list = coins;
    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
      );
    }
    return [...list].sort((a, b) => {
      const aVal = a[sortField] ?? 0;
      const bVal = b[sortField] ?? 0;
      return sortDir === "asc"
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [coins, query, sortField, sortDir]);

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir(field === "market_cap_rank" ? "asc" : "desc");
    }
  }

  function SortIcon({ field }: { field: SortField }) {
    if (sortField !== field) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">{t.categories.coins}</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.market.search}
            className="h-8 w-40 rounded-lg border bg-muted/50 pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-accent/50 focus:bg-background focus:ring-2 focus:ring-accent/50 transition-colors"
            aria-label={t.market.searchAria}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={<Search className="h-8 w-8" />}
          title={t.market.noResults}
          description={query ? t.market.noResultsQuery(query) : t.coinDetail.errorNotFound}
        />
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th
                    className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors w-16"
                    onClick={() => toggleSort("market_cap_rank")}
                  >
                    <div className="flex items-center gap-1">
                      {t.crypto.rank}
                      <SortIcon field="market_cap_rank" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    {t.watchlist.sortName}
                  </th>
                  <th
                    className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => toggleSort("current_price")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {t.market.columns.price}
                      <SortIcon field="current_price" />
                    </div>
                  </th>
                  <th
                    className="hidden sm:table-cell px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => toggleSort("price_change_percentage_24h")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {t.market.columns.change24h}
                      <SortIcon field="price_change_percentage_24h" />
                    </div>
                  </th>
                  <th
                    className="hidden md:table-cell px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => toggleSort("market_cap")}
                  >
                    <div className="flex items-center justify-end gap-1">
                      {t.market.columns.marketCap}
                      <SortIcon field="market_cap" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((coin, i) => (
                  <motion.tr
                    key={coin.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.03 }}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">
                      {coin.market_cap_rank ?? t.badge.na}
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
                        <span className="font-medium truncate">{coin.name}</span>
                        <span className="text-xs text-muted-foreground uppercase ml-1 hidden sm:inline">
                          {coin.symbol}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium tabular-nums">
                      {formatPrice(coin.current_price)}
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 text-right">
                      <Badge value={coin.price_change_percentage_24h} />
                    </td>
                    <td className="hidden md:table-cell px-4 py-3 text-right text-sm font-medium tabular-nums">
                      {formatMarketCap(coin.market_cap)}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export function CategoryCoinTableSkeleton() {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-20 rounded bg-muted animate-pulse" />
        <div className="h-8 w-40 rounded-lg bg-muted animate-pulse" />
      </div>
      <div className="rounded-xl border bg-card overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-border/50 last:border-0 animate-pulse"
          >
            <div className="h-4 w-6 rounded bg-muted" />
            <div className="h-6 w-6 rounded-full bg-muted" />
            <div className="h-4 w-24 rounded bg-muted flex-1" />
            <div className="h-4 w-20 rounded bg-muted ml-auto" />
            <div className="h-4 w-16 rounded bg-muted hidden sm:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
