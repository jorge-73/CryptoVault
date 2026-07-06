"use client";

import { useEffect } from "react";

export default function LandingError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 text-center">
      <h2 className="text-xl sm:text-2xl font-semibold mb-2">Algo salió mal</h2>
      <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
        No pudimos cargar esta sección. Por favor, intenta de nuevo.
      </p>
      <button
        onClick={reset}
        className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-all active:scale-[0.98]"
      >
        Intentar de nuevo
      </button>
    </div>
  );
}
