import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice, formatMarketCap } from "@/lib/utils";

interface CryptoCardProps {
  coin: {
    id: string;
    name: string;
    symbol: string;
    image: string;
    current_price: number | null;
    market_cap: number;
    market_cap_rank: number | null;
    price_change_percentage_24h: number | null;
    price_change_percentage_7d_in_currency?: number | null;
    total_volume: number;
  };
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const CryptoCard = memo(function CryptoCard({ coin, isFavorite, onToggleFavorite }: CryptoCardProps) {
  return (
    <div className="group relative rounded-xl border bg-card p-4 transition-all hover:shadow-lg hover:border-accent/30 hover:-translate-y-0.5">
      {onToggleFavorite && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onToggleFavorite(coin.id);
          }}
          className={cn(
            "absolute top-3 right-3 flex h-7 w-7 items-center justify-center rounded-md transition-colors z-10",
            isFavorite
              ? "text-yellow-500 hover:text-yellow-600"
              : "text-muted-foreground/40 hover:text-yellow-500"
          )}
          aria-label={isFavorite ? `Quitar ${coin.name} de favoritos` : `Añadir ${coin.name} a favoritos`}
        >
          <Star className={cn("h-4 w-4", isFavorite && "fill-current")} />
        </button>
      )}

      <Link
        href={`/coin/${coin.id}`}
        className="flex flex-col gap-3"
      >
        <div className="flex items-center gap-3">
          <div className="relative h-9 w-9 flex-shrink-0">
            <Image
              src={coin.image}
              alt={`Logo de ${coin.name}`}
              fill
              unoptimized
              className="rounded-full object-contain"
              sizes="36px"
            />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-muted-foreground tabular-nums">
                #{coin.market_cap_rank ?? "—"}
              </span>
              <h3 className="font-semibold truncate text-sm group-hover:text-accent transition-colors">{coin.name}</h3>
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {coin.symbol}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-bold tabular-nums leading-none">
              {formatPrice(coin.current_price)}
            </p>
            <div className="flex items-center gap-1.5 mt-1.5">
              <Badge value={coin.price_change_percentage_24h} period="24h" />
              {coin.price_change_percentage_7d_in_currency != null && (
                <Badge value={coin.price_change_percentage_7d_in_currency} period="7d" />
              )}
            </div>
          </div>

          <div className="text-right space-y-0.5">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Cap.</p>
              <p className="text-xs font-semibold tabular-nums">
                {formatMarketCap(coin.market_cap)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Vol 24h</p>
              <p className="text-xs font-medium tabular-nums text-muted-foreground">
                {formatMarketCap(coin.total_volume)}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
});
