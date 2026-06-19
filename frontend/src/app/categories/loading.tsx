export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <div className="h-8 w-48 rounded bg-muted animate-pulse mb-2" />
      <div className="h-4 w-72 rounded bg-muted animate-pulse mb-8" />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 animate-pulse">
            <div className="h-3 w-20 rounded bg-muted mb-2" />
            <div className="h-5 w-28 rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="h-6 w-40 rounded bg-muted animate-pulse mb-4" />
      <div className="flex gap-3 mb-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="w-56 rounded-xl border bg-card p-4 animate-pulse flex-shrink-0">
            <div className="h-4 w-12 rounded bg-muted mb-3" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
        ))}
      </div>

      <div className="h-6 w-40 rounded bg-muted animate-pulse mb-4" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-5 animate-pulse">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-full bg-muted" />
              <div className="h-4 w-28 rounded bg-muted" />
            </div>
            <div className="h-3 w-full rounded bg-muted mb-1" />
            <div className="h-3 w-3/4 rounded bg-muted mb-4" />
            <div className="h-4 w-20 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
