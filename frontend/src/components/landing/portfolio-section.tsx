"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Wallet, TrendingUp, Percent, BarChart3 } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";
import { formatPrice, formatPercentage } from "@/lib/formatters";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { MOCK_PORTFOLIO } from "./mock-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

const ease = [0.32, 0.72, 0, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const STATS = [
  { key: "totalValue", value: formatPrice(MOCK_PORTFOLIO.totalValue), label: "Valor Total", icon: <Wallet className="h-4 w-4" />, theme: "accent" as const },
  { key: "pnl", value: `+${formatPrice(MOCK_PORTFOLIO.totalPnl)}`, label: "Ganancia/Pérdida", icon: <TrendingUp className="h-4 w-4" />, theme: "positive" as const },
  { key: "roi", value: formatPercentage(MOCK_PORTFOLIO.totalRoi), label: "ROI", icon: <Percent className="h-4 w-4" />, theme: "positive" as const },
  { key: "assets", value: `${MOCK_PORTFOLIO.holdings.length}`, label: "Activos", icon: <BarChart3 className="h-4 w-4" />, theme: "neutral" as const },
];

export function PortfolioSection() {
  const t = useTranslations();

  return (
    <section id="portfolio" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">{t.landing.portfolio.title}</h2>
          <p className="text-muted-foreground mt-2">{t.landing.portfolio.subtitle}</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {STATS.map((s) => (
              <motion.div key={s.key} variants={itemVariants}>
                <StatCard label={s.label} value={s.value} icon={s.icon} theme={s.theme} />
              </motion.div>
            ))}
          </div>

          <motion.div variants={itemVariants}>
            <DoubleBezelCard>
              <h3 className="text-sm font-semibold mb-4">{t.landing.portfolio.holdings}</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border/30">
                        <th className="text-left pb-2 font-medium">Activo</th>
                        <th className="text-right pb-2 font-medium">{t.landing.portfolio.amount}</th>
                        <th className="text-right pb-2 font-medium">{t.landing.portfolio.price}</th>
                        <th className="text-right pb-2 font-medium">{t.landing.portfolio.value}</th>
                        <th className="text-right pb-2 font-medium">{t.landing.portfolio.change}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {MOCK_PORTFOLIO.holdings.map((h) => (
                        <tr key={h.cryptoId} className="border-b border-border/20 last:border-0">
                          <td className="py-2.5">
                            <div className="flex items-center gap-2">
                              <CryptoIcon src={h.image} alt={h.name} symbol={h.symbol} size={20} />
                              <span className="text-xs font-medium">{h.name}</span>
                              <span className="text-[10px] text-muted-foreground uppercase">{h.symbol}</span>
                            </div>
                          </td>
                          <td className="py-2.5 text-right text-xs font-mono tabular-nums">{h.amount}</td>
                          <td className="py-2.5 text-right text-xs font-mono tabular-nums">{formatPrice(h.currentPrice)}</td>
                          <td className="py-2.5 text-right text-xs font-mono tabular-nums">{formatPrice(h.amount * h.currentPrice)}</td>
                          <td className="py-2.5 text-right">
                            <Badge value={h.change24h} period="24h" size="sm" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
              </div>
            </DoubleBezelCard>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-8">
            <Link
              href="/portfolio"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-all active:scale-[0.98]"
            >
              {t.landing.portfolio.go}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
