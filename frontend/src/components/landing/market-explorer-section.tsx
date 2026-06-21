"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatPrice, formatMarketCap } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { MOCK_COINS } from "./mock-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: -12 },
  show: { opacity: 1, x: 0 },
};

export function MarketExplorerSection() {
  return (
    <section className="border-y bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Descubre qué está pasando en el mercado</h2>
            <p className="text-muted-foreground mt-2">Filtra, compara y analiza miles de activos con información actualizada.</p>
          </div>
          <Link
            href="/market"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            Ver mercado completo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12">#</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nombre</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Precio</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">24h</th>
                  <th className="hidden sm:table-cell px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Cap.</th>
                </tr>
              </thead>
              <motion.tbody variants={containerVariants} initial="hidden" whileInView="show" viewport={{ once: true }}>
                {MOCK_COINS.map((coin, i) => (
                  <motion.tr
                    key={coin.id}
                    variants={itemVariants}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-xs text-muted-foreground tabular-nums">{coin.market_cap_rank}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{coin.name}</span>
                        <span className="text-xs text-muted-foreground uppercase">{coin.symbol}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right text-sm font-medium tabular-nums">{formatPrice(coin.current_price)}</td>
                    <td className="px-4 py-3 text-right">
                      <Badge value={coin.price_change_percentage_24h} />
                    </td>
                    <td className="hidden sm:table-cell px-4 py-3 text-right text-xs tabular-nums text-muted-foreground">
                      {formatMarketCap(coin.market_cap)}
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </table>
          </div>
        </div>

        <Link
          href="/market"
          className="sm:hidden inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline mt-4"
        >
          Ver mercado completo <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
