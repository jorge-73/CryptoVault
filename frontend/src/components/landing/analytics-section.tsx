"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMarketCap } from "@/lib/utils";
import { useTranslations } from "@/lib/use-translations";
import { MOCK_CATEGORIES } from "./mock-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function AnalyticsSection() {
  const t = useTranslations();

  return (
    <section>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">{t.landing.analytics.title}</h2>
            <p className="text-muted-foreground mt-2">{t.landing.analytics.subtitle}</p>
          </div>
          <Link
            href="/categories"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            {t.landing.analytics.viewAll} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {MOCK_CATEGORIES.map((cat) => (
            <motion.div
              key={cat.id}
              variants={itemVariants}
              className="group rounded-xl border bg-card p-5 transition-all hover:shadow-lg hover:border-accent/30 hover:-translate-y-0.5"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 flex-shrink-0 rounded-full bg-muted flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <h3 className="font-semibold group-hover:text-accent transition-colors">{cat.name}</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-muted-foreground">{t.landing.analytics.coinsCount(cat.top_3_coins.length)}</span>
                    <Badge value={cat.market_cap_change_24h} className="text-[10px]" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground uppercase tracking-wider">{t.landing.analytics.cap}</span>
                <span className="font-semibold tabular-nums">{formatMarketCap(cat.market_cap)}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <Link
          href="/categories"
          className="sm:hidden inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline mt-4"
        >
          {t.landing.analytics.viewAll} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
