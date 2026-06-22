"use client";

import { useState } from "react";
import { useTranslations } from "@/lib/use-translations";
import { X, Plus } from "lucide-react";

interface AddHoldingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    cryptoId: string;
    coinName: string;
    coinSymbol: string;
    coinImage?: string;
    amount: number;
    entryPrice: number;
  }) => Promise<void>;
}

export function AddHoldingModal({ open, onClose, onSubmit }: AddHoldingModalProps) {
  const t = useTranslations();
  const [cryptoId, setCryptoId] = useState("");
  const [coinName, setCoinName] = useState("");
  const [coinSymbol, setCoinSymbol] = useState("");
  const [coinImage, setCoinImage] = useState("");
  const [amount, setAmount] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cryptoId.trim() || !coinName.trim() || !coinSymbol.trim() || !amount || !entryPrice) return;

    setSubmitting(true);
    try {
      await onSubmit({
        cryptoId: cryptoId.trim().toLowerCase(),
        coinName: coinName.trim(),
        coinSymbol: coinSymbol.trim().toLowerCase(),
        coinImage: coinImage.trim() || undefined,
        amount: parseFloat(amount),
        entryPrice: parseFloat(entryPrice),
      });
      setCryptoId("");
      setCoinName("");
      setCoinSymbol("");
      setCoinImage("");
      setAmount("");
      setEntryPrice("");
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="relative w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        suppressHydrationWarning
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors active:scale-95 cursor-pointer"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="text-lg font-semibold mb-6">{t.portfolio.modal.title}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              {t.portfolio.modal.cryptoId}
            </label>
            <input
              value={cryptoId}
              onChange={(e) => setCryptoId(e.target.value)}
              placeholder={t.portfolio.modal.cryptoPlaceholder}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {t.portfolio.modal.cryptoId} name
              </label>
              <input
                value={coinName}
                onChange={(e) => setCoinName(e.target.value)}
                placeholder="Bitcoin"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Symbol
              </label>
              <input
                value={coinSymbol}
                onChange={(e) => setCoinSymbol(e.target.value)}
                placeholder="btc"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Image URL (opcional)
            </label>
            <input
              value={coinImage}
              onChange={(e) => setCoinImage(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {t.portfolio.modal.amount}
              </label>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={t.portfolio.modal.amountPlaceholder}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {t.portfolio.modal.entryPrice}
              </label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => setEntryPrice(e.target.value)}
                placeholder={t.portfolio.modal.entryPricePlaceholder}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors active:scale-95 cursor-pointer"
            >
              {t.portfolio.modal.cancel}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {submitting ? t.portfolio.modal.submitting : t.portfolio.modal.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
