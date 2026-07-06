"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "@/lib/use-translations";
import { formatPrice, formatMarketCap } from "@/lib/formatters";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { Badge } from "@/components/ui/badge";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { Wallet, TrendingUp, BarChart3, Search, ArrowRight, DollarSign, Percent } from "lucide-react";
import { es } from "@/translations/es";
import { MOCK_TICKER, MOCK_PORTFOLIO, MOCK_GLOBAL } from "./mock-data";

const views = ["dashboard", "market", "portfolio"] as const;
const INTERVAL = 4500;

function DashboardView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Cap. Total", value: formatMarketCap(MOCK_GLOBAL.total_market_cap), icon: <BarChart3 className="h-3.5 w-3.5" /> },
          { label: "Vol 24h", value: formatMarketCap(MOCK_GLOBAL.total_volume_24h), icon: <TrendingUp className="h-3.5 w-3.5" /> },
          { label: "Dominancia BTC", value: `${MOCK_GLOBAL.btc_dominance}%`, icon: <BarChart3 className="h-3.5 w-3.5" /> },
          { label: "Criptos", value: `${MOCK_GLOBAL.active_cryptocurrencies}`, icon: <BarChart3 className="h-3.5 w-3.5" /> },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border/40 bg-muted/20 p-3">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-muted-foreground">{s.icon}</span>
              <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
            </div>
            <p className="text-xs font-bold tabular-nums font-mono">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        {MOCK_TICKER.slice(0, 3).map((c) => (
          <div key={c.id} className="rounded-lg border border-border/40 bg-muted/20 p-2 text-center">
            <CryptoIcon src={c.image} alt={c.name} symbol={c.symbol} size={20} />
            <p className="text-[10px] font-semibold mt-1">{c.symbol}</p>
            <p className="text-[10px] font-mono tabular-nums">{formatPrice(c.price)}</p>
            <Badge value={c.change24h} size="xs" className="mt-0.5" />
          </div>
        ))}
      </div>
    </div>
  );
}

function MarketView() {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 rounded-lg border border-border/40 bg-muted/20 px-3 py-2 mb-3">
        <Search className="h-3.5 w-3.5 text-muted-foreground" />
        <span className="text-xs text-muted-foreground">{es.landing.demo.searchPlaceholder}</span>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[10px] text-muted-foreground uppercase tracking-wider border-b border-border/30">
            <th className="text-left pb-2 font-medium w-8">#</th>
            <th className="text-left pb-2 font-medium">Activo</th>
            <th className="text-right pb-2 font-medium">Precio</th>
            <th className="text-right pb-2 font-medium">24h</th>
            <th className="text-right pb-2 font-medium hidden sm:table-cell">Cap.</th>
          </tr>
        </thead>
        <tbody>
          {MOCK_TICKER.slice(0, 4).map((c, i) => (
            <tr key={c.id} className="border-b border-border/20 last:border-0">
              <td className="py-2 text-muted-foreground">{i + 1}</td>
              <td className="py-2">
                <div className="flex items-center gap-1.5">
                  <CryptoIcon src={c.image} alt={c.name} symbol={c.symbol} size={16} />
                  <span className="font-medium">{c.symbol}</span>
                </div>
              </td>
              <td className="py-2 text-right font-mono tabular-nums">{formatPrice(c.price)}</td>
              <td className="py-2 text-right"><Badge value={c.change24h} size="xs" /></td>
              <td className="py-2 text-right font-mono tabular-nums hidden sm:table-cell">{formatMarketCap(c.price * 1e9)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PortfolioView() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-accent/20 bg-accent/5 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <Wallet className="h-3 w-3 text-accent" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{es.landing.portfolio.totalValue}</span>
          </div>
          <p className="text-sm font-bold tabular-nums font-mono text-accent">{formatPrice(MOCK_PORTFOLIO.totalValue)}</p>
        </div>
        <div className="rounded-lg border border-green/20 bg-green/5 p-3">
          <div className="flex items-center gap-1.5 mb-1">
            <DollarSign className="h-3 w-3 text-green" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{es.landing.showcase.todayPnl}</span>
          </div>
          <p className="text-sm font-bold tabular-nums font-mono text-green">+{formatPrice(MOCK_PORTFOLIO.totalPnl)}</p>
        </div>
      </div>
      <div className="space-y-2">
        {MOCK_PORTFOLIO.holdings.map((h) => (
          <div key={h.cryptoId} className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
            <div className="flex items-center gap-2">
              <CryptoIcon src={h.image} alt={h.name} symbol={h.symbol} size={18} />
              <div>
                <p className="text-xs font-medium">{h.symbol}</p>
                <p className="text-[10px] text-muted-foreground">{h.amount} tokens</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs font-mono tabular-nums">{formatPrice(h.amount * h.currentPrice)}</p>
              <Badge value={h.change24h} size="xs" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const VIEW_COMPONENTS = [DashboardView, MarketView, PortfolioView] as const;

export function DemoSection() {
  const t = useTranslations();
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isPaused) {
      timerRef.current = setInterval(() => {
        setActive((prev) => (prev + 1) % views.length);
      }, INTERVAL);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const step = `step${(active + 1) as 1 | 2 | 3}` as const;
  const ViewComponent = VIEW_COMPONENTS[active];

  return (
    <section id="demo" className="scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
          className="text-center mb-12"
        >
          <h2 className="text-2xl sm:text-3xl font-bold">{t.landing.demo.title}</h2>
          <p className="text-muted-foreground mt-2">{t.landing.demo.subtitle}</p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          <DoubleBezelCard
            padded="lg"
            className="transition-all duration-500"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
                  <span className="text-xs font-semibold uppercase tracking-wider">
                    {t.landing.demo[step]}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {active + 1}/{views.length}
                </span>
              </div>

              <div className="min-h-[280px]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                  >
                    <ViewComponent />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-center gap-2 mt-6">
                {views.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActive(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                      i === active ? "w-6 bg-accent" : "w-1.5 bg-border hover:bg-muted-foreground/50"
                    }`}
                    aria-label={`Ver paso ${i + 1}`}
                  />
                ))}
              </div>
            </DoubleBezelCard>

          <p className="text-center text-xs text-muted-foreground mt-4">
            {t.landing.demo[`${step}Desc` as keyof typeof t.landing.demo]}
          </p>
        </div>
      </div>
    </section>
  );
}
