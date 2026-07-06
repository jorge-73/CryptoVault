"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";
import { formatPrice } from "@/lib/formatters";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { Badge } from "@/components/ui/badge";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { MOCK_BTC_SPARKLINE, MOCK_TICKER } from "./mock-data";

const sparkline = MOCK_BTC_SPARKLINE;
const maxVal = Math.max(...sparkline);
const minVal = Math.min(...sparkline);
const range = maxVal - minVal;
const isUp = sparkline[sparkline.length - 1] >= sparkline[0];
const sparkW = 200;
const sparkH = 80;
const sparkPoints = sparkline.map((v, i) => {
  const x = (i / (sparkline.length - 1)) * sparkW;
  const y = sparkH - ((v - minVal) / range) * (sparkH * 0.8) - sparkH * 0.1;
  return `${x},${y}`;
});

const shW = 300;
const shH = 80;
const showcasePoints = sparkline.map((v, i) => {
  const x = (i / (sparkline.length - 1)) * shW;
  const y = shH - ((v - minVal) / range) * (shH * 0.8) - shH * 0.1;
  return `${x},${y}`;
});
const showcasePath = `M${showcasePoints.join(" L")}`;

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
          src="/hero.webp"
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
            className="lg:col-span-2"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="group"
            >
              <DoubleBezelCard hover padded="sm" className="group-hover:-translate-y-1 group-hover:shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-green animate-pulse" />
                    <span className="text-xs font-semibold uppercase tracking-wider">{t.nav.dashboard}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono">{t.landing.hero.eyebrow.split(" ")[0]}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="rounded-xl border border-border/40 bg-muted/20 p-3">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.landing.showcase.portfolioValue}</span>
                    <p className="text-lg font-bold tabular-nums font-mono mt-1">{formatPrice(98450)}</p>
                  </div>
                  <div className="rounded-xl border border-border/40 bg-muted/20 p-3">
                    <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{t.landing.showcase.todayPnl}</span>
                    <p className="text-lg font-bold tabular-nums font-mono mt-1 text-green">+{formatPrice(1245)}</p>
                  </div>
                </div>

                <div className="rounded-xl bg-muted/20 p-3 mb-4">
                  <div className="flex items-center justify-between mb-2 text-xs text-muted-foreground">
                    <span className="font-medium">BTC/USD</span>
                    <span className="text-green font-mono tabular-nums">+2.34%</span>
                  </div>
                  <div className="h-20">
                    <svg viewBox={`0 0 ${shW} ${shH}`} className="w-full h-full">
                      <defs>
                        <linearGradient id="showcaseGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d={showcasePath} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d={`${showcasePath} L${shW},${shH} L0,${shH} Z`} fill="url(#showcaseGrad)" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground uppercase tracking-wider">{t.landing.showcase.watchlist}</span>
                  <span className="text-[10px] text-muted-foreground">{t.landing.header.market}</span>
                </div>
                <div className="grid grid-cols-3 gap-1 mt-2">
                  {MOCK_TICKER.slice(0, 3).map((coin) => (
                    <div key={coin.symbol} className="flex items-center gap-1 min-w-0 overflow-hidden">
                      <CryptoIcon src={coin.image} alt={coin.name} symbol={coin.symbol} size={14} />
                      <span className="text-[11px] font-semibold tabular-nums font-mono truncate">{formatPrice(coin.price)}</span>
                      <Badge value={coin.change24h} size="xs" className="flex-shrink-0" />
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
