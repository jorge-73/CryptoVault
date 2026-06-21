"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

const MOCK_WATCHLIST = [
  { id: "bitcoin", name: "Bitcoin", symbol: "BTC", current_price: 67450, price_change_percentage_24h: 2.34 },
  { id: "ethereum", name: "Ethereum", symbol: "ETH", current_price: 3450, price_change_percentage_24h: 1.56 },
  { id: "solana", name: "Solana", symbol: "SOL", current_price: 172, price_change_percentage_24h: -0.82 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function WatchlistSection() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Construye tu propia lista de seguimiento</h2>
            <p className="text-muted-foreground mt-2">Sigue tus activos favoritos y ten siempre la información importante a tu alcance.</p>
          </div>
          <Link
            href="/profile"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Ir a watchlist <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-3 sm:grid-cols-3"
        >
          {MOCK_WATCHLIST.map((coin) => (
            <motion.div
              key={coin.id}
              variants={itemVariants}
              className="group relative rounded-xl border bg-card p-4 transition-all hover:shadow-lg hover:border-accent/30 hover:-translate-y-0.5"
            >
              <div className="absolute top-3 right-3 text-yellow-500">
                <Star className="h-4 w-4 fill-current" />
              </div>
              <div className="flex items-center gap-3 mb-3">
                <div className="relative h-8 w-8 flex-shrink-0 rounded-full bg-muted" />
                <div>
                  <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">{coin.name}</h3>
                  <span className="text-xs text-muted-foreground uppercase">{coin.symbol}</span>
                </div>
              </div>
              <div className="flex items-end justify-between">
                <p className="text-lg font-bold tabular-nums">{formatPrice(coin.current_price)}</p>
                <Badge value={coin.price_change_percentage_24h} period="24h" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        <Link
          href="/profile"
          className="sm:hidden inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline mt-4"
        >
          Ir a watchlist <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
