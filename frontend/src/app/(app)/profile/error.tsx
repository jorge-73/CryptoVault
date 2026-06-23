"use client";

import { ErrorState } from "@/components/ui/error-state";
import { es } from "@/translations/es";

export default function ProfileError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <ErrorState message={es.error.favoritesDescription} onRetry={reset} />
    </div>
  );
}
