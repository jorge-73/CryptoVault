"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, TrendingUp, AlertTriangle, Star } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";
import { formatPrice } from "@/lib/formatters";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { Badge } from "@/components/ui/badge";
import { MOCK_BTC_SPARKLINE, MOCK_ALERT, MOCK_TICKER } from "./mock-data";

const sparkline = MOCK_BTC_SPARKLINE;
const maxVal = Math.max(...sparkline);
const minVal = Math.min(...sparkline);
const range = maxVal - minVal;
const isUp = sparkline[sparkline.length - 1] >= sparkline[0];
const sparkW = 200;
const sparkH = 48;
const sparkPoints = sparkline.map((v, i) => {
  const x = (i / (sparkline.length - 1)) * sparkW;
  const y = sparkH - ((v - minVal) / range) * (sparkH * 0.8) - sparkH * 0.1;
  return `${x},${y}`;
});

const MOCK_WATCHLIST_COINS = MOCK_TICKER.slice(0, 3);

function DoubleBezelCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-border/50 bg-card/50 p-1.5 backdrop-blur-sm ${className}`}>
      <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-4 border border-border/30">
        {children}
      </div>
    </div>
  );
}

function Sparkline() {
  return (
    <svg viewBox={`0 0 ${sparkW} ${sparkH}`} className="w-full h-full">
      <defs>
        <linearGradient id="sparkGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--green)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--green)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M${sparkPoints.join(" L")}`} fill="none" stroke="var(--green)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d={`M${sparkPoints.join(" L")} L${sparkW},${sparkH} L0,${sparkH} Z`} fill="url(#sparkGrad)" />
    </svg>
  );
}

export function HeroSection() {
  const t = useTranslations();

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none [mask-image:linear-gradient(to_bottom,white_60%,transparent_100%)]">
        <Image
          src="/hero.png"
          alt=""
          fill
          className="object-cover opacity-10 dark:opacity-[0.07]"
          priority
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--accent)/6%,transparent_60%)] pointer-events-none" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 lg:py-28">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-3"
          >
            <span className="inline-flex items-center rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-accent mb-6">
              {t.landing.hero.eyebrow}
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
              {t.landing.hero.title}
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground leading-relaxed max-w-lg">
              {t.landing.hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-3 mt-8">
              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-all duration-300 active:scale-[0.98]"
              >
                {t.landing.hero.cta}
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-black/10 dark:bg-white/10 transition-transform group-hover:translate-x-0.5">
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </Link>
              <Link
                href="/market"
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              >
                {t.landing.hero.explore}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.32, 0.72, 0, 1] }}
            className="lg:col-span-2 space-y-3"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <DoubleBezelCard>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <CryptoIcon src={MOCK_TICKER[0].image} alt="Bitcoin" symbol="BTC" size={28} />
                    <span className="text-xs font-medium text-muted-foreground">{t.landing.heroCards.btcTitle("Bitcoin")}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.landing.heroCards.btcPrice}</span>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <span className="text-2xl font-bold tabular-nums font-mono">{formatPrice(67450)}</span>
                  <Badge value={2.34} period="24h" />
                </div>
                <div className="h-12">
                  <Sparkline />
                </div>
              </DoubleBezelCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <DoubleBezelCard>
                <div className="flex items-start gap-3">
                  <div className="h-8 w-8 flex-shrink-0 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">{t.landing.heroCards.alert}</span>
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    </div>
                    <p className="text-sm font-semibold leading-snug">{MOCK_ALERT.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{MOCK_ALERT.subtitle}</p>
                  </div>
                </div>
              </DoubleBezelCard>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <DoubleBezelCard>
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-3.5 w-3.5 text-yellow-500 fill-yellow-500" />
                  <span className="text-xs font-medium text-muted-foreground">{t.landing.heroCards.watchlistTitle}</span>
                  <span className="ml-auto text-[10px] text-muted-foreground">{t.landing.heroCards.watchlistCount(3)}</span>
                </div>
                <div className="space-y-1.5">
                  {MOCK_WATCHLIST_COINS.map((coin) => (
                    <div key={coin.symbol} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CryptoIcon src={coin.image} alt={coin.name} symbol={coin.symbol} size={20} />
                        <span className="text-xs font-medium">{coin.name}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{coin.symbol}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold tabular-nums font-mono">{formatPrice(coin.price)}</span>
                        <Badge value={coin.change24h} className="text-[10px]" />
                      </div>
                    </div>
                  ))}
                </div>
              </DoubleBezelCard>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
