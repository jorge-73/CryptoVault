"use client";

import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";
import { useDebounce } from "@/hooks";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number | null;
}

export function SearchBar() {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [coins, setCoins] = useState<Coin[]>([]);
  const [results, setResults] = useState<Coin[]>([]);
  const [open, setOpen] = useState(false);
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    api.crypto.getMarkets("usd", 50).then(setCoins).catch(() => {});
  }, []);

  useEffect(() => {
    if (debouncedQuery.length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    const q = debouncedQuery.toLowerCase();
    const filtered = coins.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
    setResults(filtered.slice(0, 8));
    setOpen(true);
  }, [debouncedQuery, coins]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  function handleSelect(id: string) {
    setOpen(false);
    setQuery("");
    router.push(`/coin/${id}`);
  }

  return (
    <div className="relative" suppressHydrationWarning>
      <div className="relative" suppressHydrationWarning>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={t.market.search}
          className="h-9 w-48 rounded-lg border bg-muted/50 pl-9 pr-8 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-accent/50 focus:bg-background focus:ring-2 focus:ring-accent/50 transition-colors"
          aria-label={t.market.searchAria}
          aria-expanded={open}
          aria-autocomplete="list"
          role="combobox"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setResults([]); setOpen(false); }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-90 cursor-pointer"
            aria-label={t.search.clearAria}
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-1.5 left-0 w-72 rounded-xl border bg-popover shadow-lg overflow-hidden z-50"
          role="listbox"
        >
          {results.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted-foreground">
              {t.market.noResultsQuery(query)}
            </div>
          ) : (
            results.map((coin) => (
              <button
                key={coin.id}
                onClick={() => handleSelect(coin.id)}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors active:scale-95 cursor-pointer"
                role="option"
                aria-selected={false}
              >
                {coin.image ? (
                  <div className="relative h-7 w-7 flex-shrink-0">
                    <Image
                      src={coin.image}
                      alt=""
                      fill
                      unoptimized
                      className="rounded-full object-contain"
                      sizes="28px"
                    />
                  </div>
                ) : (
                  <div className="h-7 w-7 flex-shrink-0 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground">
                    {coin.symbol.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{coin.name}</div>
                  <div className="text-xs text-muted-foreground uppercase">
                    {coin.symbol}
                  </div>
                </div>
                <span className="text-xs font-medium tabular-nums text-muted-foreground">
                  {formatPrice(coin.current_price)}
                </span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
