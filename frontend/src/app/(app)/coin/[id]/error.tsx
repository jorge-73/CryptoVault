"use client";

import { ErrorState } from "@/components/ui/error-state";
import { es } from "@/translations/es";

export default function CoinDetailError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
      <ErrorState message={es.coinDetail.errorLoading} onRetry={reset} />
    </div>
  );
}
