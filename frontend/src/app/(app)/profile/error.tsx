"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="rounded-xl border border-red/20 bg-red/5 p-8 text-center">
        <h2 className="text-xl font-bold text-red mb-2">Error al cargar favoritos</h2>
        <p className="text-muted-foreground mb-4">
          No pudimos cargar tu lista de favoritos. Intenta de nuevo.
        </p>
        <button
          onClick={reset}
          className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent/90 transition-colors"
        >
          Intentar de nuevo
        </button>
      </div>
    </div>
  );
}
