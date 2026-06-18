import Image from "next/image";
import { Star } from "lucide-react";
import { cn, formatPrice, formatPercentage, formatMarketCap } from "@/lib/utils";

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
  const isPositive = coin.price_change_percentage_24h != null && coin.price_change_percentage_24h >= 0;

  return (
    <article className="group flex items-center gap-4 rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-accent/30">
      <div className="flex-shrink-0 text-sm text-muted-foreground w-6 text-right">
        {coin.market_cap_rank}
      </div>

      <div className="relative h-10 w-10 flex-shrink-0">
        <Image
          src={coin.image}
          alt={`Logo de ${coin.name}`}
          fill
          unoptimized
          className="rounded-full object-contain"
          sizes="40px"
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold truncate">{coin.name}</h3>
          <span className="text-sm text-muted-foreground uppercase">{coin.symbol}</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Cap. {formatMarketCap(coin.market_cap)}
        </p>
      </div>

      <div className="text-right flex-shrink-0">
        <p className="font-semibold">{formatPrice(coin.current_price)}</p>
        <p
          className={cn(
            "text-sm font-medium",
            isPositive ? "text-green" : "text-red"
          )}
        >
          {formatPercentage(coin.price_change_percentage_24h)}
        </p>
      </div>

      {onToggleFavorite && (
        <button
          onClick={() => onToggleFavorite(coin.id)}
          className={cn(
            "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
            isFavorite
              ? "text-yellow-500 hover:text-yellow-600"
              : "text-muted-foreground hover:text-yellow-500"
          )}
          aria-label={isFavorite ? `Quitar ${coin.name} de favoritos` : `Añadir ${coin.name} a favoritos`}
        >
          <Star className={cn("h-5 w-5", isFavorite && "fill-current")} />
        </button>
      )}
    </article>
  );
}
