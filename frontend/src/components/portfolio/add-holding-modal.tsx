"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useTranslations } from "@/lib/use-translations";
import { useDebounce } from "@/hooks";
import { api } from "@/lib/api";
import { CryptoIcon } from "@/components/ui/crypto-icon";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { X, Search, ArrowLeft, Plus, Loader2 } from "lucide-react";

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

interface SearchCoin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number | null;
  price_change_percentage_24h: number | null;
}

export function AddHoldingModal({ open, onClose, onSubmit }: AddHoldingModalProps) {
  const t = useTranslations();

  const [step, setStep] = useState<"search" | "form">("search");
  const [query, setQuery] = useState("");
  const [coins, setCoins] = useState<SearchCoin[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);
  const [selected, setSelected] = useState<SearchCoin | null>(null);
  const [amount, setAmount] = useState("");
  const [entryPrice, setEntryPrice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ amount?: string; entryPrice?: string }>({});

  const inputRef = useRef<HTMLInputElement>(null);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (!open) return;
    setStep("search");
    setQuery("");
    setSelected(null);
    setAmount("");
    setEntryPrice("");
    setErrors({});
    setSubmitting(false);
    setCoins([]);
    setLoadError(false);

    setLoading(true);
    api.crypto.getMarkets("usd", 250)
      .then(setCoins)
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, [open]);

  useEffect(() => {
    if (step === "search" && open) {
      inputRef.current?.focus();
    }
  }, [step, open]);

  const results = useMemo(() => {
    if (debouncedQuery.length < 1) return [];
    const q = debouncedQuery.toLowerCase();
    return coins.filter(
      (c) => c.name.toLowerCase().includes(q) || c.symbol.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [debouncedQuery, coins]);

  const validate = (): boolean => {
    const newErrors: { amount?: string; entryPrice?: string } = {};
    const amt = parseFloat(amount);
    const price = parseFloat(entryPrice);

    if (isNaN(amt) || amt <= 0) newErrors.amount = t.portfolio.modal.amountError;
    if (isNaN(price) || price <= 0) newErrors.entryPrice = t.portfolio.modal.entryPriceError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSelect = (coin: SearchCoin) => {
    setSelected(coin);
    setStep("form");
    setQuery("");
  };

  const handleBack = () => {
    setStep("search");
    setSelected(null);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected || !validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        cryptoId: selected.id,
        coinName: selected.name,
        coinSymbol: selected.symbol,
        coinImage: selected.image || undefined,
        amount: parseFloat(amount),
        entryPrice: parseFloat(entryPrice),
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

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

        {step === "search" && (
          <div className="space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.portfolio.modal.searchPlaceholder}
                className="w-full h-10 rounded-lg border bg-muted/50 pl-9 pr-9 text-sm outline-none placeholder:text-muted-foreground/60 focus:border-accent/50 focus:bg-background focus:ring-2 focus:ring-accent/50 transition-colors"
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-90 cursor-pointer"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            <div className="max-h-64 overflow-y-auto -mx-2 px-2">
              {loading && (
                <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {t.portfolio.modal.searchLoading}
                </div>
              )}

              {loadError && (
                <p className="py-6 text-sm text-center text-red">{t.portfolio.modal.searchError}</p>
              )}

              {!loading && !loadError && query && results.length === 0 && (
                <p className="py-6 text-sm text-center text-muted-foreground">{t.portfolio.modal.searchNoResults}</p>
              )}

              {!loading && !loadError && results.length > 0 && (
                <div className="space-y-1">
                  {results.map((coin) => (
                    <button
                      key={coin.id}
                      onClick={() => handleSelect(coin)}
                      className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm hover:bg-muted transition-colors active:scale-[0.99] cursor-pointer"
                    >
                      <CryptoIcon src={coin.image} alt={coin.name} symbol={coin.symbol} size={24} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium truncate">{coin.name}</div>
                        <div className="text-xs text-muted-foreground uppercase">{coin.symbol}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-semibold tabular-nums font-mono text-sm">
                          {formatPrice(coin.current_price)}
                        </div>
                        <Badge value={coin.price_change_percentage_24h} className="text-[10px]" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {step === "form" && selected && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="h-3 w-3" />
              {t.portfolio.modal.back}
            </button>

            <div className="rounded-2xl border border-border/40 bg-card/30 p-1.5 backdrop-blur-sm">
              <div className="rounded-[calc(1.5rem-0.375rem)] bg-card p-4 border border-border/20">
                <div className="flex items-center gap-3 mb-3">
                  <CryptoIcon src={selected.image} alt={selected.name} symbol={selected.symbol} size={40} />
                  <div>
                    <p className="font-semibold">{selected.name}</p>
                    <p className="text-xs text-muted-foreground uppercase font-mono">{selected.symbol}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t.portfolio.modal.currentPrice}</span>
                    <span className="font-semibold tabular-nums font-mono">
                      {formatPrice(selected.current_price)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">24h</span>
                    <Badge value={selected.price_change_percentage_24h} />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {t.portfolio.modal.amount}
              </label>
              <input
                type="number"
                step="any"
                value={amount}
                onChange={(e) => { setAmount(e.target.value); setErrors((prev) => ({ ...prev, amount: undefined })); }}
                placeholder={t.portfolio.modal.amountPlaceholder}
                className={cn(
                  "w-full rounded-lg border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 transition-colors",
                  errors.amount
                    ? "border-red focus:ring-red/50"
                    : "border-border focus:ring-accent/50"
                )}
              />
              {errors.amount && (
                <p className="mt-1 text-xs text-red">{errors.amount}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                {t.portfolio.modal.entryPrice}
              </label>
              <input
                type="number"
                step="any"
                value={entryPrice}
                onChange={(e) => { setEntryPrice(e.target.value); setErrors((prev) => ({ ...prev, entryPrice: undefined })); }}
                placeholder={t.portfolio.modal.entryPricePlaceholder}
                className={cn(
                  "w-full rounded-lg border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 transition-colors",
                  errors.entryPrice
                    ? "border-red focus:ring-red/50"
                    : "border-border focus:ring-accent/50"
                )}
              />
              {errors.entryPrice && (
                <p className="mt-1 text-xs text-red">{errors.entryPrice}</p>
              )}
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
                {submitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                {submitting ? t.portfolio.modal.submitting : t.portfolio.modal.submit}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
