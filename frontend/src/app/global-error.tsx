"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="bg-background text-foreground">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-16 sm:py-24 text-center">
          <h1 className="text-xl sm:text-2xl font-semibold mb-2 text-red">Error crítico</h1>
          <p className="text-muted-foreground mb-8 max-w-sm mx-auto">
            Ocurrió un error inesperado. Por favor, intenta de nuevo.
          </p>
          <button
            onClick={reset}
            className="rounded-xl bg-accent px-6 py-3 text-sm font-medium text-accent-foreground hover:bg-accent/90 transition-all"
          >
            Intentar de nuevo
          </button>
        </div>
      </body>
    </html>
  );
}
