import { cn, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { es } from "@/translations/es";

interface BadgeProps {
  value: number | null | undefined;
  className?: string;
  period?: string;
}

export function Badge({ value, className, period }: BadgeProps) {
  if (value == null) {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-md bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground", className)}>
        {period && <span className="opacity-60">{period}</span>}
        <Minus className="h-3 w-3" />
        {es.badge.na}
      </span>
    );
  }

  const isPositive = value >= 0;
  const formatted = formatPercentage(value);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium",
        isPositive
          ? "bg-green/10 text-green"
          : "bg-red/10 text-red",
        className
      )}
    >
      {isPositive ? (
        <TrendingUp className="h-3 w-3" />
      ) : (
        <TrendingDown className="h-3 w-3" />
      )}
      {period && <span className="opacity-60">{period}</span>}
      {formatted}
    </span>
  );
}
