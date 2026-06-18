import { cn, formatPercentage, formatMarketCap } from "@/lib/utils";
import Image from "next/image";

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    market_cap: number | null;
    market_cap_change_24h: number | null;
    top_3_coins: string[];
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  const isPositive = category.market_cap_change_24h != null && category.market_cap_change_24h >= 0;

  return (
    <article className="rounded-xl border bg-card p-5 transition-all hover:shadow-md hover:border-accent/30">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{category.name}</h3>
        <span
          className={cn(
            "text-sm font-medium px-2 py-0.5 rounded-full",
            isPositive ? "bg-green/10 text-green" : "bg-red/10 text-red"
          )}
        >
          {formatPercentage(category.market_cap_change_24h)}
        </span>
      </div>

      <p className="text-sm text-muted-foreground mb-3">
        Capitalización: {formatMarketCap(category.market_cap)}
      </p>

      {category.top_3_coins.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Top:</span>
          <div className="flex -space-x-2">
            {category.top_3_coins.map((coin, i) => (
              <div
                key={i}
                className="relative h-6 w-6 rounded-full border-2 border-card bg-muted overflow-hidden"
                title={coin}
              >
                <Image
                  src={`https://assets.coingecko.com/coins/images/1/small/${coin}.png`}
                  alt={coin}
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="24px"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
