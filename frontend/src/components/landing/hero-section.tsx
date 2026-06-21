"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart3, TrendingUp, Activity, Globe } from "lucide-react";
import { formatMarketCap, formatNumber } from "@/lib/formatters";
import { MOCK_GLOBAL } from "./mock-data";

const MOCK_GLOBAL_STATS = [
  { label: "Cap. Total", value: formatMarketCap(MOCK_GLOBAL.total_market_cap), icon: <BarChart3 className="h-4 w-4" />, trend: MOCK_GLOBAL.market_cap_change_24h },
  { label: "Volumen 24h", value: formatMarketCap(MOCK_GLOBAL.total_volume_24h), icon: <Activity className="h-4 w-4" /> },
  { label: "Dominancia BTC", value: `${formatNumber(MOCK_GLOBAL.btc_dominance)}%`, icon: <TrendingUp className="h-4 w-4" /> },
  { label: "Criptos activas", value: formatNumber(MOCK_GLOBAL.active_cryptocurrencies), icon: <Globe className="h-4 w-4" /> },
];

const CHART_DATA = [22000, 23500, 22800, 24200, 25100, 24800, 26200, 25800, 27500, 28100, 27400, 29000];
const maxVal = Math.max(...CHART_DATA);
const minVal = Math.min(...CHART_DATA);
const range = maxVal - minVal;
const isUp = CHART_DATA[CHART_DATA.length - 1] >= CHART_DATA[0];

function MiniChart() {
  const w = 240;
  const h = 60;
  const points = CHART_DATA.map((v, i) => {
    const x = (i / (CHART_DATA.length - 1)) * w;
    const y = h - ((v - minVal) / range) * (h * 0.8) - h * 0.1;
    return `${x},${y}`;
  });
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-full opacity-60">
      <path d={`M${points.join(" L")}`} fill="none" stroke={isUp ? "var(--green)" : "var(--red)"} strokeWidth="2" />
    </svg>
  );
}

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
              Analiza el mercado crypto como un profesional
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              Explora criptomonedas, descubre tendencias del mercado y sigue tus activos favoritos desde una plataforma diseñada para tomar mejores decisiones.
            </p>
            <div className="flex flex-wrap gap-3 mt-6 sm:mt-8">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-all active:scale-[0.98]"
              >
                Comenzar ahora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/market"
                className="inline-flex items-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                Explorar mercado
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="rounded-xl border bg-card/80 backdrop-blur-sm p-4 sm:p-5 shadow-xl">
              <div className="grid grid-cols-2 gap-2 mb-3">
                {MOCK_GLOBAL_STATS.map((stat) => (
                  <div key={stat.label} className="rounded-lg border bg-card p-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                      <span className="text-muted-foreground">{stat.icon}</span>
                    </div>
                    <span className="text-sm font-bold tabular-nums">{stat.value}</span>
                  </div>
                ))}
              </div>
              <div className="rounded-lg border bg-card p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">BTC/USD</span>
                  <span className="text-xs font-medium tabular-nums" style={{ color: isUp ? "var(--green)" : "var(--red)" }}>
                    {isUp ? "+2.34%" : "-1.23%"}
                  </span>
                </div>
                <div className="h-14">
                  <MiniChart />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
