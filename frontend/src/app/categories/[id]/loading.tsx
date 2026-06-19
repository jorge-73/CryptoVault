export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8">
      <div className="h-4 w-40 rounded bg-muted animate-pulse mb-6" />
      <div className="h-8 w-48 rounded bg-muted animate-pulse mb-2" />
      <div className="h-4 w-full max-w-xl rounded bg-muted animate-pulse mb-6" />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-card p-4 animate-pulse">
            <div className="h-3 w-16 rounded bg-muted mb-2" />
            <div className="h-5 w-24 rounded bg-muted" />
          </div>
        ))}
      </div>
      <div className="h-6 w-20 rounded bg-muted animate-pulse mb-4" />
      <div className="rounded-xl border bg-card overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-4 py-3 border-b border-border/50 last:border-0 animate-pulse"
          >
            <div className="h-4 w-6 rounded bg-muted" />
            <div className="h-6 w-6 rounded-full bg-muted" />
            <div className="h-4 w-24 rounded bg-muted flex-1" />
            <div className="h-4 w-20 rounded bg-muted ml-auto" />
            <div className="h-4 w-16 rounded bg-muted" />
          </div>
        ))}
      </div>
    </div>
  );
}
