"use client";

import { useEffect, useState, useCallback } from "react";
import { useTranslations } from "@/lib/use-translations";
import { api } from "@/lib/api";
import { SectionHeader, AnimatedMount } from "@/components/ui";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/providers/auth-provider";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plus, Download } from "lucide-react";
import { PortfolioSummary } from "@/components/portfolio/portfolio-summary";
import { PortfolioTable } from "@/components/portfolio/portfolio-table";
import { AddHoldingModal } from "@/components/portfolio/add-holding-modal";
import dynamic from "next/dynamic";

const PortfolioChart = dynamic(
  () => import("@/components/portfolio/portfolio-chart").then((m) => ({ default: m.PortfolioChart })),
  { ssr: false, loading: () => <Skeleton className="h-64 rounded-2xl" /> }
);

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

interface PortfolioData {
  id: string;
  name: string;
  totalValue: number;
  totalCostBasis: number;
  totalPnl: number;
  totalRoi: number | null;
  holdingsCount: number;
  holdings: HoldingRow[];
}

export default function PortfolioPage() {
  const t = useTranslations();
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchPortfolio = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.portfolio.get();
      setData(res as PortfolioData);
    } catch {
      setError(t.portfolio.error.load);
    } finally {
      setLoading(false);
    }
  }, [user, t]);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/auth/login");
      return;
    }
    if (user) {
      fetchPortfolio();
    }
  }, [user, authLoading, router, fetchPortfolio]);

  const handleAddHolding = async (holdingData: {
    cryptoId: string;
    coinName: string;
    coinSymbol: string;
    coinImage?: string;
    amount: number;
    entryPrice: number;
  }) => {
    try {
      await api.portfolio.addHolding(holdingData);
      toast.success(t.portfolio.toastAdded);
      await fetchPortfolio();
    } catch {
      toast.error(t.portfolio.error.add);
    }
  };

  const handleUpdateHolding = async (holdingId: string, data: { amount?: number; entryPrice?: number }) => {
    setUpdatingId(holdingId);
    try {
      await api.portfolio.updateHolding(holdingId, data);
      toast.success(t.portfolio.toastAdded);
      await fetchPortfolio();
    } catch {
      toast.error(t.portfolio.error.update);
    } finally {
      setUpdatingId(null);
    }
  };

  const exportCsv = () => {
    if (!data) return;
    const headers = [
      "Asset", "Symbol", "Amount", "Entry Price", "Current Price",
      "Invested Value", "Current Value", "Profit/Loss", "ROI",
    ];
    const rows = data.holdings.map((h) => [
      `"${h.coinName}"`,
      h.coinSymbol.toUpperCase(),
      h.amount,
      h.entryPrice,
      h.currentPrice ?? "",
      h.costBasis,
      h.currentValue ?? "",
      h.pnl ?? "",
      h.roi != null ? `${h.roi.toFixed(2)}%` : "",
    ].join(","));

    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `portfolio-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleRemoveHolding = async (holdingId: string) => {
    setRemovingId(holdingId);
    try {
      await api.portfolio.removeHolding(holdingId);
      toast.success(t.portfolio.toastRemoved);
      await fetchPortfolio();
    } catch {
      toast.error(t.portfolio.error.remove);
    } finally {
      setRemovingId(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-5 w-72" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <ErrorState message={error} onRetry={fetchPortfolio} />
      </div>
    );
  }

  return (
    <AnimatedMount>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8" suppressHydrationWarning>
        <div className="flex items-start justify-between">
          <div>
            <SectionHeader
              title={t.portfolio.title}
              description={t.portfolio.subtitle}
            />
          </div>
          <div className="flex items-center gap-3">
            {data && data.holdings.length > 0 && (
              <button
                onClick={exportCsv}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-muted transition-colors active:scale-95 cursor-pointer"
              >
                <Download className="h-4 w-4" />
                {t.portfolio.table.exportCsv}
              </button>
            )}
            <button
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors active:scale-95 cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              {t.portfolio.table.addHolding}
            </button>
          </div>
        </div>

        {data && (
          <>
            <PortfolioSummary
              totalValue={data.totalValue}
              totalCostBasis={data.totalCostBasis}
              totalPnl={data.totalPnl}
              totalRoi={data.totalRoi}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <PortfolioTable
                  holdings={data.holdings}
                  onRemove={handleRemoveHolding}
                  onUpdate={handleUpdateHolding}
                  removingId={removingId}
                  updatingId={updatingId}
                />
              </div>
              <div>
                <PortfolioChart
                  holdings={data.holdings.map((h) => ({
                    coinName: h.coinName,
                    coinSymbol: h.coinSymbol,
                    currentValue: h.currentValue ?? 0,
                    color: "",
                  }))}
                />
              </div>
            </div>
          </>
        )}

        <AddHoldingModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleAddHolding}
        />
      </div>
    </AnimatedMount>
  );
}
