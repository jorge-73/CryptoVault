import { cn, formatPercentage } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { es } from "@/translations/es";

type BadgeSize = "xs" | "sm" | "md" | "lg";

interface BadgeProps {
  value: number | null | undefined;
  className?: string;
  period?: string;
  size?: BadgeSize;
}

const sizeStyles: Record<BadgeSize, string> = {
  xs: "text-[8px] px-1 py-0.5",
  sm: "text-[10px] px-1.5 py-0.5",
  md: "text-xs px-1.5 py-0.5",
  lg: "text-sm px-2 py-0.5",
};

const iconSizes: Record<BadgeSize, string> = {
  xs: "h-2 w-2",
  sm: "h-2.5 w-2.5",
  md: "h-3 w-3",
  lg: "h-3.5 w-3.5",
};

export function Badge({ value, className, period, size = "md" }: BadgeProps) {
  if (value == null) {
    return (
      <span className={cn("inline-flex items-center gap-1 rounded-md bg-muted font-medium text-muted-foreground", sizeStyles[size], className)}>
        {period && <span className="opacity-60">{period}</span>}
        <Minus className={iconSizes[size]} />
        {es.badge.na}
      </span>
    );
  }

  const isPositive = value >= 0;
  const formatted = formatPercentage(value);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md font-medium",
        isPositive
          ? "bg-green/10 text-green"
          : "bg-red/10 text-red",
        sizeStyles[size],
        className
      )}
    >
      {isPositive ? (
        <TrendingUp className={iconSizes[size]} />
      ) : (
        <TrendingDown className={iconSizes[size]} />
      )}
      {period && <span className="opacity-60">{period}</span>}
      {formatted}
    </span>
  );
}
