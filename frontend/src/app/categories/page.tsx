"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { CategoryCard } from "@/components/crypto/category-card";
import { AnimatedMount } from "@/components/ui";
import { toast } from "sonner";

interface TopCoin {
  id: string;
  image: string | null;
}

interface Category {
  id: string;
  name: string;
  market_cap: number;
  market_cap_change_24h: number;
  top_3_coins: TopCoin[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.crypto
      .getCategories()
      .then(setCategories)
      .catch(() => {
        setError("Error al cargar las categorías");
        toast.error("Error al cargar las categorías");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <AnimatedMount>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Categorías</h1>
          <p className="text-muted-foreground mt-1">
            Explora criptomonedas por categoría
          </p>
        </div>

        {error && (
          <div className="rounded-xl border border-red/20 bg-red/5 p-4 text-red text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border bg-card p-5 animate-pulse"
              >
                <div className="h-5 w-32 rounded bg-muted mb-3" />
                <div className="h-4 w-24 rounded bg-muted mb-3" />
                <div className="h-6 w-16 rounded-full bg-muted" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}
      </div>
    </AnimatedMount>
  );
}
