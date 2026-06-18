export function CryptoListSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-xl border bg-card p-4 animate-pulse"
        >
          <div className="h-6 w-6 rounded bg-muted flex-shrink-0" />
          <div className="h-10 w-10 rounded-full bg-muted flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 rounded bg-muted" />
            <div className="h-3 w-24 rounded bg-muted" />
          </div>
          <div className="space-y-2 text-right">
            <div className="h-4 w-20 rounded bg-muted ml-auto" />
            <div className="h-3 w-14 rounded bg-muted ml-auto" />
          </div>
          <div className="h-9 w-9 rounded-lg bg-muted flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
