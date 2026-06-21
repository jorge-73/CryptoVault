import { formatMarketCap, cn } from "@/lib/utils";
import { formatCategoryDescription } from "@/lib/crypto-transform";
import { useTranslations } from "@/lib/use-translations";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { BarChart3 } from "lucide-react";
import type { CoinCategory } from "@/types/crypto";

interface CategoryCardProps {
  category: CoinCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const t = useTranslations();
  const description = formatCategoryDescription(category.content, 100);
  const heroCoin = category.top_3_coins[0];

  return (
    <Link href={`/categories/${category.id}`}>
      <article className="group rounded-xl border bg-card p-5 transition-all hover:shadow-lg hover:border-accent/30 hover:-translate-y-0.5 h-full flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 min-w-0">
            {heroCoin?.image ? (
              <div className="relative h-9 w-9 flex-shrink-0 rounded-full border border-border overflow-hidden">
                <Image
                  src={heroCoin.image}
                  alt=""
                  fill
                  unoptimized
                  className="object-contain"
                  sizes="36px"
                />
              </div>
            ) : (
              <div className="h-9 w-9 flex-shrink-0 rounded-full bg-muted flex items-center justify-center">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold truncate group-hover:text-accent transition-colors">
                {category.name}
              </h3>
              <span className="text-xs text-muted-foreground">
                {t.categories.featuredCoins(category.top_3_coins.length)}
              </span>
            </div>
          </div>
          <Badge value={category.market_cap_change_24h} className="ml-2 flex-shrink-0" />
        </div>

        {description && (
          <p className="text-xs text-muted-foreground/80 leading-relaxed mb-3 line-clamp-2">
            {description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between pt-3 border-t border-border/50">
          <div>
            <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{t.crypto.cap}</span>
            <p className="text-sm font-semibold tabular-nums">
              {formatMarketCap(category.market_cap)}
            </p>
          </div>
          {category.volume_24h != null && (
            <div className="text-right">
              <span className="text-[11px] text-muted-foreground uppercase tracking-wider">{t.crypto.vol24h}</span>
              <p className="text-sm font-semibold tabular-nums">
                {formatMarketCap(category.volume_24h)}
              </p>
            </div>
          )}
        </div>

        {category.top_3_coins.length > 0 && (
          <div className="flex items-center gap-1.5 mt-2">
            {category.top_3_coins.slice(0, 3).map((coin, i) => (
              <div
                key={coin.id}
                className="relative h-5 w-5 rounded-full border border-card bg-muted overflow-hidden"
                title={coin.id}
              >
                {coin.image ? (
                  <Image
                    src={coin.image}
                    alt=""
                    fill
                    unoptimized
                    className="object-contain"
                    sizes="20px"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[7px] font-bold uppercase text-muted-foreground">
                    {coin.id[0]}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </article>
    </Link>
  );
}
