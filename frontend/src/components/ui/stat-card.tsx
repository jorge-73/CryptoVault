import { memo } from "react";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string;
  trend?: number | null;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard = memo(function StatCard({ label, value, trend, icon, className }: StatCardProps) {
  const isPositive = trend != null && trend >= 0;

  return (
    <div
      className={cn(
        "flex flex-col gap-1.5 rounded-xl border bg-card p-4 transition-all hover:shadow-md hover:border-accent/20",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {label}
        </span>
        {icon && <span className="text-muted-foreground">{icon}</span>}
      </div>

      <span className="text-xl sm:text-2xl font-bold">{value}</span>

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
              isPositive ? "text-green" : "text-red"
            )}
          >
            {isPositive ? "+" : ""}
            {trend.toFixed(2)}%
          </span>
        </div>
      )}
    </div>
  );
});
