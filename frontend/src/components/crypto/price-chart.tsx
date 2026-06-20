"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { api } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/ui/error-state";

interface PriceChartProps {
  coinId: string;
  coinName: string;
}

const DAYS_OPTIONS = [
  { label: "1d", value: 1 },
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "1y", value: 365 },
] as const;

export function PriceChart({ coinId, coinName }: PriceChartProps) {
  const [days, setDays] = useState(7);
  const [data, setData] = useState<{ timestamp: number; price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api.crypto
      .getChart(coinId, "usd", days)
      .then((res) => setData(res.prices))
      .catch(() => setError("Error al cargar el gráfico"))
      .finally(() => setLoading(false));
  }, [coinId, days]);

  const isPositive = useMemo(() => {
    if (data.length < 2) return true;
    return data[data.length - 1].price >= data[0].price;
  }, [data]);

  const chartData = useMemo(
    () =>
      data.map((p) => ({
        date: new Date(p.timestamp).toLocaleDateString(),
        price: p.price,
      })),
    [data]
  );

  const formatXAxis = (value: string) => {
    const d = new Date(value);
    if (days <= 1) {
      return d.toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
    }
    if (days <= 7) {
      return d.toLocaleDateString("es", { weekday: "short" });
    }
    return d.toLocaleDateString("es", { month: "short", day: "numeric" });
  };

  if (loading) {
    return <Skeleton className="h-64 rounded-xl" />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Precio de {coinName}
        </h2>
        <div className="flex gap-1">
          {DAYS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDays(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors active:scale-95 ${
                days === opt.value
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-accent/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`gradient-${coinId}`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={isPositive ? "var(--green)" : "var(--red)"}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={isPositive ? "var(--green)" : "var(--red)"}
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={formatXAxis}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              domain={["auto", "auto"]}
              tickFormatter={(v: number) => formatPrice(v)}
              width={80}
            />
            <Tooltip
              formatter={(value: any) => [formatPrice(value), "Precio"]}
              labelFormatter={(label: any) => `Fecha: ${label}`}
              contentStyle={{
                borderRadius: "12px",
                border: "1px solid hsl(var(--border))",
                background: "hsl(var(--card))",
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isPositive ? "var(--green)" : "var(--red)"}
              strokeWidth={2}
              fill={`url(#gradient-${coinId})`}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
