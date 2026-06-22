"use client";

import { useTranslations } from "@/lib/use-translations";
import { formatPrice, formatPercentage } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface HoldingRow {
  id: string;
  cryptoId: string;
  coinName: string;
  coinSymbol: string;
  coinImage: string | null;
  amount: number;
  entryPrice: number;
  currentPrice: number | null;
  currentValue: number | null;
  costBasis: number;
  pnl: number | null;
  roi: number | null;
  priceChange24h: number | null;
}

interface PortfolioTableProps {
  holdings: HoldingRow[];
  onRemove: (holdingId: string) => void;
  removingId: string | null;
}

export function PortfolioTable({ holdings, onRemove, removingId }: PortfolioTableProps) {
  const t = useTranslations();

  if (holdings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border p-12 text-center" suppressHydrationWarning>
        <p className="text-sm text-muted-foreground">{t.portfolio.table.noHoldings}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-border" suppressHydrationWarning>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">{t.portfolio.table.coin}</th>
            <th className="text-right px-4 py-3 font-medium text-muted-foreground">{t.portfolio.table.amount}</th>
            <th className="text-right px-4 py-3 font-medium text-muted-foreground">{t.portfolio.table.entryPrice}</th>
            <th className="text-right px-4 py-3 font-medium text-muted-foreground">{t.portfolio.table.currentPrice}</th>
            <th className="text-right px-4 py-3 font-medium text-muted-foreground">{t.portfolio.table.pnl}</th>
            <th className="text-right px-4 py-3 font-medium text-muted-foreground">{t.portfolio.table.roi}</th>
            <th className="text-right px-4 py-3 font-medium text-muted-foreground">{t.portfolio.table.actions}</th>
          </tr>
        </thead>
        <tbody>
          {holdings.map((h) => (
            <tr
              key={h.id}
              className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
            >
              <td className="px-4 py-3">
                <Link
                  href={`/coin/${h.cryptoId}`}
                  className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                >
                  {h.coinImage ? (
                    <img src={h.coinImage} alt={h.coinName} className="h-7 w-7 rounded-full" />
                  ) : (
                    <div className="h-7 w-7 rounded-full bg-muted" />
                  )}
                  <div>
                    <p className="font-medium">{h.coinName}</p>
                    <p className="text-xs text-muted-foreground uppercase">{h.coinSymbol}</p>
                  </div>
                  <ExternalLink className="h-3 w-3 text-muted-foreground ml-1" />
                </Link>
              </td>
              <td className="text-right px-4 py-3 font-mono text-sm">
                {h.amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
              </td>
              <td className="text-right px-4 py-3 font-mono text-sm">
                {formatPrice(h.entryPrice)}
              </td>
              <td className="text-right px-4 py-3 font-mono text-sm">
                {h.currentPrice != null ? formatPrice(h.currentPrice) : "—"}
              </td>
              <td className={cn(
                "text-right px-4 py-3 font-mono text-sm font-medium",
                (h.pnl ?? 0) >= 0 ? "text-green" : "text-red"
              )}>
                {h.pnl != null ? (h.pnl >= 0 ? "+" : "") + formatPrice(h.pnl) : "—"}
              </td>
              <td className="text-right px-4 py-3">
                {h.roi != null ? (
                  <Badge value={h.roi} />
                ) : "—"}
              </td>
              <td className="text-right px-4 py-3">
                <button
                  onClick={() => onRemove(h.id)}
                  disabled={removingId === h.id}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-red hover:bg-red/10 transition-colors active:scale-95 cursor-pointer"
                  aria-label={`Remove ${h.coinName}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
