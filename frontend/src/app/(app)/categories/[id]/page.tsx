"use client";

import { useEffect, useState, use } from "react";
import { api } from "@/lib/api";
import { CategoryDetailHeader } from "@/components/crypto/category-detail-header";
import { CategoryCoinTable, CategoryCoinTableSkeleton } from "@/components/crypto/category-coin-table";
import { AnimatedMount } from "@/components/ui";
import { ErrorState } from "@/components/ui/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import type { CoinCategory } from "@/types/crypto";
import { toast } from "sonner";

export default function CategoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [category, setCategory] = useState<CoinCategory | null>(null);
  const [coins, setCoins] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api.crypto.getCategories(),
      api.crypto.getCategoryCoins(id),
    ])
      .then(([categories, coinsData]) => {
        if (cancelled) return;
        const cat = (categories as CoinCategory[]).find((c) => c.id === id);
        if (!cat) {
          setError("Sector no encontrado");
          return;
        }
        setCategory(cat);
        setCoins(coinsData);
      })
      .catch(() => {
        if (cancelled) return;
        setError("Error al cargar el sector");
        toast.error("Error al cargar el sector");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [id]);

  if (error) {
    return (
      <AnimatedMount>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
          <ErrorState message={error} onRetry={() => window.location.reload()} />
        </div>
      </AnimatedMount>
    );
  }

  return (
    <AnimatedMount>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
        {loading ? (
          <>
            <Skeleton className="h-4 w-40 rounded mb-6" />
            <Skeleton className="h-8 w-48 rounded mb-2" />
            <Skeleton className="h-4 w-full max-w-xl rounded mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-xl border bg-card p-4">
                  <Skeleton className="h-3 w-16 rounded mb-2" />
                  <Skeleton className="h-5 w-24 rounded" />
                </div>
              ))}
            </div>
            <CategoryCoinTableSkeleton />
          </>
        ) : (
          <>
            {category && <CategoryDetailHeader category={category} coinCount={coins.length} />}
            <CategoryCoinTable coins={coins} />
          </>
        )}
      </div>
    </AnimatedMount>
  );
}
