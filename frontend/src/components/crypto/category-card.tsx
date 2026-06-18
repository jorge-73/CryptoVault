import { formatMarketCap } from "@/lib/utils";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";

interface TopCoin {
  id: string;
  image: string | null;
}

interface CategoryCardProps {
  category: {
    id: string;
    name: string;
    market_cap: number | null;
    market_cap_change_24h: number | null;
    top_3_coins: TopCoin[];
  };
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <article className="rounded-xl border bg-card p-5 transition-all hover:shadow-lg hover:border-accent/30 hover:-translate-y-0.5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-lg">{category.name}</h3>
        <Badge value={category.market_cap_change_24h} />
      </div>

      <p className="text-xs text-muted-foreground mb-3 uppercase tracking-wider">
        Cap. {formatMarketCap(category.market_cap)}
      </p>

      {category.top_3_coins.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Top:</span>
          <div className="flex -space-x-1.5">
            {category.top_3_coins.map((coin, i) => (
              <div
                key={coin.id}
                className="relative h-7 w-7 rounded-full border-2 border-card bg-muted overflow-hidden"
                title={coin.id}
              >
                {coin.image ? (
                  <Image
                    src={coin.image}
                    alt={coin.id}
                    fill
                    unoptimized
                    className="object-contain"
                    sizes="28px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[9px] font-bold uppercase text-muted-foreground">
                    {coin.id[0]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
