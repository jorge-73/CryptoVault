export function CryptoListSkeleton({ count = 9 }: { count?: number }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border bg-card p-4 animate-pulse"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-full bg-muted flex-shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-3 w-6 rounded bg-muted" />
                <div className="h-4 w-28 rounded bg-muted" />
              </div>
              <div className="h-3 w-12 rounded bg-muted" />
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div className="space-y-1.5">
              <div className="h-5 w-24 rounded bg-muted" />
              <div className="h-4 w-16 rounded bg-muted" />
            </div>
            <div className="space-y-1 text-right">
              <div className="h-3 w-16 rounded bg-muted ml-auto" />
              <div className="h-3 w-20 rounded bg-muted ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
