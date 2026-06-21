"use client";

import { motion } from "framer-motion";
import { BrainCircuit, LayoutGrid, LineChart, BarChart3 } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";
import { MOCK_GLOBAL } from "./mock-data";
import { formatMarketCap, formatNumber } from "@/lib/formatters";

export function FeaturesSection() {
  const t = useTranslations();

  const FEATURES = [
    {
      id: "intelligence",
      icon: <BrainCircuit className="h-5 w-5" />,
      title: t.landing.features.intelligence.title,
      description: t.landing.features.intelligence.description,
      mockup: (
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: t.landing.heroStats.totalCap, value: formatMarketCap(MOCK_GLOBAL.total_market_cap) },
            { label: t.crypto.vol24h, value: formatMarketCap(MOCK_GLOBAL.total_volume_24h) },
            { label: t.landing.heroStats.btcDominance, value: `${formatNumber(MOCK_GLOBAL.btc_dominance)}%` },
            { label: t.landing.heroStats.activeCryptos, value: formatNumber(MOCK_GLOBAL.active_cryptocurrencies) },
          ].map((s) => (
            <div key={s.label} className="rounded-lg border bg-card p-2">
              <span className="text-[9px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
              <p className="text-xs font-bold tabular-nums">{s.value}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "explorer",
      icon: <LayoutGrid className="h-5 w-5" />,
      title: t.landing.features.explorer.title,
      description: t.landing.features.explorer.description,
      mockup: (
        <div className="space-y-1.5">
          {["DeFi", "AI", "Gaming", "Layer 2"].map((name) => (
            <div key={name} className="flex items-center justify-between rounded-lg border bg-card px-3 py-2">
              <span className="text-xs font-medium">{name}</span>
              <span className="text-[10px] text-muted-foreground">+3.2%</span>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: "analysis",
      icon: <LineChart className="h-5 w-5" />,
      title: t.landing.features.analysis.title,
      description: t.landing.features.analysis.description,
      mockup: (
        <div className="rounded-lg border bg-card p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-5 w-5 rounded-full bg-muted" />
            <span className="text-xs font-semibold">Bitcoin</span>
            <span className="text-[10px] text-muted-foreground uppercase">BTC</span>
            <span className="text-xs font-bold tabular-nums ml-auto">$67,450</span>
          </div>
          <svg viewBox="0 0 200 40" className="w-full h-8">
            <path d="M0,30 L20,25 L40,28 L60,18 L80,22 L100,12 L120,16 L140,8 L160,10 L180,5 L200,8" fill="none" stroke="var(--green)" strokeWidth="1.5" />
          </svg>
        </div>
      ),
    },
  ];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.15 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

  return (
    <section id="features" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold">{t.landing.features.title}</h2>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => (
            <motion.div
              key={feature.id}
              variants={itemVariants}
              className="group rounded-xl border bg-card p-5 transition-all hover:shadow-lg hover:border-accent/30 hover:-translate-y-0.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent mb-4">
                {feature.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{feature.description}</p>
              <div className="rounded-lg bg-muted/30 p-3">{feature.mockup}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
