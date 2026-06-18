import { cn, formatPercentage, formatMarketCap } from "@/lib/utils";

function coinIdToSymbol(id: string): string {
  return id
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 4);
}

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
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-muted-foreground">Top:</span>
          {category.top_3_coins.map((coin, i) => (
            <span
              key={i}
              className="inline-flex items-center justify-center rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              title={coin}
            >
              {coinIdToSymbol(coin)}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}
