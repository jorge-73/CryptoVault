"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { MOCK_TICKER } from "./mock-data";
import { formatPrice } from "@/lib/formatters";
import { CryptoIcon } from "@/components/ui/crypto-icon";

function TickerItem({ coin }: { coin: typeof MOCK_TICKER[number] }) {
  const isUp = coin.change24h >= 0;
  return (
    <span className="inline-flex items-center gap-2.5 mx-6">
      <CryptoIcon src={coin.image} alt={coin.name} symbol={coin.symbol} size={20} />
      <span className="text-sm font-semibold">{coin.name}</span>
      <span className="text-xs text-muted-foreground uppercase font-mono">{coin.symbol}</span>
      <span className="text-sm font-semibold tabular-nums font-mono">{formatPrice(coin.price)}</span>
      <span
        className={`inline-flex items-center gap-1 text-xs font-semibold tabular-nums font-mono ${isUp ? "text-green" : "text-red"}`}
      >
        {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
        {isUp ? "+" : ""}{coin.change24h.toFixed(2)}%
      </span>
    </span>
  );
}

export function MarketTicker() {
  const items = [...MOCK_TICKER, ...MOCK_TICKER, ...MOCK_TICKER];

  return (
    <section className="border-y border-border/40 bg-muted/20">
      <div className="relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        <motion.div
          animate={{ x: [0, -33.33 + "%"] }}
          transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          className="flex items-center py-2.5 whitespace-nowrap"
        >
          {items.map((coin, i) => (
            <TickerItem key={`${coin.id}-${i}`} coin={coin} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
