import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { es } from "@/translations/es";
import { formatPrice, formatMarketCap } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { MOCK_COINS } from "./mock-data";

const TOP_COINS = MOCK_COINS.slice(0, 3);

function CoinCard({ coin, index }: { coin: typeof TOP_COINS[number]; index: number }) {
  return (
    <div className="rounded-2xl border border-border/40 bg-card/30 p-1.5 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-accent/20 hover:-translate-y-0.5">
      <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-4 border border-border/20">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-muted" />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold">{coin.name}</span>
                <span className="text-[10px] text-muted-foreground uppercase font-mono">{coin.symbol}</span>
              </div>
              <span className="text-[10px] text-muted-foreground">#{coin.market_cap_rank}</span>
            </div>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <span className="text-lg font-bold tabular-nums font-mono">{formatPrice(coin.current_price)}</span>
          <Badge value={coin.price_change_percentage_24h} period="24h" />
        </div>
        <div className="mt-2 pt-2 border-t border-border/30 flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">{es.crypto.cap}</span>
          <span className="font-semibold tabular-nums font-mono">{formatMarketCap(coin.market_cap)}</span>
        </div>
      </div>
    </div>
  );
}

export function MarketPreview() {
  return (
    <section className="border-y border-border/40 bg-muted/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-20">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">{es.landing.marketPreview.title}</h2>
            <p className="text-muted-foreground mt-2">{es.landing.marketPreview.subtitle}</p>
          </div>
          <Link
            href="/market"
            className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
          >
            {es.landing.marketPreview.viewAll} <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {TOP_COINS.map((coin, i) => (
            <CoinCard key={coin.id} coin={coin} index={i} />
          ))}
        </div>

        <Link
          href="/market"
          className="sm:hidden inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline mt-4"
        >
          {es.landing.marketPreview.viewAll} <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  );
}
