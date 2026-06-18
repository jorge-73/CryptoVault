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
    total_volume: number;
  };
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export function CryptoCard({ coin, isFavorite, onToggleFavorite }: CryptoCardProps) {
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
              <h3 className="font-semibold truncate text-sm">{coin.name}</h3>
            </div>
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {coin.symbol}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-bold tabular-nums">
              {formatPrice(coin.current_price)}
            </p>
            <Badge value={coin.price_change_percentage_24h} className="mt-0.5" />
          </div>

          <div className="text-right">
            <p className="text-[11px] text-muted-foreground">Cap.</p>
            <p className="text-xs font-medium tabular-nums">
              {formatMarketCap(coin.market_cap)}
            </p>
          </div>
        </div>
      </Link>
    </div>
  );
}
