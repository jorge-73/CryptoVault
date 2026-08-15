"use client";

import { useMemo } from "react";
import { useTranslations } from "@/lib/use-translations";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface HoldingAllocation {
  coinName: string;
  coinSymbol: string;
  currentValue: number;
  color: string;
}

const CHART_COLORS = [
  "var(--accent)",
  "var(--green)",
  "var(--red)",
  "var(--secondary)",
  "var(--muted-foreground)",
];

interface PortfolioChartProps {
  holdings: HoldingAllocation[];
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const data = payload[0].payload;
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 text-xs" suppressHydrationWarning>
      <p className="font-medium">{data.coinName} ({data.coinSymbol.toUpperCase()})</p>
      <p className="text-muted-foreground">
        ${data.currentValue.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        <span className="ml-1">({(data.percent).toFixed(1)}%)</span>
      </p>
    </div>
  );
}

export function PortfolioChart({ holdings }: PortfolioChartProps) {
  const t = useTranslations();
  const total = useMemo(() => holdings.reduce((sum, h) => sum + h.currentValue, 0), [holdings]);

  const data = useMemo(() => {
    if (total === 0) return [];
    return holdings.map((h, i) => ({
      ...h,
      percent: (h.currentValue / total) * 100,
      fill: CHART_COLORS[i % CHART_COLORS.length],
    }));
  }, [holdings, total]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-dashed border-border p-12" suppressHydrationWarning>
        <p className="text-sm text-muted-foreground">{t.portfolio.table.noHoldings}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4" suppressHydrationWarning>
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{t.portfolio.table.allocation}</h3>
      <div className="flex flex-col sm:flex-row items-center gap-6">
        <div className="h-48 w-48 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="currentValue"
                nameKey="coinSymbol"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry, i) => (
                  <Cell key={entry.coinSymbol} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-1.5 w-full">
          {data.map((h) => (
            <div key={h.coinSymbol} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: h.fill }} />
                <span className="font-medium">{h.coinSymbol.toUpperCase()}</span>
              </div>
              <span className="text-muted-foreground">
                ${h.currentValue.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({h.percent.toFixed(1)}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
