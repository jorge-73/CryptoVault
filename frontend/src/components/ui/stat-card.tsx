import { memo } from "react";
import { cn, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

type StatCardTheme = "default" | "accent" | "positive" | "negative" | "neutral";
type StatCardSize = "sm" | "md";

interface StatCardProps {
  label: string;
  value: string;
  trend?: number | null;
  icon?: React.ReactNode;
  className?: string;
  theme?: StatCardTheme;
  size?: StatCardSize;
}

const themeStyles: Record<StatCardTheme, string> = {
  default: "border bg-card hover:border-accent/30",
  accent: "border-accent/30 bg-surface",
  positive: "border-green/20 bg-green/5",
  negative: "border-red/20 bg-red/5",
  neutral: "border-border bg-muted/20",
};

const sizeStyles: Record<StatCardSize, string> = {
  sm: "p-3",
  md: "p-4",
};

const valueSizeStyles: Record<StatCardSize, string> = {
  sm: "text-sm",
  md: "text-xl sm:text-2xl",
};

export const StatCard = memo(function StatCard({
  label,
  value,
  trend,
  icon,
  className,
  theme = "default",
  size = "md",
}: StatCardProps) {
  const isPositive = trend != null && trend >= 0;

  const valueClass =
    value.length > 17
      ? "text-sm sm:text-base"
      : value.length > 12
        ? "text-base sm:text-lg"
        : valueSizeStyles[size];

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-xl transition-colors",
        themeStyles[theme],
        sizeStyles[size],
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>

      <span className={cn("font-bold tabular-nums font-mono min-w-0 [overflow-wrap:anywhere]", valueClass)}>{value}</span>

      {trend != null && (
        <div className="flex items-center gap-1">
          {isPositive ? (
            <TrendingUp className="h-3.5 w-3.5 text-green" />
          ) : (
            <TrendingDown className="h-3.5 w-3.5 text-red" />
          )}
          <span
            className={cn(
              "text-xs font-medium",
              isPositive ? "text-green" : "text-red",
            )}
          >
            {formatPercentage(trend)}
          </span>
        </div>
      )}
    </div>
  );
});
