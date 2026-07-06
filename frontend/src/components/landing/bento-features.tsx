"use client";

import { motion } from "framer-motion";
import { BarChart3, BrainCircuit, Star, Activity, Zap, Globe, Layers, TrendingUp } from "lucide-react";
import { useTranslations } from "@/lib/use-translations";
import { formatPrice } from "@/lib/formatters";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { Badge } from "@/components/ui/badge";
import { DoubleBezelCard } from "@/components/ui/double-bezel-card";
import { MOCK_TICKER, MOCK_ALLOCATION, MOCK_REALTIME } from "./mock-data";

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
const ch = 128;
const chartPoints = chartData.map((v, i) => {
  const x = (i / (chartData.length - 1)) * cw;
  const y = ch - ((v - minC) / rangeC) * (ch * 0.75) - ch * 0.125;
  return `${x},${y}`;
});

const TOTAL = MOCK_ALLOCATION.reduce((s, a) => s + a.value, 0);
const DONUT_R = 40;
const DONUT_CX = 50;
const DONUT_CY = 50;
let donutOffset = 0;
const donutSegments = MOCK_ALLOCATION.map((a) => {
  const pct = a.value / TOTAL;
  const circ = 2 * Math.PI * DONUT_R;
  const len = circ * pct;
  const dash = `${len} ${circ - len}`;
  const off = donutOffset;
  donutOffset -= len;
  return { ...a, dash, offset: off };
});

const realtimeIcons: Record<string, React.ReactNode> = {
  zap: <Zap className="h-3.5 w-3.5" />,
  activity: <Activity className="h-3.5 w-3.5" />,
  layers: <Layers className="h-3.5 w-3.5" />,
  globe: <Globe className="h-3.5 w-3.5" />,
};

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
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-2 lg:row-span-2">
            <DoubleBezelCard hover className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t.landing.bento.market}</h3>
                  <p className="text-xs text-muted-foreground">{t.landing.bento.marketDesc}</p>
                </div>
              </div>
              <div className="rounded-xl bg-muted/30 p-4">
                <div className="flex items-center justify-between mb-3 text-xs text-muted-foreground">
                  <span className="font-medium">BTC/USD</span>
                  <span className="font-mono tabular-nums text-green">+5.2%</span>
                </div>
                <svg viewBox={`0 0 ${cw} ${ch}`} className="w-full h-32">
                  <defs>
                    <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
                      <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d={`M${chartPoints.join(" L")}`} fill="none" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d={`M${chartPoints.join(" L")} L${cw},${ch} L0,${ch} Z`} fill="url(#chartGrad)" />
                </svg>
              </div>
            </DoubleBezelCard>
          </motion.div>

          <motion.div variants={itemVariants} className="sm:col-span-1 lg:col-span-1">
            <DoubleBezelCard hover className="h-full">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <TrendingUp className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t.landing.bento.portfolio}</h3>
                  <p className="text-xs text-muted-foreground">{t.landing.bento.portfolioDesc}</p>
                </div>
              </div>
              <div className="flex flex-col items-center">
                <svg viewBox="0 0 100 100" className="w-28 h-28">
                  {donutSegments.map((s) => (
                    <circle
                      key={s.label}
                      cx={DONUT_CX}
                      cy={DONUT_CY}
                      r={DONUT_R}
                      fill="none"
                      stroke={s.color}
                      strokeWidth="12"
                      strokeDasharray={s.dash}
                      strokeDashoffset={s.offset}
                      transform="rotate(-90 50 50)"
                      strokeLinecap="round"
                    />
                  ))}
                </svg>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-3 w-full">
                  {MOCK_ALLOCATION.map((a) => (
                    <div key={a.label} className="flex items-center gap-1.5 text-[11px]">
                      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: a.color }} />
                      <span className="text-muted-foreground">{a.label}</span>
                      <span className="font-semibold font-mono">{a.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </DoubleBezelCard>
          </motion.div>

          <motion.div variants={itemVariants} className="sm:col-span-1 lg:col-span-1">
            <DoubleBezelCard hover className="h-full">
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
                {MOCK_TICKER.slice(0, 3).map((c) => (
                  <div key={c.symbol} className="flex items-center justify-between rounded-lg border border-border/40 bg-muted/20 px-3 py-2">
                    <div className="flex items-center gap-2">
                      <CryptoIcon src={c.image} alt={c.name} symbol={c.symbol} size={18} />
                      <span className="text-xs font-medium">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{c.symbol}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold tabular-nums font-mono">{formatPrice(c.price)}</span>
                      <Badge value={c.change24h} className="text-[10px]" />
                    </div>
                  </div>
                ))}
              </div>
            </DoubleBezelCard>
          </motion.div>

          <motion.div variants={itemVariants} className="sm:col-span-2 lg:col-span-2">
            <DoubleBezelCard hover className="h-full">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">{t.landing.bento.realtime}</h3>
                  <p className="text-xs text-muted-foreground">{t.landing.bento.realtimeDesc}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_REALTIME.map((s) => (
                  <div key={s.label} className="rounded-lg border border-border/40 bg-muted/20 p-2.5">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-muted-foreground">{realtimeIcons[s.icon]}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{s.label}</span>
                    </div>
                    <p className="text-xs font-bold tabular-nums font-mono">{s.value}</p>
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
