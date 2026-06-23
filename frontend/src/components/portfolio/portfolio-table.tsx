"use client";

import { useState, useRef, useCallback } from "react";
import { useTranslations } from "@/lib/use-translations";
import { formatPrice } from "@/lib/formatters";
import { Badge } from "@/components/ui/badge";
import { Trash2, ExternalLink, Pencil, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { motion } from "framer-motion";

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
  onUpdate: (holdingId: string, data: { amount?: number; entryPrice?: number }) => Promise<void>;
  removingId: string | null;
  updatingId: string | null;
}

function EditCell({
  value,
  onSave,
  onCancel,
  placeholder,
  type = "number",
}: {
  value: number;
  onSave: (val: number) => void;
  onCancel: () => void;
  placeholder?: string;
  type?: string;
}) {
  const [draft, setDraft] = useState(value.toLocaleString("es-AR", {
    minimumFractionDigits: type === "price" ? 2 : 6,
    maximumFractionDigits: type === "price" ? 2 : 6,
  }));
  const inputRef = useRef<HTMLInputElement>(null);

  const parseLocaleNumber = (str: string) => {
    const cleaned = str.replace(/\./g, "").replace(",", ".");
    return parseFloat(cleaned);
  };

  const handleSave = useCallback(() => {
    const parsed = parseLocaleNumber(draft);
    if (!isNaN(parsed) && parsed > 0) {
      onSave(parsed);
    } else {
      onCancel();
    }
  }, [draft, onSave, onCancel]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); handleSave(); }
    if (e.key === "Escape") { e.preventDefault(); onCancel(); }
  };

  return (
    <input
      ref={inputRef}
      type="text"
      inputMode="decimal"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={handleSave}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      autoFocus
      className="w-28 rounded-md border border-accent bg-background px-2 py-1 text-right font-mono text-sm outline-none ring-1 ring-accent/50"
    />
  );
}

export function PortfolioTable({ holdings, onRemove, onUpdate, removingId, updatingId }: PortfolioTableProps) {
  const t = useTranslations();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const isEditing = (holdingId: string, field: string) => editingId === `${holdingId}-${field}`;

  const startEdit = (holdingId: string, field: string) => {
    if (updatingId) return;
    setEditingId(`${holdingId}-${field}`);
  };

  const handleSave = async (holdingId: string, field: string, value: number) => {
    setEditingId(null);
    const data = field === "amount" ? { amount: value } : { entryPrice: value };
    await onUpdate(holdingId, data);
  };

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
          {holdings.map((h, i) => (
            <motion.tr
              key={h.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, delay: i * 0.02 }}
              className="border-b border-border last:border-0 transition-colors group"
              onMouseEnter={() => setHoveredId(h.id)}
              onMouseLeave={() => setHoveredId(null)}
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

              <td className="text-right px-4 py-3">
                {isEditing(h.id, "amount") ? (
                  <EditCell
                    value={h.amount}
                    onSave={(val) => handleSave(h.id, "amount", val)}
                    onCancel={() => setEditingId(null)}
                  />
                ) : (
                  <button
                    onClick={() => startEdit(h.id, "amount")}
                    className="relative font-mono text-sm group/edit cursor-pointer"
                    title="Click to edit"
                  >
                    <span>{h.amount.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 6 })}</span>
                    <Pencil className={cn(
                      "inline h-3 w-3 ml-1.5 text-muted-foreground opacity-0 transition-opacity",
                      hoveredId === h.id && "opacity-40 group-hover/edit:opacity-100"
                    )} />
                  </button>
                )}
              </td>

              <td className="text-right px-4 py-3">
                {isEditing(h.id, "entryPrice") ? (
                  <EditCell
                    value={h.entryPrice}
                    onSave={(val) => handleSave(h.id, "entryPrice", val)}
                    onCancel={() => setEditingId(null)}
                    type="price"
                  />
                ) : (
                  <button
                    onClick={() => startEdit(h.id, "entryPrice")}
                    className="relative font-mono text-sm group/edit cursor-pointer"
                    title="Click to edit"
                  >
                    <span>{formatPrice(h.entryPrice)}</span>
                    <Pencil className={cn(
                      "inline h-3 w-3 ml-1.5 text-muted-foreground opacity-0 transition-opacity",
                      hoveredId === h.id && "opacity-40 group-hover/edit:opacity-100"
                    )} />
                  </button>
                )}
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
                {h.roi != null ? <Badge value={h.roi} /> : "—"}
              </td>

              <td className="text-right px-4 py-3">
                <button
                  onClick={() => onRemove(h.id)}
                  disabled={removingId === h.id || updatingId === h.id}
                  className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-muted-foreground hover:text-red hover:bg-red/10 transition-colors active:scale-95 cursor-pointer disabled:opacity-50"
                  aria-label={`Remove ${h.coinName}`}
                >
                  {removingId === h.id || updatingId === h.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
