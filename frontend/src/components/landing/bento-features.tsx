"use client";

import { motion } from "framer-motion";
import { BarChart3, BrainCircuit, Star, Activity } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";
import { formatMarketCap, formatNumber } from "@/lib/formatters";
import { MOCK_GLOBAL } from "./mock-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const ease = [0.32, 0.72, 0, 1] as const;

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

const chartData = [22000, 23500, 22800, 24200, 25100, 24800, 26200, 25800, 27500, 28100, 27400, 29000];
const maxC = Math.max(...chartData);
const minC = Math.min(...chartData);
const rangeC = maxC - minC;
const cw = 300;
const chartPoints = chartData.map((v, i) => {
  const x = (i / (chartData.length - 1)) * cw;
  const y = 80 - ((v - minC) / rangeC) * 60 - 10;
  return `${x},${y}`;
});

function DoubleBezelCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border/40 bg-card/30 p-1.5 backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:border-accent/20 hover:-translate-y-0.5 ${className}`}>
      <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-5 border border-border/20 h-full">
        {children}
      </div>
    </div>
  );
}

export function BentoFeatures() {
  const t = useTranslations();

  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">{t.landing.bento.title}</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <DoubleBezelCard className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t.landing.bento.marketAnalytics}</h3>
                  <p className="text-xs text-muted-foreground">{t.landing.bento.marketAnalyticsDesc}</p>
                </div>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                  <span className="font-medium">BTC/USD</span>
                  <span className="font-mono tabular-nums text-green">+5.2%</span>
                </div>
                <svg viewBox={`0 0 ${cw} 80`} className="w-full h-20">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`M${chartPoints.join(" L")}`} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={`M${chartPoints.join(" L")} L${cw},80 L0,80 Z`} fill="url(#chartGrad)" />
                </svg>
              </div>
            </DoubleBezelCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <DoubleBezelCard className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BrainCircuit className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t.landing.bento.intelligence}</h3>
                  <p className="text-xs text-muted-foreground">{t.landing.bento.intelligenceDesc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "Cap. Total", value: formatMarketCap(MOCK_GLOBAL.total_market_cap), icon: <BarChart3 className="h-3.5 w-3.5" /> },
                  { label: "Vol 24h", value: formatMarketCap(MOCK_GLOBAL.total_volume_24h), icon: <Activity className="h-3.5 w-3.5" /> },
                  { label: "Dominancia BTC", value: `${formatNumber(MOCK_GLOBAL.btc_dominance)}%`, icon: <BarChart3 className="h-3.5 w-3.5" /> },
                  { label: "Criptos", value: formatNumber(MOCK_GLOBAL.active_cryptocurrencies), icon: <Activity className="h-3.5 w-3.5" /> },
                ].map((s) => (
                  <div key={s.label} className="rounded-lg border border-border/40 bg-muted/20 p-2.5">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-muted-foreground">{s.icon}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
                    </div>
                    <p className="text-xs font-bold tabular-nums font-mono">{s.value}</p>
                  </div>
                ))}
              </div>
            </DoubleBezelCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <DoubleBezelCard className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Star className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t.landing.bento.watchlist}</h3>
                  <p className="text-xs text-muted-foreground">{t.landing.bento.watchlistDesc}</p>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { name: "Bitcoin", sym: "BTC", price: "$67,450" },
                  { name: "Ethereum", sym: "ETH", price: "$3,450" },
                  { name: "Solana", sym: "SOL", price: "$172" },
                ].map((c) => (
                  <div key={c.sym} className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
                      <span className="text-xs font-medium">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{c.sym}</span>
                    </div>
                    <span className="text-xs font-semibold tabular-nums font-mono">{c.price}</span>
                  </div>
                ))}
              </div>
            </DoubleBezelCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
